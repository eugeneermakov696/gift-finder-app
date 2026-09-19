const itemsHandler = require('../../src/handlers/items');
const amazonApi = require('../../src/services/amazonApi');
const dbService = require('../../src/services/dbService');
jest.mock('../../src/services/amazonApi');
jest.mock('../../src/services/dbService');

describe('src/handlers/items.js - Unit Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return 200 OK when an item is successfully reserved', async () => {
    const mockEvent = { body: JSON.stringify({ listId: 'list-123', itemId: 'B00X4WHP5E', claimedBy: 'user-789' }) };
    dbService.getGiftListById.mockResolvedValue({ list_id: 'list-123', items: [{ item_id: 'B00X4WHP5E', name: 'Kindle', price: 100 }] });
    dbService.reserveItem.mockResolvedValue({ success: true });

    const result = await itemsHandler.reserve(mockEvent);
    expect(result.statusCode).toBe(200);
  });
});
