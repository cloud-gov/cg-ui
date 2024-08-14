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
import { UserLogonResponse } from './s3-types';

if (process.env.VCAP_SERVICES) {
  // VCAP_SERVICES are only available if the application is deployed to CF,
  // in which case it should use the variables provided by the bound service
  const vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  const s3creds = vcapServices['s3'][0]['credentials'];
  process.env['AWS_ACCESS_KEY_ID'] = s3creds.access_key_id;
  process.env['AWS_SECRET_ACCESS_KEY'] = s3creds.secret_access_key;
  process.env['BUCKET'] = s3creds.bucket;
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

export async function getUserLogonInfo(): Promise<
  UserLogonResponse | undefined
> {
  if (process.env.AWS_ACCESS_KEY_ID === undefined) {
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
      const json = JSON.parse(bodyString);
      if (process.env.NODE_ENV !== 'test') {
        console.log(`user logon info last updated ${json.timestamp}`);
      }
      return json;
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error reading login info: ${error.message}`);
    }
  }
}
