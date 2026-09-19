const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

// Initialize AWS Clients using standard environment regions
const region = process.env.AWS_REGION || "us-east-1";
const snsClient = new SNSClient({ region });
const sqsClient = new SQSClient({ region });

const ITEM_CLAIMED_SNS_TOPIC = process.env.ITEM_CLAIMED_SNS_TOPIC_ARN;
const ORDER_PROCESSING_SQS_URL = process.env.ORDER_PROCESSING_SQS_QUEUE_URL;

/**
 * Triggers an immediate multi-channel alert via AWS SNS when an item is claimed.
 * Useful for alerting the registry owner or sending immediate push notifications.
 *
 * @param {Object} params
 * @param {string} params.listId - The unique identifier of the gift list
 * @param {string} params.itemName - The name of the product that was claimed
 * @param {string} params.listOwnerEmail - The target email address of the registry creator
 */
async function sendClaimedAlertNotification({ listId, itemName, listOwnerEmail }) {
    if (!ITEM_CLAIMED_SNS_TOPIC) {
        console.warn("SNS Topic ARN is missing. Skipping real-time notification push.");
        return;
    }

    // Fixed: Added backticks around template literals for proper variable interpolation
    const messagePayload = {
        default: `Great news! An item ("${itemName}") from your gift registry has been claimed!`,
        email: `Hello,\n\nSomeone just reserved "${itemName}" from your gift registry (List ID: ${listId}).\n\nCheck your active gift portal for details!`,
    };

    const command = new PublishCommand({
        TopicArn: ITEM_CLAIMED_SNS_TOPIC,
        Message: JSON.stringify(messagePayload),
        MessageStructure: "json",
        MessageAttributes: {
            "OwnerEmail": {
                DataType: "String",
                StringValue: listOwnerEmail
            },
            "EventType": {
                DataType: "String",
                StringValue: "ItemClaimed"
            }
        }
    });

    try {
        const response = await snsClient.send(command);
        // Fixed: Added backticks for console logging template string
        console.log(`Successfully dispatched SNS alert. Message ID: ${response.MessageId}`);
        return response;
    } catch (error) {
        console.error("Failed to execute AWS SNS publish event:", error);
        // Do not throw to prevent crashing the critical path user execution thread if notification infrastructure fails
        return null;
    }
}

/**
 * Pushes a payload directly onto an AWS SQS queue for asynchronous batch processing.
 * Useful for high-volume decoupled execution workloads like fulfillment processing or internal ledgers.
 *
 * @param {Object} messageBody - The structured transaction data to be pushed into the worker queue
 */
async function queueTransactionForProcessing(messageBody) {
    if (!ORDER_PROCESSING_SQS_URL) {
        console.warn("SQS Queue URL is missing. Skipping queue operations.");
        return;
    }

    const command = new SendMessageCommand({
        QueueUrl: ORDER_PROCESSING_SQS_URL,
        MessageBody: JSON.stringify({
            ...messageBody,
            timestamp: new Date().toISOString()
        }),
        // Delays message execution for 5 seconds to ensure eventual DynamoDB replication catches up
        DelaySeconds: 5
    });

    try {
        const response = await sqsClient.send(command);
        // Fixed: Added backticks for console logging template string
        console.log(`Successfully queued execution payload to SQS. Message ID: ${response.MessageId}`);
        return response;
    } catch (error) {
        console.error("Failed to execute AWS SQS message insertion:", error);
        throw new Error("Downstream execution system queue failure.");
    }
}

module.exports = {
    sendClaimedAlertNotification,
    queueTransactionForProcessing
};
