const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb"); 

// Initialize standard client and wrap with DocumentClient for native JS types
const region = process.env.AWS_REGION || "us-east-1";
const client = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(client); 

const USERS_TABLE = process.env.USERS_TABLE || "Users"; 

/** 

* AWS Lambda Trigger: Cognito Post-Confirmation
* Automatically fires after a user successfully validates their registration credentials.
* Syncs the Cognito user identity profile directly into our DynamoDB application database layer.
*/
module.exports.postConfirmation = async (event, context) => {
console.log("Received Cognito Post-Confirmation Event:", JSON.stringify(event)); 

// Confirm that the required trigger source is valid
if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
console.log(Trigger source is "${event.triggerSource}". Skipping synchronization.);
return event; // Always return the original event object back to Cognito to prevent authentication stalls
} 

const { userAttributes, userName } = event.request; 

// Extract properties passed out of Cognito user attributes pool
const userId = userName; // Cognito Sub ID or Username
const email = userAttributes.email;
const name = userAttributes.name || userAttributes.given_name || "New User"; 

if (!userId || !email) {
console.error("Critical failure: Cognito event metadata is missing essential parameters (userName or email).");
return event;
} 

const newUserProfile = {
user_id: userId,
email: email.toLowerCase(),
name: name,
created_at: new Date().toISOString(),
status: "active"
}; 

const command = new PutCommand({
TableName: USERS_TABLE,
Item: newUserProfile
}); 

try {
console.log(Persisting new authenticated user identity profiles into DynamoDB table: ${USERS_TABLE});
await docClient.send(command);
console.log(Successfully synced user profile for UserID: ${userId});
} catch (error) {
console.error("Fatal failure updating application user profile registry:", error);
// Throwing an unhandled exception inside a Cognito trigger halts user signup completion.
// Depending on your product requirement, you may want to swallow it or let it fail.
throw new Error("Application user database synchronization failed.");
} 

// Cognito triggers REQUIRE returning the mutated or native event structure back to the execution pool
return event;
};