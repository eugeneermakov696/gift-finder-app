const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand
} = require("@aws-sdk/lib-dynamodb");

// 1. Local Environment Configuration Routing Engine
const isOffline = process.env.IS_OFFLINE === "true" || process.env.AWS_SAM_LOCAL === "true";

const clientOptions = {
    region: process.env.AWS_REGION || "us-east-1"
};

if (isOffline) {
    console.log("🛠️ App running in local offline mode. Re-routing DynamoDB to http://localhost:8000");
    clientOptions.endpoint = "http://localhost:8000";
    clientOptions.credentials = {
        accessKeyId: "MockAccessKeyId",
        secretAccessKey: "MockSecretAccessKey"
    };
}

// 2. Client Initialization
const client = new DynamoDBClient(clientOptions);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.GIFT_LISTS_TABLE;

/**
 * Creates a brand new empty gift list for a user
 * @param {string} listId - Unique identifier for the list
 * @param {string} creatorId - Cognito user ID of the owner
 * @param {string} title - Event title (e.g., "Wedding Registry")
 */
async function createGiftList(listId, creatorId, title) {
    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            list_id: listId,
            creator_id: creatorId,
            title: title,
            items: [],
            created_at: new Date().toISOString()
        }
    });

    try {
        await docClient.send(command);
        return { listId, creatorId, title };
    } catch (error) {
        console.error("DynamoDB createGiftList error:", error);
        throw new Error("Could not create gift list.");
    }
}

/**
 * Retrieves a gift list by its ID
 * @param {string} listId
 */
async function getGiftListById(listId) {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { list_id: listId }
    });

    try {
        const response = await docClient.send(command);
        return response.Item || null;
    } catch (error) {
        console.error("DynamoDB getGiftListById error:", error);
        throw new Error("Could not retrieve gift list.");
    }
}

/**
 * Appends a product item (fetched from Amazon API) into the list's items array
 * @param {string} listId
 * @param {Object} productDetails - Structured product object from amazonApi.js
 */
async function addItemToList(listId, productDetails) {
    const newItem = {
        item_id: productDetails.itemId,
        name: productDetails.itemName,
        price: productDetails.price,
        currency: productDetails.currency,
        image_url: productDetails.imageUrl,
        url: productDetails.itemUrl,
        status: "available", // available | reserved | purchased
        claimed_by: null
    };

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { list_id: listId },
        // Safely initializes the array if it doesn't exist, then appends the item
        UpdateExpression: "SET #items = list_append(if_not_exists(#items, :empty_list), :new_item)",
        ExpressionAttributeNames: {
            "#items": "items"
        },
        ExpressionAttributeValues: {
            ":new_item": [newItem],
            ":empty_list": []
        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const response = await docClient.send(command);
        return response.Attributes;
    } catch (error) {
        console.error("DynamoDB addItemToList error:", error);
        throw new Error("Could not add item to list.");
    }
}

/**
 * Safely marks a specific gift item as reserved by a friend
 * Uses a conditional expression to prevent reserving an already claimed item
 * @param {string} listId
 * @param {string} itemId
 * @param {string} claimedByUserId - The user reserving the item
 */
async function reserveItem(listId, itemId, claimedByUserId) {
    // 1. Fetch current list to find the element index
    const list = await getGiftListById(listId);
    if (!list) throw new Error("List not found");

    const itemIndex = list.items.findIndex(i => i.item_id === itemId);
    if (itemIndex === -1) throw new Error("Item not found in list");
    if (list.items[itemIndex].status !== "available") throw new Error("Item is already reserved or purchased");

    // 2. Perform conditional atomic update on that exact index path
    // Fixed: Wrapped with backticks to support template string interpolation
    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { list_id: listId },
        UpdateExpression: `SET items[${itemIndex}].#status = :reserved, items[${itemIndex}].claimed_by = :user`,
        ConditionExpression: `items[${itemIndex}].#status = :available`,
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":reserved": "reserved",
            ":available": "available",
            ":user": claimedByUserId
        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        await docClient.send(command);
        return { success: true, message: "Item successfully reserved" };
    } catch (error) {
        if (error.name === "ConditionalCheckFailedException") {
            throw new Error("Concurrency Conflict: This item was just reserved by someone else.");
        }
        console.error("DynamoDB reserveItem error:", error);
        throw error;
    }
}

module.exports = {
    createGiftList,
    getGiftListById,
    addItemToList,
    reserveItem
};
