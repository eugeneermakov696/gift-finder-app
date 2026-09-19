const amazonApi = require('../services/amazonApi');
const dbService = require('../services/dbService');
const { successResponse, errorResponse } = require('../utils/httpResponses'); 

/** 

* POST /lists/items
* Adds a new item to a gift list by looking up its details using the Amazon ASIN.
*/
module.exports.add = async (event) => {
try {
console.log('Received event for adding item:', JSON.stringify(event)); 

// 1. Parse and validate the request body
if (!event.body) {
return errorResponse(400, 'Missing request body');
}

const { listId, asin } = JSON.parse(event.body);

if (!listId || !asin) {
return errorResponse(400, 'Missing required parameters: listId and asin are required.');
}

// 2. Resolve real-time item specifications from Amazon PA-API
console.log(Fetching product details from Amazon for ASIN: ${asin});
const productDetails = await amazonApi.getProductByAsin(asin);

// 3. Persist the fetched item specifications into the DynamoDB list
console.log(Appending product to DynamoDB list: ${listId});
const updatedAttributes = await dbService.addItemToList(listId, productDetails);

// 4. Return successful HTTP structure
return successResponse(201, {
message: 'Product successfully discovered and added to registry.',
product: productDetails,
updatedItemsCount: updatedAttributes.items?.length || 0
});

} catch (error) {
console.error('Error handling item additions:', error); 

// Differentiate downstream business validation issues from system faults
if (error.message.includes('not found') || error.message.includes('credentials')) {
return errorResponse(422, error.message);
}

return errorResponse(500, 'Internal Server Error processing your request.');

}
};

/** 

* PATCH /lists/items/reserve
* Safely claims/reserves an item in a list without exposing the buyer identity to the owner.
*/
module.exports.reserve = async (event) => {
try {
console.log('Received event for reserving item:', JSON.stringify(event)); 

if (!event.body) {
return errorResponse(400, 'Missing request body');
}

const { listId, itemId, claimedBy } = JSON.parse(event.body);

if (!listId || !itemId || !claimedBy) {
return errorResponse(400, 'Missing required parameters: listId, itemId, and claimedBy are required.');
}

// Atomic conditional execution inside the DB service layer
const result = await dbService.reserveItem(listId, itemId, claimedBy);

return successResponse(200, result);

} catch (error) {
console.error('Error handling item reservation:', error); 

if (error.message.includes('Concurrency Conflict') || error.message.includes('already reserved')) {
return errorResponse(409, error.message); // Conflict status code
}

if (error.message.includes('not found')) {
return errorResponse(404, error.message);
}

return errorResponse(500, 'Internal Server Error processing your reservation.');

}
};