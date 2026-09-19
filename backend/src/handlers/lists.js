const dbService = require('../services/dbService');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/httpResponses');

/**
 * POST /lists
 * Provisions a brand new empty gift list registry for an authenticated user.
 */
module.exports.create = async (event) => {
  try {
    logger.debug('Received request payload for creating a gift registry', { eventPayload: event.body });

    if (!event.body) {
      logger.warn('Registry creation aborted due to missing request body payload');
      return errorResponse(400, 'Missing request body');
    }

    // Safely parse JSON payload to handle client formatting errors
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (parseError) {
      logger.warn('Registry creation aborted due to malformed JSON payload', { error: parseError.message });
      return errorResponse(400, 'Malformed JSON payload in request body.');
    }

    const { listId, creatorId, title } = parsedBody;

    if (!listId || !creatorId || !title) {
      logger.warn('Registry creation aborted due to missing parameters', { listId, creatorId, title });
      return errorResponse(400, 'Missing required parameters: listId, creatorId, and title are required.');
    }

    // Persist the empty list shell metadata into the database layer
    logger.info('Creating registry list metadata shell record', { listId, creatorId });
    const result = await dbService.createGiftList(listId, creatorId, title);

    return successResponse(201, {
      message: 'Gift registry successfully created.',
      registry: result
    });

  } catch (error) {
    logger.error('Fatal application error encountered provisioning registry metadata', error);
    return errorResponse(500, 'Internal Server Error provisioning registry metadata.');
  }
};

/**
 * GET /lists/{listId}
 * Resolves a complete gift registry data object including the tracked array of items.
 */
module.exports.get = async (event) => {
  try {
    // Extract path parameters securely passed down by AWS API Gateway proxies
    const listId = event.pathParameters?.listId;

    if (!listId) {
      logger.warn('Registry retrieval aborted due to missing path parameter field context');
      return errorResponse(400, 'Missing path parameter: listId is required.');
    }

    // Structured contextual tracing replacing legacy string formatting logs
    logger.info('Querying database for registry item details', { listId });

    const giftList = await dbService.getGiftListById(listId);

    if (!giftList) {
      logger.warn('Target registry search target yielded empty result matching identifier', { listId });
      return errorResponse(404, `Gift registry list matching identifier '${listId}' was not found.`);
    }

    return successResponse(200, {
      message: 'Gift registry resolved successfully.',
      registry: giftList
    });

  } catch (error) {
    logger.error('Fatal failure executing registry lookup routing logic', error);
    return errorResponse(500, 'Internal Server Error executing registry lookup.');
  }
};
