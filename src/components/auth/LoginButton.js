import crypto from 'crypto';

export function LoginButton() {
  const randomString = crypto.randomBytes(8).toString('hex');

  return (
    <>
      <a
        href={'/login?state=' + randomString}
        className="text-white hover:text-no-underline"
      >
        Log in
      </a>
    </>
  );
}
