const amazonApi = require('../services/amazonApi');
const dbService = require('../services/dbService');
const notification = require('../services/notification');
const { successResponse, errorResponse } = require('../utils/httpResponses');

/**
 * POST /lists/items
 * Resolves a product via the Amazon PA-API using an ASIN and appends it to the DynamoDB registry.
 */
module.exports.add = async (event) => {
  try {
    console.log('Received payload for adding an item:', JSON.stringify(event));

    if (!event.body) {
      return errorResponse(400, 'Missing request body');
    }

    // Safely execute parsing to defend against malformed payloads
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (parseError) {
      return errorResponse(400, 'Malformed JSON payload in request body.');
    }

    const { listId, asin } = parsedBody;

    if (!listId || !asin) {
      return errorResponse(400, 'Missing required parameters: listId and asin are required.');
    }

    // 1. Resolve real-time item specifications from Amazon PA-API
    console.log(`Fetching product details from Amazon for ASIN: ${asin}`);
    const productDetails = await amazonApi.getProductByAsin(asin);

    // 2. Persist the fetched item specifications into the DynamoDB list
    console.log(`Appending product to DynamoDB list: ${listId}`);
    const updatedAttributes = await dbService.addItemToList(listId, productDetails);

    return successResponse(201, {
      message: 'Product successfully added to registry.',
      product: productDetails,
      updatedItemsCount: updatedAttributes.items?.length || 0
    });

  } catch (error) {
    console.error('Error handling item additions:', error);

    if (error.message.includes('not found') || error.message.includes('credentials')) {
      return errorResponse(422, error.message);
    }

    return errorResponse(500, 'Internal Server Error processing your request.');
  }
};

/**
 * PATCH /lists/items/reserve
 * Atomically reserves an item in a list and triggers asynchronous notifications.
 */
module.exports.reserve = async (event) => {
  try {
    console.log('Received payload for reserving an item:', JSON.stringify(event));

    if (!event.body) {
      return errorResponse(400, 'Missing request body');
    }

    // Safely execute parsing to defend against malformed payloads
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (parseError) {
      return errorResponse(400, 'Malformed JSON payload in request body.');
    }

    const { listId, itemId, claimedBy } = parsedBody;

    if (!listId || !itemId || !claimedBy) {
      return errorResponse(400, 'Missing required parameters: listId, itemId, and claimedBy are required.');
    }

    // 1. Fetch the list state to extract structural data needed for notifications
    const list = await dbService.getGiftListById(listId);
    if (!list) {
      return errorResponse(404, 'Gift list not found');
    }

    const targetedItem = list.items?.find(item => item.item_id === itemId);
    if (!targetedItem) {
      return errorResponse(404, 'Item not found within the specified gift list');
    }

    // 2. Perform conditional atomic update on the database layer
    const dbResult = await dbService.reserveItem(listId, itemId, claimedBy);

    // 3. Fire-and-forget downstream notifications asynchronously without blocking HTTP runtime performance
    try {
      const ownerEmailPlaceholder = "registry-owner@example.com";
      await Promise.all([
         notification.sendClaimedAlertNotification({
             listId,
             itemName: targetedItem.name,
             listOwnerEmail: ownerEmailPlaceholder
         }),
         notification.queueTransactionForProcessing({
             action: "ITEM_RESERVATION_RECORD",
             listId,
             itemId,
             claimedBy,
             price: targetedItem.price,
             currency: targetedItem.currency
         })
      ]);
    } catch (notificationError) {
      // Log notification framework errors but do not disrupt a successful core DB transaction response loop
      console.error('Non-blocking secondary notification dispatch failed:', notificationError);
    }

    return successResponse(200, {
      ...dbResult,
      itemId,
      status: "reserved"
    });

  } catch (error) {
    console.error('Error handling item reservation:', error);

    if (error.message.includes('Concurrency Conflict') || error.message.includes('already reserved')) {
      return errorResponse(409, error.message);
    }

    return errorResponse(500, 'Internal Server Error processing your reservation.');
  }
};

/**
 * DELETE /lists/{listId}/items/{itemId}
 * Safely removes a product variant item from a user's gift registry list.
 */
module.exports.delete = async (event) => {
    try {
        const logger = require('../utils/logger'); // Ensure utility is loaded
        logger.info('Received request payload for deleting a registry item', {
            pathParameters: event.pathParameters
        });

        const listId = event.pathParameters?.listId;
        const itemId = event.pathParameters?.itemId;

        if (!listId || !itemId) {
            return errorResponse(400, 'Missing path parameters: listId and itemId are required.');
        }

        // Execute target database pruning routine
        const updatedAttributes = await dbService.removeItemFromList(listId, itemId);

        return successResponse(200, {
            message: 'Item successfully pruned from registry.',
            itemId,
            remainingItemsCount: updatedAttributes.items?.length || 0
        });

    } catch (error) {
        const logger = require('../utils/logger');
        logger.error('Error handling item deletion operations', error);

        if (error.message.includes('not found')) {
            return errorResponse(404, error.message);
        }
        if (error.message.includes('purchased')) {
            return errorResponse(409, error.message); // Conflict error code
        }

        return errorResponse(500, 'Internal Server Error processing your deletion request.');
    }
};
