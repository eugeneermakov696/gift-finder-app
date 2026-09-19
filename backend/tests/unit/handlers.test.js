const itemsHandler = require('../../src/handlers/items');
const amazonApi = require('../../src/services/amazonApi');
const dbService = require('../../src/services/dbService');

// Mock out downstream dependencies completely
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
        imageUrl: 'https://amazon.com/image.jpg',
        itemUrl: 'https://amazon.com/dp/B00X4WHP5E'
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
    let mockList;

    beforeEach(() => {
      // Base mock structure required to pass initial validation filters in the handler
      mockList = {
        list_id: 'list-123',
        items: [
          {
            item_id: 'B00X4WHP5E',
            name: 'Kindle Paperwhite',
            price: 139.99,
            currency: 'USD'
          }
        ]
      };
    });

    it('should return 200 OK when an item is successfully reserved', async () => {
      const mockEvent = {
        body: JSON.stringify({
          listId: 'list-123',
          itemId: 'B00X4WHP5E',
          claimedBy: 'user-789'
        })
      };

      // Mock both initial list resolution and execution steps
      dbService.getGiftListById.mockResolvedValue(mockList);
      dbService.reserveItem.mockResolvedValue({ success: true, message: 'Item successfully reserved' });

      const result = await itemsHandler.reserve(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(200);
      expect(body.success).toBe(true);
      expect(dbService.getGiftListById).toHaveBeenCalledWith('list-123');
      expect(dbService.reserveItem).toHaveBeenCalledWith('list-123', 'B00X4WHP5E', 'user-789');
    });

    it('should return 409 Conflict when a race condition occurs', async () => {
      const mockEvent = {
        body: JSON.stringify({
          listId: 'list-123',
          itemId: 'B00X4WHP5E',
          claimedBy: 'user-789'
        })
      };

      dbService.getGiftListById.mockResolvedValue(mockList);
      dbService.reserveItem.mockRejectedValue(new Error('Concurrency Conflict: This item was just reserved by someone else.'));

      const result = await itemsHandler.reserve(mockEvent);
      const body = JSON.parse(result.body);

      expect(result.statusCode).toBe(409);
      expect(body.message).toContain('Concurrency Conflict');
    });
  });
});
