'use server';

import crypto from 'crypto';

export const randomString = (): string => {
  return crypto.randomBytes(8).toString('hex');
};
