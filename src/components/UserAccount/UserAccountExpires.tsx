import Link from 'next/link';
import { daysToExpiration } from '@/helpers/dates';
import { UserLogonInfoDisplay } from '@/controllers/controller-types';

const expirationWindowDays = 90;

export function UserAccountExpires({
  userLogonInfo,
}: {
  userLogonInfo: UserLogonInfoDisplay | undefined;
}) {
  const timestamp = userLogonInfo?.lastLogonTime;
  const expiresInDays: number = timestamp
    ? daysToExpiration(timestamp, expirationWindowDays)
    : 0;

  if (!userLogonInfo) {
    return <>Not available</>;
  }
  if (expiresInDays > 0) {
    return (
      <>
        {expiresInDays} day{expiresInDays != 1 && 's'}
      </>
    );
  }
  if (expiresInDays <= 0) {
    return (
      <>
        Expired —{' '}
        <Link href="/" className="usa-button--unstyled text-bold">
          resend invite
        </Link>
      </>
    );
  }
}
