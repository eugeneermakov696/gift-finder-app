const COMMON_HEADERS = {
'Content-Type': 'application/json',
'Access-Control-Allow-Origin': '*', // Configured for CORS setup
'Access-Control-Allow-Credentials': true,
}; 

function successResponse(statusCode, data) {
return {
statusCode: statusCode,
headers: COMMON_HEADERS,
body: JSON.stringify(data),
};
} 

function errorResponse(statusCode, errorMessage) {
return {
statusCode: statusCode,
headers: COMMON_HEADERS,
body: JSON.stringify({
error: true,
message: errorMessage,
}),
};
} 

module.exports = {
successResponse,
errorResponse,
};