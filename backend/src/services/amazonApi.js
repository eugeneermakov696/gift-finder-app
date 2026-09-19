const crypto = require('crypto'); 

// Configuration loaded from environment variables
const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG;
const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY;
const REGION = process.env.AWS_REGION || 'us-east-1';
const HOST = 'webservices.amazon.com'; // Fixed: Converted raw string token into valid literal boundary
const PATH = '/paapi5/getitems'; 

// Check if running inside the serverless-offline simulator
const isOffline = process.env.IS_OFFLINE === 'true'; 

// Local Mock Data Registry matching seeded inventory identifiers
const MOCK_PRODUCTS = {
'B00X4WHP5E': {
itemId: 'B00X4WHP5E',
itemName: 'Kindle Paperwhite (16 GB) - Local Mock Mode',
price: 139.99,
currency: 'USD',
imageUrl: 'https://m.media-amazon.com/images/I/61Zu0gV2d1L.*AC_SX679*.jpg',
itemUrl: 'https://www.amazon.com/dp/B00X4WHP5E'
},
'B07FBK95PC': {
itemId: 'B07FBK95PC',
itemName: 'Keurig K-Mini Single Serve Coffee Maker - Local Mock Mode',
price: 79.99,
currency: 'USD',
imageUrl: 'https://m.media-amazon.com/images/I/71s8L5Y-KIL.*AC_SX679*.jpg',
itemUrl: 'https://www.amazon.com/dp/B07FBK95PC'
}
}; 

/** 

* Generates an AWS Signature V4 for Amazon PA-API v5
*/
function signRequest(payload, datetime, date) {
const service = 'ProductAdvertisingAPI';
const algorithm = 'AWS4-HMAC-SHA256'; 

// Fixed: Encapsulated the multi-line configurations below inside active string interpolation backticks
const canonicalHeaders = content-type:application/json; charset=utf-8\nhost:${HOST}\nx-amz-date:${datetime}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPI.GetItems\n;
const signedHeaders = 'content-type;host;x-amz-date;x-amz-target';
const payloadHash = crypto.createHash('sha256').update(payload).digest('hex'); 

const canonicalRequest = POST\n${PATH}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash};
const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex'); 

const credentialScope = ${date}/${REGION}/${service}/aws4_request;
const stringToSign = ${algorithm}\n${datetime}\n${credentialScope}\n${canonicalRequestHash}; 

const kDate = crypto.createHmac('sha256', 'AWS4' + SECRET_KEY).update(date).digest();
const kRegion = crypto.createHmac('sha256', kDate).update(REGION).digest();
const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex'); 

return ${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature};
}

/** 

* Fetches product details from Amazon PA-API by ASIN or retrieves local fallback configuration if offline.
* @param {string} asin - The Amazon Standard Identification Number
* @returns {Promise} Formatted product details
*/
async function getProductByAsin(asin) {
// 1. Intercept execution path if local simulator is active
if (isOffline) {
console.log(🔌 Local Mock Engine Active: Intercepting product discovery loop for ASIN: ${asin}); 

const mockProduct = MOCK_PRODUCTS[asin];
if (!mockProduct) {
// Provide a dynamic fallback payload for unseeded query tests so it doesn't break frontends
return {
itemId: asin,
itemName: Mock Product Variant (ASIN: ${asin}),
price: 19.99,
currency: 'USD',
imageUrl: '[https://m.media-amazon.com/images/I/01placeholder.jpg](https://m.media-amazon.com/images/I/01placeholder.jpg)',
itemUrl: https://www.amazon.com/dp/${asin}
};
}
return mockProduct;
} 

// 2. Production Pathway (Real Network Connection Layer)
if (!ASSOCIATE_TAG || !ACCESS_KEY || !SECRET_KEY) {
throw new Error('Missing Amazon PA-API credentials in environment variables.');
} 

const payload = JSON.stringify({
ItemIds: [asin],
Resources: [
'ItemInfo.Title',
'Images.Primary.Large',
'Offers.Listings.Price'
],
PartnerTag: ASSOCIATE_TAG,
PartnerType: 'Associates'
}); 

const now = new Date();
const datetime = now.toISOString().replace(/[:-]/g, '').substring(0, 15) + 'Z';
const date = datetime.substring(0, 8); 

const authorizationHeader = signRequest(payload, datetime, date); 

try {
const response = await fetch(https://${HOST}${PATH}, {
method: 'POST',
headers: {
'Content-Type': 'application/json; charset=utf-8',
'Host': HOST,
'X-Amz-Date': datetime,
'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPI.GetItems',
'Authorization': authorizationHeader
},
body: payload
}); 

if (!response.ok) {
const errorText = await response.text();
throw new Error(Amazon API responded with status ${response.status}: ${errorText});
}

const data = await response.json();

// Parse the first item returned by Amazon
const item = data.ItemsResult?.Items?.[0];
if (!item) {
throw new Error(Product with ASIN ${asin} not found.);
}

// Standardize the response structure for our database layer
return {
itemId: item.ASIN,
itemName: item.ItemInfo?.Title?.DisplayValue || 'Unknown Product',
price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
currency: item.Offers?.Listings?.[0]?.Price?.Currency || 'USD',
imageUrl: item.Images?.Primary?.Large?.URL || '',
itemUrl: item.DetailPageURL
};

} catch (error) {
console.error('Failed to fetch product from Amazon PA-API:', error);
throw error;
}
}

module.exports = {
getProductByAsin
};