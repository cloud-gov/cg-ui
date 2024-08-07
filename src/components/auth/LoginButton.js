import crypto from 'crypto';

export function LoginButton() {
  const randomString = crypto.randomBytes(8).toString('hex');

  return (
    <>
      <a href={'/login?state=' + randomString}>Log In</a>
    </>
  );
}
