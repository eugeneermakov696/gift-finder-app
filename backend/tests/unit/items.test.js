const itemsHandler = require('../../src/handlers/items');
const amazonApi = require('../../src/services/amazonApi');
const dbService = require('../../src/services/dbService');

// Mock out the downstream dependencies completely
jest.mock('../../src/services/amazonApi');
jest.mock('../../src/services/dbService');

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
        imageUrl: 'https://amazon.com',
        itemUrl: 'https://amazon.com'
      };

      amazonApi.getProductByAsin.mockResolvedValue(mockProduct);
      dbService.addItemToList.mockResolvedValue({ items: [mockProduct] });

      const result = await itemsHandler.add(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(201);
      expect(body.product.itemId).toBe('B00X4WHP5E');
      expect(amazonApi.getProductByAsin).toHaveBeenCalledWith('B00X4WHP5E');
      expect(dbService.addItemToList).toHaveBeenCalledWith('list-123', mockProduct);
    });

    it('should return 400 Bad Request if arguments are missing', async () => {
      const mockEvent = {
        body: JSON.stringify({ listId: 'list-123' }) // missing asin
      };

      const result = await itemsHandler.add(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(400);
      expect(body.message).toContain('Missing required parameters');
      expect(amazonApi.getProductByAsin).not.toHaveBeenCalled();
    });

    it('should return 422 Unprocessable Entity when the ASIN does not exist on Amazon', async () => {
      const mockEvent = {
        body: JSON.stringify({ listId: 'list-123', asin: 'INVALIDASIN' })
      };

      amazonApi.getProductByAsin.mockRejectedValue(new Error('Product not found'));

      const result = await itemsHandler.add(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(422);
      expect(body.message).toBe('Product not found');
    });
  });

  describe('reserve() - Handler Execution', () => {
    it('should return 200 OK when an item is successfully reserved', async () => {
      const mockEvent = { body: JSON.stringify({ listId: 'list-123', itemId: 'B00X4WHP5E', claimedBy: 'user-789' }) };
      dbService.getGiftListById.mockResolvedValue({ list_id: 'list-123', items: [{ item_id: 'B00X4WHP5E', name: 'Kindle', price: 100 }] });
      dbService.reserveItem.mockResolvedValue({ success: true });

      const result = await itemsHandler.reserve(mockEvent);
      expect(result.statusCode).toBe(200);
    });

    it('should return 409 Conflict when a race condition occurs', async () => {
      const mockEvent = {
        body: JSON.stringify({
          listId: 'list-123',
          itemId: 'B00X4WHP5E',
          claimedBy: 'user-789'
        })
      };

      dbService.getGiftListById.mockResolvedValue({ list_id: 'list-123', items: [{ item_id: 'B00X4WHP5E', name: 'Kindle', price: 100 }] });
      dbService.reserveItem.mockRejectedValue(new Error('Concurrency Conflict: This item was just reserved by someone else.'));

      const result = await itemsHandler.reserve(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(409);
      expect(body.message).toContain('Concurrency Conflict');
    });
  });

  describe('delete() - Handler Execution', () => {
    it('should return 200 OK when an item is successfully pruned from the registry array', async () => {
      const mockEvent = {
        pathParameters: { listId: 'list-123', itemId: 'item-456' }
      };

      dbService.removeItemFromList.mockResolvedValue({ items: [] });

      const result = await itemsHandler.delete(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.message).toContain('successfully pruned');
      expect(body.remainingItemsCount).toBe(0);
      expect(dbService.removeItemFromList).toHaveBeenCalledWith('list-123', 'item-456');
    });

    it('should return 404 Not Found if the item or registry does not exist in the collection', async () => {
      const mockEvent = {
        pathParameters: { listId: 'list-123', itemId: 'invalid-item' }
      };

      dbService.removeItemFromList.mockRejectedValue(new Error('Item not found in list'));

      const result = await itemsHandler.delete(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(404);
      expect(body.message).toBe('Item not found in list');
    });

    it('should return 409 Conflict if trying to delete an item that was already purchased', async () => {
      const mockEvent = {
        pathParameters: { listId: 'list-123', itemId: 'bought-item' }
      };

      dbService.removeItemFromList.mockRejectedValue(new Error('Cannot delete an item that has already been purchased.'));

      const result = await itemsHandler.delete(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(409);
      expect(body.message).toContain('already been purchased');
    });
  });

});
