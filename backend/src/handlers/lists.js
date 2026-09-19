const dbService = require('../services/dbService');
const { successResponse, errorResponse } = require('../utils/httpResponses'); 

/** 

* POST /lists
* Provisions a brand new empty gift list registry for an authenticated user.
*/
module.exports.create = async (event) => {
try {
console.log('Received payload for creating a gift registry:', JSON.stringify(event)); 

if (!event.body) {
return errorResponse(400, 'Missing request body');
}

const { listId, creatorId, title } = JSON.parse(event.body);

if (!listId || !creatorId || !title) {
return errorResponse(400, 'Missing required parameters: listId, creatorId, and title are required.');
}

// Persist the empty list shell metadata into the database layer
console.log(Creating list shell for ID: ${listId} under Owner: ${creatorId});
const result = await dbService.createGiftList(listId, creatorId, title);

return successResponse(201, {
message: 'Gift registry successfully created.',
registry: result
});

} catch (error) {
console.error('Error handling gift registry creation:', error);
return errorResponse(500, 'Internal Server Error provisioning registry metadata.');
}
};

/** 

* GET /lists/{listId}
* Resolves a complete gift registry data object including the tracked array of items.
*/
module.exports.get = async (event) => {
try {
console.log('Received path lookup request for registry retrieval:', JSON.stringify(event)); 

// Extract path parameters securely passed down by AWS API Gateway proxies
const listId = event.pathParameters?.listId;

if (!listId) {
return errorResponse(400, 'Missing path parameter: listId is required.');
}

console.log(Querying DynamoDB for list entry matching ID: ${listId});
const giftList = await dbService.getGiftListById(listId);

if (!giftList) {
return errorResponse(404, Gift registry list matching identifier '${listId}' was not found.);
}

return successResponse(200, {
message: 'Gift registry resolved successfully.',
registry: giftList
});

} catch (error) {
console.error('Error handling gift registry resolution operations:', error);
return errorResponse(500, 'Internal Server Error executing registry lookup.');
}
};