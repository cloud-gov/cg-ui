'use client';

import { isDateExpired, daysToExpiration } from '@/helpers/dates';

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timestamp: string): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Date(timestamp).toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  });
}

const expirationWindowDays = 90;

export function UsersListLastLogin({
  timestamp,
}: {
  timestamp: string | null;
}) {
  const isExpired: boolean = timestamp
    ? isDateExpired(timestamp, expirationWindowDays)
    : false;
  const expiresInDays: number = timestamp
    ? daysToExpiration(timestamp, expirationWindowDays)
    : 0;
  return (
    <div className="text-right text-base">
      <div>
        {!timestamp && 'Never logged in'}
        {timestamp && isExpired && 'Login expired'}
        {timestamp && !isExpired && formatTime(timestamp)}
      </div>
      <div>
        {(!timestamp || (timestamp && isExpired)) && (
          <button className="usa-button usa-button--unstyled">
            Resend invite
          </button>
        )}
        {timestamp && !isExpired && formatDate(timestamp)}
      </div>
      {timestamp && !isExpired && (
        <div className="padding-top-1 text-italic">
          Login expires in {expiresInDays} day{expiresInDays > 1 && 's'}
        </div>
      )}
    </div>
  );
}
