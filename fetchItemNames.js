const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchItemNames() {
  try {
    // Read the prices.json file to get the item IDs
    const pricesFilePath = path.join(__dirname, 'prices.json');
    if (!fs.existsSync(pricesFilePath)) {
      throw new Error('prices.json file does not exist');
    }

    const pricesData = JSON.parse(fs.readFileSync(pricesFilePath, 'utf8'));
    console.log("Content of prices.json:", pricesData);

    // Check if pricesData is an array
    if (!Array.isArray(pricesData)) {
      throw new Error('prices.json does not contain an array');
    }

    const itemIDs = pricesData.map(item => item.type_id); // Adjust based on the structure of prices.json
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
