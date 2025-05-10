import Airtable from 'airtable';
import { env } from '$env/dynamic/private';

// Map of all Tech Inventory field IDs
export const TECH_INVENTORY_FIELDS = {
  NAME: 'fldCPXmtYCgZT7Kx7',
  CATEGORY: 'fldOtQNxP2dbFObUe',
  QUANTITY: 'fldKtjYbCjlpGfeCD',
  IP_ADDRESS: 'fldtp9ylfpKkgMNZD',
  MAC_ADDRESS: 'fldpLpmVTJ8XFvCwZ',
  UPSTREAM: 'fld5fH4e3favSS0Z0',
  SWITCH: 'fldbiST3nw6CP1tlf',
  VIDEO_INPUT: 'fldAfEljfA5MTRrxX',
  SERIAL_NUMBER: 'fldgapOFiDZmZBFF9',
  MAKE: 'fld2CaJU46TyKEiB3',
  MODEL: 'fldKq7unH0RdvXu6V',
  FIRMWARE_VERSION: 'fldHpFU5vlI2LiAyO',
  LAST_UPDATED: 'fld1kf3xf0uqkOV82',
  PASSWORD: 'fldOkiXZpDAmzdtKt',
  DMX_UNIVERSE: 'fldIit9m0HJeuwtM8',
  NOTES: 'fldPTdV9hRybE8qGf',
  DMX: 'fld1p9vlbPmqFx1c5',
  USER_NAME: 'fldiJ70FcdwH0VzRV',
  BARCODDED_ITEM: 'fldhImH63FDwKkp52',
  NUMBER_OF_ITEMS: 'fld9X3UikIfYQPtCM',
  PHOTO: 'fldh2lBxOiVfIP0Ap',
  PACKAGES: 'fldRE8hgt01XE4dCM',
  DESCRIPTION: 'fldBzNrl6YbLbE348',
};

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