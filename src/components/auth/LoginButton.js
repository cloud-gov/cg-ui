import { logInPath } from '@/helpers/authentication';

export function LoginButton() {
  return (
    <>
      <a href={logInPath()} className="text-white hover:text-no-underline">
        Log in
      </a>
    </>
  );
}
