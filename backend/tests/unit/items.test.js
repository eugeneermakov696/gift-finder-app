const itemsHandler = require('../../src/handlers/items');
const amazonApi = require('../../src/services/amazonApi');
const dbService = require('../../src/services/dbService');

// Mock out the downstream dependencies completely
jest.mock('../../src/services/amazonApi');
jest.mock('../../src/services/dbService');
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

describe('src/handlers/items.js - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('add() - Handler Execution', () => {
    it('should successfully resolve and append a valid item', async () => {
      const mockEvent = {
        body: JSON.stringify({
          listId: 'list-123',
          asin: 'B00X4WHP5E'
        })
      };
      const mockProduct = {
        itemId: 'B00X4WHP5E',
        itemName: 'Kindle Paperwhite',
        price: 139.99,
        currency: 'USD',
        imageUrl: 'https://amazon.com/image.jpg',
        itemUrl: 'https://amazon.com/dp/B00X4WHP5E'
      };

      amazonApi.getProductByAsin.mockResolvedValue(mockProduct);
      dbService.addItemToList.mockResolvedValue({ items: [mockProduct] });

      const result = await itemsHandler.add(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(201);
      expect(body.product.itemId).toBe('B00X4WHP5E');
    });
  });

  describe('reserve() - Handler Execution', () => {
    it('should return 200 OK when an item is successfully reserved', async () => {
      const mockEvent = {
        body: JSON.stringify({
          listId: 'list-123',
          itemId: 'B00X4WHP5E',
          claimedBy: 'user-789'
        })
      };
      dbService.getGiftListById.mockResolvedValue({
        list_id: 'list-123',
        items: [{ item_id: 'B00X4WHP5E', name: 'Kindle', price: 139.99, currency: 'USD' }]
      });
      dbService.reserveItem.mockResolvedValue({ success: true, message: 'Item successfully reserved' });

      const result = await itemsHandler.reserve(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  // =========================================================================
  // NEW DETACHED DELETE OPERATION SUITE
  // =========================================================================
  describe('delete() - Handler Execution', () => {
    it('should successfully prune an item from the registry list and return a 200 status', async () => {
      const mockEvent = {
        pathParameters: {
          listId: 'list-123',
          itemId: 'B00X4WHP5E'
        }
      };
      dbService.removeItemFromList.mockResolvedValue({ items: [] });

      const result = await itemsHandler.delete(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.message).toContain('successfully pruned');
      expect(body.itemId).toBe('B00X4WHP5E');
      expect(dbService.removeItemFromList).toHaveBeenCalledWith('list-123', 'B00X4WHP5E');
    });

    it('should return 400 Bad Request if essential path parameters are missing', async () => {
      const mockEvent = {
        pathParameters: {
          listId: 'list-123'
          // itemId parameter is omitted
        }
      };

      const result = await itemsHandler.delete(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(400);
      expect(body.error).toBe(true);
      expect(body.message).toContain('Missing path parameters');
      expect(dbService.removeItemFromList).not.toHaveBeenCalled();
    });

    it('should return 404 Not Found if the service target list or item is missing', async () => {
      const mockEvent = {
        pathParameters: {
          listId: 'invalid-list',
          itemId: 'B00X4WHP5E'
        }
      };

      dbService.removeItemFromList.mockRejectedValue(new Error('Item not found in list'));

      const result = await itemsHandler.delete(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(404);
      expect(body.error).toBe(true);
      expect(body.message).toBe('Item not found in list');
    });

    it('should return 409 Conflict if trying to remove an item that has already been purchased', async () => {
      const mockEvent = {
        pathParameters: {
          listId: 'list-123',
          itemId: 'B00X4WHP5E'
        }
      };

      dbService.removeItemFromList.mockRejectedValue(new Error('Cannot delete an item that has already been purchased.'));

      const result = await itemsHandler.delete(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(409);
      expect(body.error).toBe(true);
      expect(body.message).toContain('already been purchased');
    });
  });
});
