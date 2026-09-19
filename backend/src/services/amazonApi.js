const crypto = require('crypto'); 

// Configuration loaded from environment variables
const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG;
const ACCESS_KEY = process.env.AMAZON_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AMAZON_SECRET_ACCESS_KEY;
const REGION = process.env.AWS_REGION || 'us-east-1';
const HOST = webservices.amazon.com; // Change based on locale (e.g., webservices.amazon.co.uk)
const PATH = '/paapi5/getitems'; 

/** 

* Generates an AWS Signature V4 for Amazon PA-API v5
*/
function signRequest(payload, datetime, date) {
const service = 'ProductAdvertisingAPI';
const algorithm = 'AWS4-HMAC-SHA256'; 

// 1. Create Canonical Request
const canonicalHeaders = content-type:application/json; charset=utf-8\nhost:${HOST}\nx-amz-date:${datetime}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPI.GetItems\n;
const signedHeaders = 'content-type;host;x-amz-date;x-amz-target';
const payloadHash = crypto.createHash('sha256').update(payload).digest('hex'); 

const canonicalRequest = POST\n${PATH}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash};
const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex'); 

// 2. Create String to Sign
const credentialScope = ${date}/${REGION}/${service}/aws4_request;
const stringToSign = ${algorithm}\n${datetime}\n${credentialScope}\n${canonicalRequestHash}; 

// 3. Calculate Signature
const kDate = crypto.createHmac('sha256', 'AWS4' + SECRET_KEY).update(date).digest();
const kRegion = crypto.createHmac('sha256', kDate).update(REGION).digest();
const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex'); 

return ${algorithm} Credential=${ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature};
}

/** 

* Fetches product details from Amazon PA-API by ASIN
* @param {string} asin - The Amazon Standard Identification Number
* @returns {Promise} Formatted product details
*/
async function getProductByAsin(asin) {
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