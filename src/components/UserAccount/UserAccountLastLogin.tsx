'use client';

import Link from 'next/link';
import { formatDate } from '@/helpers/dates';
import { UserOrgPage } from '@/controllers/controller-types';

export function UserAccountLastLogin({
  hrefInvite = process.env.NEXT_PUBLIC_USER_INVITE_URL || '/',
  lastLogonTime,
}: {
  hrefInvite?: string;
  lastLogonTime: UserOrgPage['lastLogonTime'];
}) {
  if (lastLogonTime === undefined) {
    return <>Not available</>;
  }

  if (lastLogonTime === null) {
    return (
      <>
        None —{' '}
        <Link href={hrefInvite} className="usa-button--unstyled text-bold">
          resend invite
        </Link>
      </>
    );
  }

  return <>{formatDate(lastLogonTime)}</>;
}
