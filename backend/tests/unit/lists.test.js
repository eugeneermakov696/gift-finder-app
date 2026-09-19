const listsHandler = require('../../src/handlers/lists');
const dbService = require('../../src/services/dbService'); 

// Mock out the database service completely
jest.mock('../../src/services/dbService'); 

describe('src/handlers/lists.js - Unit Tests', () => { 

beforeEach(() => {
jest.clearAllMocks();
});

describe('create() - Registry Provisioning Logic', () => {
it('should successfully instantiate a registry list shell when valid inputs are given', async () => {
const mockEvent = {
body: JSON.stringify({
listId: 'wedding-2026',
creatorId: 'user-uuid-1111',
title: 'Our Wedding Registry'
})
};
    const mockServiceReturn = {
        listId: 'wedding-2026',
        creatorId: 'user-uuid-1111',
        title: 'Our Wedding Registry'
    };

    dbService.createGiftList.mockResolvedValue(mockServiceReturn);

    const result = await listsHandler.create(mockEvent);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(201);
    expect(body.error).toBeUndefined();
    expect(body.registry.listId).toBe('wedding-2026');
    expect(dbService.createGiftList).toHaveBeenCalledWith('wedding-2026', 'user-uuid-1111', 'Our Wedding Registry');
});

it('should return a 400 Bad Request error if the body payload context parameters are empty', async () => {
    const mockEvent = {
        body: null
    };

    const result = await listsHandler.create(mockEvent);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(body.error).toBe(true);
    expect(body.message).toContain('Missing request body');
    expect(dbService.createGiftList).not.toHaveBeenCalled();
});

it('should return a 400 Bad Request error if mandatory parameters are missing inside the payload', async () => {
    const mockEvent = {
        body: JSON.stringify({
            listId: 'wedding-2026'
            // Missing creatorId and title parameters
        })
    };

    const result = await listsHandler.create(mockEvent);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(body.error).toBe(true);
    expect(body.message).toContain('Missing required parameters');
});

it('should return a 500 Internal Server Error response code if the database execution throws a fault', async () => {
    const mockEvent = {
        body: JSON.stringify({
            listId: 'wedding-2026',
            creatorId: 'user-uuid-1111',
            title: 'Our Wedding Registry'
        })
    };

    dbService.createGiftList.mockRejectedValue(new Error('DynamoDB Connection Failure'));

    const result = await listsHandler.create(mockEvent);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(500);
    expect(body.error).toBe(true);
    expect(body.message).toContain('Internal Server Error');
});

});

describe('get() - Registry Database Fetching Logic', () => {
it('should successfully return the matching list tracking object matching a correct path parameter', async () => {
const mockEvent = {
pathParameters: {
listId: 'birthday-2026'
}
};
    const mockResolvedRegistry = {
        list_id: 'birthday-2026',
        creator_id: 'user-uuid-2222',
        title: "Sam's 30th Birthday",
        items: []
    };

    dbService.getGiftListById.mockResolvedValue(mockResolvedRegistry);

    const result = await listsHandler.get(mockEvent);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.registry.list_id).toBe('birthday-2026');
    expect(dbService.getGiftListById).toHaveBeenCalledWith('birthday-2026');
});

it('should return a 400 Bad Request if the listId path argument field is missing', async () => {
    const mockEvent = {
        pathParameters: null
    };

    const result = await listsHandler.get(mockEvent);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(400);
    expect(body.error).toBe(true);
    expect(body.message).toContain('Missing path parameter');
});

it('should return a 404 Not Found error status if the resolved database item is empty', async () => {
    const mockEvent = {
        pathParameters: {
            listId: 'nonexistent-list-id'
        }
    };

    dbService.getGiftListById.mockResolvedValue(null);

    const result = await listsHandler.get(mockEvent);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(404);
    expect(body.error).toBe(true);
    expect(body.message).toContain('was not found');
});

});

});