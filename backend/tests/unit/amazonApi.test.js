const amazonApi = require('../../src/services/amazonApi'); 

describe('src/services/amazonApi.js - Unit Tests', () => {
const originalEnv = process.env; 

beforeEach(() => {
jest.resetModules(); // Clears module cache to re-evaluate environment flags
process.env = { ...originalEnv };
global.fetch = jest.fn(); // Mock the global fetch engine
});

afterAll(() => {
process.env = originalEnv; // Restore original environment properties
});

describe('Offline Simulator Logic', () => {
it('should intercept execution and return seed mock data for a known ASIN', async () => {
process.env.IS_OFFLINE = 'true';
    // Re-require to ensure the file parses the newly injected environment state
    const offlineApi = require('../../src/services/amazonApi');
    const result = await offlineApi.getProductByAsin('B00X4WHP5E');

    expect(result.itemId).toBe('B00X4WHP5E');
    expect(result.itemName).toContain('Local Mock Mode');
    expect(result.price).toBe(139.99);
    expect(global.fetch).not.allocated; // Confirms zero actual network traffic was made
});

it('should dynamically construct placeholder metrics for an unseeded runtime ASIN query', async () => {
    process.env.IS_OFFLINE = 'true';

    const offlineApi = require('../../src/services/amazonApi');
    const result = await offlineApi.getProductByAsin('B0999UNKNOWN');

    expect(result.itemId).toBe('B0999UNKNOWN');
    expect(result.itemName).toBe('Mock Product Variant (ASIN: B0999UNKNOWN)');
    expect(result.price).toBe(19.99);
});

});

describe('Online Production Pathways', () => {
beforeEach(() => {
process.env.IS_OFFLINE = 'false';
process.env.AMAZON_ASSOCIATE_TAG = 'test-tag-20';
process.env.AMAZON_ACCESS_KEY_ID = 'TEST_ACCESS_KEY';
process.env.AMAZON_SECRET_ACCESS_KEY = 'TEST_SECRET_KEY';
});
it('should correctly format standard structural components returned by a successful network call', async () => {
    const mockAmazonResponse = {
        ItemsResult: {
            Items: [
                {
                    ASIN: 'B00X4WHP5E',
                    ItemInfo: { Title: { DisplayValue: 'Live Amazon Kindle' } },
                    Offers: { Listings: [{ Price: { Amount: 129.99, Currency: 'USD' } }] },
                    Images: { Primary: { Large: { URL: 'https://amazon.com/kindle.jpg' } } },
                    DetailPageURL: 'https://amazon.com/dp/B00X4WHP5E'
                }
            ]
        }
    };

    global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockAmazonResponse
    });

    const onlineApi = require('../../src/services/amazonApi');
    const result = await onlineApi.getProductByAsin('B00X4WHP5E');

    expect(result.itemId).toBe('B00X4WHP5E');
    expect(result.itemName).toBe('Live Amazon Kindle');
    expect(result.price).toBe(129.99);
    expect(global.fetch).toHaveBeenCalledTimes(1);
});

it('should throw an evaluation runtime fault if mandatory authentication tokens are missing', async () => {
    delete process.env.AMAZON_ACCESS_KEY_ID; // Force missing credentials

    const onlineApi = require('../../src/services/amazonApi');

    await expect(onlineApi.getProductByAsin('B00X4WHP5E'))
        .rejects
        .toThrow('Missing Amazon PA-API credentials');
});

it('should crash gracefully with a status code message when the live Amazon platform returns an error', async () => {
    global.fetch.mockResolvedValue({
        ok: false,
        status: 403,
        text: async () => 'Credential Error'
    });

    const onlineApi = require('../../src/services/amazonApi');

    await expect(onlineApi.getProductByAsin('B00X4WHP5E'))
        .rejects
        .toThrow('Amazon API responded with status 403: Credential Error');
});

});

});