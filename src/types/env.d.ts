declare namespace NodeJS {
  interface ProcessEnv {
    SQS_QUEUE_URL: string;
    SQS_API_VERSION: string;
    SQS_REGION: string;
    HUB_URL: string;
    HUB_SECURE: string; // Using string here as environment variables are always strings
  }
}
