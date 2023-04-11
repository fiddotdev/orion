import dotenv from 'dotenv';
dotenv.config();

export type EnvConfig = {
  sqsQueueURL: string;
  sqsAPIVersion: string;
  sqsRegion: string;
  hubURL: string;
  hubSecure: boolean;
};

console.log(process.env.HUB_SECURE);
const envConfig: EnvConfig = {
  sqsQueueURL: process.env.SQS_URL ?? '',
  sqsAPIVersion: process.env.SQS_API_VERSION ?? '',
  sqsRegion: process.env.SQS_REGION ?? '',
  hubURL: process.env.HUB_URL ?? '',
  hubSecure: process.env.HUB_SECURE === 'true',
};

function validateConfig(config: EnvConfig) {
  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'undefined' || value === '') {
      missingVars.push(key);
    }
  }

  if (missingVars.length) {
    throw new Error(
      `The following environment variables are not set: ${missingVars.join(
        ', ',
      )}`,
    );
  }
}

validateConfig(envConfig);

export default envConfig;
