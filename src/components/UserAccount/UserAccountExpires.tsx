import Link from 'next/link';

export function UserAccountExpires({
  daysToExpiration,
  hrefInvite = process.env.NEXT_PUBLIC_USER_INVITE_URL || '/',
}: {
  daysToExpiration: number | null;
  hrefInvite?: string;
}) {
  if (daysToExpiration === null) {
    return <>Not available</>;
  }
  if (daysToExpiration > 0) {
    return (
      <>
        {daysToExpiration} day{daysToExpiration != 1 && 's'}
      </>
    );
  }
  if (daysToExpiration <= 0) {
    return (
      <>
        Expired —{' '}
        <Link href={hrefInvite} className="usa-button--unstyled text-bold">
          resend invite
        </Link>
      </>
    );
  }
}
