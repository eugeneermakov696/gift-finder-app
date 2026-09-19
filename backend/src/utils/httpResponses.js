// Dynamic mapping configuration pulling from your environment stage file configurations
const ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGINS || '*';

const COMMON_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    // Safely enable credentials only if a specific origin domain is explicitly targeted
    'Access-Control-Allow-Credentials': ALLOWED_ORIGIN !== '*',
};

/**
 * Formats a successful AWS API Gateway Lambda proxy response
 * @param {number} statusCode
 * @param {any} data - Array, Object, or Primitive payload
 */
function successResponse(statusCode, data) {
    return {
        statusCode: statusCode,
        headers: COMMON_HEADERS,
        body: JSON.stringify(data),
    };
}

/**
 * Formats an error AWS API Gateway Lambda proxy response with fallback string extraction
 * @param {number} statusCode
 * @param {string|Object|Error} errorMessage
 */
function errorResponse(statusCode, errorMessage) {
    // Safely extract the raw string string text if an actual Error object instance is passed
    const message = errorMessage instanceof Error ? errorMessage.message : errorMessage;

    return {
        statusCode: statusCode,
        headers: COMMON_HEADERS,
        body: JSON.stringify({
            error: true,
            message: message || "An unexpected application error occurred.",
        }),
    };
}

module.exports = {
    successResponse,
    errorResponse,
};
