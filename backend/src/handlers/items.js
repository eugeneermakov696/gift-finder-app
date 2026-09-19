// src/handlers/items.js excerpt
const amazonApi = require('../services/amazonApi');
const dbService = require('../services/dbService');

exports.add = async (event) => {
    const { listId, asin } = JSON.parse(event.body);

    // 1. Fetch real-time data directly from Amazon
    const productDetails = await amazonApi.getProductByAsin(asin);

    // 2. Persist to DynamoDB using the fetched details
    await dbService.addItemToList(listId, productDetails);

    return { statusCode: 200, body: JSON.stringify(productDetails) };
};
