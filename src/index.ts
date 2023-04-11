import {
  getInsecureHubRpcClient,
  getSSLHubRpcClient,
  HubEventType,
  HubRpcClient,
} from '@farcaster/hub-nodejs';
import AWS from 'aws-sdk';
import { SendMessageResult } from 'aws-sdk/clients/sqs';
import dotenv from 'dotenv';
import envConfig from './types/config';

dotenv.config();
// Set the AWS region
AWS.config.update({ region: envConfig.sqsRegion });

// Create SQS service object
const sqs = new AWS.SQS({ apiVersion: envConfig.sqsAPIVersion });

// Replace with your queue URL
const queueUrl = envConfig.hubURL;

(async () => {
  // Subscribe to our Farcaster Client
  let client: HubRpcClient;
  if (envConfig.hubSecure) {
    client = getSSLHubRpcClient(envConfig.hubURL);
  } else {
    client = getInsecureHubRpcClient(envConfig.hubURL);
  }

  // Subscribe to all types of messages
  const subscribeResult = await client.subscribe({
    eventTypes: [HubEventType.MERGE_MESSAGE],
  });

  // Make sure we were able to successfully subscribe
  if (subscribeResult.isOk()) {
    // Extract the stream
    const stream = subscribeResult.value;

    // When an event is passed through, we hit this
    for await (const event of stream) {
      // Upload our event to our SQS stream
      // For context: event is an object.
      sendToSQSQueue(event)
        .then(response => {
          console.log(`Message sent to SQS queue: ${response.MessageId}`);
        })
        .catch(error => {
          console.error('Failed to send message to SQS queue:', error);
        });
    }
  }
  client.close();
})();

async function sendToSQSQueue(message: object): Promise<SendMessageResult> {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: queueUrl,
  };

  return sqs.sendMessage(params).promise();
}
