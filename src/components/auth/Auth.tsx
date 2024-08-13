import { cookies } from 'next/headers';
import { LoginButton } from '@/components/auth/LoginButton';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function Auth() {
  const cookieStore = cookies();
  const authSession = cookieStore.get('authsession');

  if (authSession) {
    return <LogoutButton />;
  } else {
    return <LoginButton />;
  }
}
