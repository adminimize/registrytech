import Airtable from 'airtable';
import { env } from '$env/dynamic/private';
import { TECH_INVENTORY_FIELDS, PACKAGES_FIELDS } from './airtableDefs';

// Configure Airtable
const base = new Airtable({
  apiKey: env.AIRTABLE_PERSONAL_ACCESS_TOKEN as string
}).base(env.AIRTABLE_BASE_ID as string);

// Generic function to fetch all records from a table
export async function fetchAirtableRecords({
  table,
  view,
  fields,
}: {
  table: string;
  view?: string;
  fields?: string[];
}): Promise<any[]> {
  const records: any[] = [];
  await new Promise<void>((resolve, reject) => {
    base(table)
      .select({
        ...(view ? { view } : {}),
        ...(fields ? { fields } : {}),
      })
      .eachPage(
        (pageRecords, fetchNextPage) => {
          pageRecords.forEach((record) => {
            records.push({
              id: record.id,
              fields: record.fields,
            });
          });
          fetchNextPage();
        },
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
  });
  return records;
} 