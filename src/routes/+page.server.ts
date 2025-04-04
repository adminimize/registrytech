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
    
    return {
      sections
    };
  } catch (error) {
    console.error('Error fetching sections from Airtable:', error);
    return {
      sections: [],
      error: 'Failed to fetch sections'
    };
  }
}; 