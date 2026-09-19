const authHandler = require('../../src/handlers/auth');
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Completely mock out the AWS SDK DynamoDB Document Client send loop
jest.mock('@aws-sdk/lib-dynamodb', () => {
  const originalModule = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...originalModule,
    DynamoDBDocumentClient: {
      from: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    },
    PutCommand: jest.fn()
  };
});

describe('src/handlers/auth.js - Cognito Post-Confirmation Trigger Unit Tests', () => {
  let mockDocClientInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Re-resolve our mocked instance mapping to assign behavior dynamically
    const { DynamoDBDocumentClient: mockedClient } = require('@aws-sdk/lib-dynamodb');
    mockDocClientInstance = mockedClient.from();
  });

  it('should successfully sync a user profile document into DynamoDB when trigger condition is met', async () => {
    const mockEvent = {
      triggerSource: 'PostConfirmation_ConfirmSignUp',
      userName: 'user-uuid-1111',
      request: {
        userAttributes: {
          sub: 'user-uuid-1111',
          email: 'Alex.Jordan@Example.com',
          name: 'Alex Jordan'
        }
      }
    };

    mockDocClientInstance.send.mockResolvedValue({});

    const result = await authHandler.postConfirmation(mockEvent);

    // Assert that the original event passes back to Cognito to prevent auth freezes
    expect(result).toEqual(mockEvent);
    expect(mockDocClientInstance.send).toHaveBeenCalledTimes(1);
    expect(PutCommand).toHaveBeenCalledWith(expect.objectContaining({
      Item: expect.objectContaining({
        user_id: 'user-uuid-1111',
        email: 'alex.jordan@example.com', // Confirms lowercase transformation rule
        name: 'Alex Jordan',
        status: 'active'
      })
    }));
  });

  it('should gracefully skip synchronization and return the event if the trigger source is invalid', async () => {
    const mockEvent = {
      triggerSource: 'CustomMessage_SignUp', // Invalid trigger origin
      userName: 'user-uuid-1111',
      request: { userAttributes: {} }
    };

    const result = await authHandler.postConfirmation(mockEvent);

    expect(result).toEqual(mockEvent);
    expect(mockDocClientInstance.send).not.toHaveBeenCalled();
  });

  it('should explicitly throw a synchronization error if database storage encounters a failure', async () => {
    const mockEvent = {
      triggerSource: 'PostConfirmation_ConfirmSignUp',
      userName: 'user-uuid-1111',
      request: {
        userAttributes: {
          sub: 'user-uuid-1111',
          email: 'alex.jordan@example.com'
        }
      }
    };

    mockDocClientInstance.send.mockRejectedValue(new Error('DynamoDB Write Capacity Exceeded'));

    await expect(authHandler.postConfirmation(mockEvent))
      .rejects
      .toThrow('Application user database synchronization failed.');
  });
});
