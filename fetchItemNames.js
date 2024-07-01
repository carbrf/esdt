const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchItemNames() {
  try {
    // Replace this array with your actual list of item IDs
    const itemIDs = [/* list of item IDs you need names for */];
    const chunkSize = 1000;
    const itemNameFile = path.join(__dirname, 'itemNames.json');
    
    // If the file already exists, skip fetching names
    if (fs.existsSync(itemNameFile)) {
      console.log('Item names already fetched and stored.');
      return;
    }

    // Split item IDs into chunks to comply with the endpoint's limit
    const chunks = [];
    for (let i = 0; i < itemIDs.length; i += chunkSize) {
      chunks.push(itemIDs.slice(i, i + chunkSize));
    }

    const itemNames = {};
    for (const chunk of chunks) {
      const response = await axios.post('https://esi.evetech.net/latest/universe/names/', chunk, {
        headers: { 'Content-Type': 'application/json' }
      });
      response.data.forEach(item => {
        itemNames[item.id] = item.name;
      });
    }

    fs.writeFileSync(itemNameFile, JSON.stringify(itemNames, null, 2));
    console.log('Item names fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching item names:', error);
  }
}

fetchItemNames();
