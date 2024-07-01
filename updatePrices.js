const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function updatePrices() {
    try {
        const response = await axios.get('https://esi.evetech.net/latest/markets/prices/');
        const prices = response.data;
        const filePath = path.join(__dirname, 'prices.json');
        fs.writeFileSync(filePath, JSON.stringify({ prices, timestamp: new Date().toISOString() }, null, 2));
        console.log('Prices updated successfully');
    } catch (error) {
        console.error('Error updating prices:', error);
    }
}

updatePrices();
