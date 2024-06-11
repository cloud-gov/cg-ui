import React from 'react';
import { cookies } from 'next/headers';
import { LoginButton } from './auth/LoginButton';
import { LogoutButton } from './auth/LogoutButton';

export function LayoutHeader({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const authSession = cookieStore.get('authsession');

  return (
    <div className="desktop:display-flex flex-align-center flex-justify border-bottom border-accent-warm-light">
      <div className="padding-x-4 padding-y-2 desktop:order-last display-flex flex-justify-end border-bottom border-accent-warm-light desktop:border-0 font-ui-xs">
        {authSession ? <LogoutButton /> : <LoginButton />}
      </div>
      <div className="padding-x-4 font-ui-lg padding-y-2 text-semibold">
        {children}
      </div>
    </div>
  );
}
