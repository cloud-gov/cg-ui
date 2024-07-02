'use server';
/***/
// API library for AWS s3 access
/***/

import { fromEnv } from '@aws-sdk/credential-providers';
import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

const vcapServices = process.env.VCAP_SERVICES || (null as any);

if (vcapServices) {
  // VCAP_SERVICES are only available if the application is deployed to CF,
  // in which case it should use the variables provided by the bound service
  const s3creds = vcapServices['s3'][0]['credentials'];
  process.env['AWS_ACCESS_KEY_ID'] = s3creds.access_key_id;
  process.env['AWS_SECRET_ACCESS_KEY'] = s3creds.secret_access_key;
  process.env['S3_BUCKET'] = s3creds.bucket;
  process.env['AWS_DEFAULT_REGION'] = s3creds.region;
} else {
  // if this application is not deployed, check to see if local access is set up
  process.env['AWS_ACCESS_KEY_ID'] = process.env.S3_ACCESS_KEY_ID;
  process.env['AWS_SECRET_ACCESS_KEY'] = process.env.S3_ACCESS_KEY_SECRET;
  process.env['BUCKET'] = process.env.S3_BUCKET;
  process.env['AWS_DEFAULT_REGION'] = process.env.S3_REGION;
}

const s3 = new S3Client({
  credentials: fromEnv(),
  region: process.env['AWS_DEFAULT_REGION'],
});

// prints out the files in your requested bucket, can be used to test access
export async function listBucketFiles() {
  const command = new ListObjectsCommand({ Bucket: process.env.BUCKET });
  try {
    const { Contents } = await s3.send(command);
    if (Contents) {
      const contentsList = Contents.map((c) => c.Key).join('\n');
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `The contents of the s3 bucket ${process.env.BUCKET} are: ${contentsList}`
        );
      }
    }
  } catch (error: any) {
    console.error(
      `Error reading s3 bucket ${process.env.BUCKET}: ${error.message}`
    );
  }
}

export async function getUserLogonInfo() {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.log('application is not configured to connect to s3 storage');
    }
    return undefined;
  }
  // TODO for now this object name is not anticipated to change, but we will
  // need to adjust or configure it if the app is deployed to other environments
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: 'development-list-lastlogon-summary.json',
  });
  try {
    const res = await s3.send(command);
    const bodyString = await res.Body?.transformToString();
    if (bodyString) {
      return JSON.parse(bodyString);
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error reading login info: ${error.message}`);
    }
    return undefined;
  }
}
