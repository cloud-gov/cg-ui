import { isLoggedIn } from '@/api/cf/token';
import { LoginButton } from '@/components/auth/LoginButton';
import { LogoutButton } from '@/components/auth/LogoutButton';

export async function Auth() {
  if (await isLoggedIn()) {
    return <LogoutButton />;
  } else {
    return <LoginButton />;
  }
}
