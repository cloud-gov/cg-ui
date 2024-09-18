import crypto from 'crypto';
import { loginPathBase } from '@/helpers/authentication';

export function LoginButton() {
  const randomString = crypto.randomBytes(8).toString('hex');

  return (
    <>
      <a href={loginPathBase + randomString} className="text-white hover:text-no-underline">
        Log in
      </a>
    </>
  );
}
