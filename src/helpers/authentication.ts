import { randomString } from '@/helpers/text';

export const loginPathBase = '/login?state=';

export const logInPath = () => {
  return loginPathBase + randomString();
};
