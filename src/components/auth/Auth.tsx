import { isLoggedIn } from '@/api/cf/token';
import { LoginButton } from '@/components/auth/LoginButton';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function Auth() {
  if (isLoggedIn()) {
    return <LogoutButton />;
  } else {
    return <LoginButton />;
  }
}
