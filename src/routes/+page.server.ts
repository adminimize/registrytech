import Airtable from 'airtable';
import { env } from '$env/dynamic/private';

// Configure Airtable with type assertion for environment variables
const base = new Airtable({ 
  apiKey: env.AIRTABLE_PERSONAL_ACCESS_TOKEN as string 
}).base(env.AIRTABLE_BASE_ID as string);

export const load = async () => {
  try {
    // Array to store all section records
    const sections: any[] = [];
    // Array to store all inventory records
    const inventory: any[] = [];
    
    // Fetch records from the Sections table using Promise
    await new Promise<void>((resolve, reject) => {
      base('Sections')
        .select({
          view: 'Grid view'
        })
        .eachPage(
          (records, fetchNextPage) => {
            // Process each page of records
            records.forEach(record => {
              console.log('Retrieved section:', record.get('Name'));
              sections.push({
                id: record.id,
                name: record.get('Name'),
                // Add any other fields you need
                fields: record.fields
              });
            });
            
            // Get the next page of records
            fetchNextPage();
          },
          (error) => {
            if (error) {
              console.error('Error in eachPage:', error);
              reject(error);
            } else {
              resolve();
            }
          }
        );
    });
    
    console.log(`Fetched ${sections.length} sections`);
    
    // Fetch records from the Inventory table
    await new Promise<void>((resolve, reject) => {
      base('tblapjguthkAXVnyI')
        .select({
          view: 'All Items',
          fields: ['fldCPXmtYCgZT7Kx7', 'fldh2lBxOiVfIP0Ap']
        })
        .eachPage(
          (records, fetchNextPage) => {
            records.forEach(record => {
              inventory.push({
                id: record.id,
                name: record.get('fldCPXmtYCgZT7Kx7'),
                photo: record.get('fldh2lBxOiVfIP0Ap'),
                fields: record.fields
              });
            });
            fetchNextPage();
          },
          (error) => {
            if (error) {
              console.error('Error in eachPage:', error);
              reject(error);
            } else {
              resolve();
            }
          }
        );
    });
    
    return {
      sections,
      inventory
    };
  } catch (error) {
    console.error('Error fetching sections from Airtable:', error);
    return {
      sections: [],
      inventory: [],
      error: 'Failed to fetch sections'
    };
  }
}; 