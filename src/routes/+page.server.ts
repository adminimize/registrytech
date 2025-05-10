import Airtable from 'airtable';
import { env } from '$env/dynamic/private';
import { fetchAirtableRecords, TECH_INVENTORY_FIELDS } from '$lib/airtable';

// Configure Airtable with type assertion for environment variables
const base = new Airtable({ 
  apiKey: env.AIRTABLE_PERSONAL_ACCESS_TOKEN as string 
}).base(env.AIRTABLE_BASE_ID as string);

export const load = async () => {
  try {
    // Fetch records from the Sections table
    const sections = await fetchAirtableRecords({
      table: 'Sections',
      view: 'Grid view',
    });

    // Fetch records from the Inventory table using field IDs from the map
    const inventory = await fetchAirtableRecords({
      table: 'tblapjguthkAXVnyI',
      view: 'All Items',
      fields: [
        TECH_INVENTORY_FIELDS.NAME,
        TECH_INVENTORY_FIELDS.PHOTO,
        TECH_INVENTORY_FIELDS.CATEGORY,
        TECH_INVENTORY_FIELDS.QUANTITY,
        TECH_INVENTORY_FIELDS.IP_ADDRESS,
        TECH_INVENTORY_FIELDS.MAC_ADDRESS,
        TECH_INVENTORY_FIELDS.UPSTREAM,
        TECH_INVENTORY_FIELDS.SWITCH,
        TECH_INVENTORY_FIELDS.VIDEO_INPUT,
        TECH_INVENTORY_FIELDS.SERIAL_NUMBER,
        TECH_INVENTORY_FIELDS.MAKE,
        TECH_INVENTORY_FIELDS.MODEL,
        TECH_INVENTORY_FIELDS.FIRMWARE_VERSION,
        TECH_INVENTORY_FIELDS.LAST_UPDATED,
        TECH_INVENTORY_FIELDS.PASSWORD,
        TECH_INVENTORY_FIELDS.DMX_UNIVERSE,
        TECH_INVENTORY_FIELDS.NOTES,
        TECH_INVENTORY_FIELDS.DMX,
        TECH_INVENTORY_FIELDS.USER_NAME,
        TECH_INVENTORY_FIELDS.BARCODDED_ITEM,
        TECH_INVENTORY_FIELDS.NUMBER_OF_ITEMS,
        TECH_INVENTORY_FIELDS.PACKAGES,
        TECH_INVENTORY_FIELDS.DESCRIPTION,
      ],
    });

    // Filter out networking items and log hidden ones
    const visibleInventory = [];
    const hiddenNetworking = [];
    for (const item of inventory) {
      // Use both field ID and field name for compatibility
      const categories = item.fields[TECH_INVENTORY_FIELDS.CATEGORY] || item.fields['Category'];
      if (Array.isArray(categories)) {
        // Remove 'Network' from categories if present
        const filteredCategories = categories.filter((cat) => cat !== 'Network');
        if (filteredCategories.length === 0 && categories.includes('Network')) {
          // Only network, hide
          hiddenNetworking.push(item);
        } else {
          // Keep, but update categories if needed
          if (filteredCategories.length !== categories.length) {
            item.fields[TECH_INVENTORY_FIELDS.CATEGORY] = filteredCategories;
            item.fields['Category'] = filteredCategories; // for client compatibility
          }
          visibleInventory.push(item);
        }
      } else if (categories === 'Network') {
        hiddenNetworking.push(item);
      } else {
        visibleInventory.push(item);
      }
    }
    if (hiddenNetworking.length > 0) {
      console.log('Hiding networking products:', hiddenNetworking.map(i => i.fields[TECH_INVENTORY_FIELDS.NAME] || i.fields['Name'] || i.id));
    }

    return {
      sections,
      inventory: visibleInventory
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