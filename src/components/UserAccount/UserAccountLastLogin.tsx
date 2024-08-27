'use client';

import Link from 'next/link';
import { UserLogonInfoDisplay } from '@/controllers/controller-types';
import { formatDate } from '@/helpers/dates';

export function formatTime(timestamp: number | null): string {
  if (!timestamp) return '';

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(timestamp).toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function UserAccountLastLogin({
  userLogonInfo,
}: {
  userLogonInfo?: UserLogonInfoDisplay | undefined;
}) {
  if (!userLogonInfo) {
    return <>Not available</>;
  }

  const timestamp = userLogonInfo.lastLogonTime;
  if (!timestamp) {
    return (
      <>
        None —{' '}
        <Link href="/" className="usa-button--unstyled text-bold">
          resend invite
        </Link>
      </>
    );
  }

  return <>{formatDate(timestamp)}</>;
}
