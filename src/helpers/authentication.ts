import { randomString } from '@/helpers/crypto';

export const loginPathBase = '/login?state=';

export const logInPathAsync = async () => {
  // this needs to be an asyc function for server-side redirects to make this a string
  const s = await randomString();
  return loginPathBase + s;
};
