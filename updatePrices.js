const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

async function fetchPrices() {
  try {
    // Read the skins.yaml file to get the type IDs
    const skinsFilePath = path.join(__dirname, 'skins.yaml');
    if (!fs.existsSync(skinsFilePath)) {
      throw new Error('skins.yaml file does not exist');
    }

    const skinsData = yaml.load(fs.readFileSync(skinsFilePath, 'utf8'));
    const typeIDs = Object.values(skinsData).flatMap(skin => skin.types);

    // Fetch prices for the extracted type IDs
    const prices = [];
    for (const typeID of typeIDs) {
      const response = await axios.get(`https://esi.evetech.net/latest/markets/prices/`);
      const priceData = response.data.find(item => item.type_id === typeID);
      if (priceData) {
        prices.push(priceData);
      }
    }

    // Write the fetched prices to prices.json
    const pricesFilePath = path.join(__dirname, 'prices.json');
    fs.writeFileSync(pricesFilePath, JSON.stringify(prices, null, 2));
    console.log('Prices fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching prices:', error);
  }
}

fetchPrices();
