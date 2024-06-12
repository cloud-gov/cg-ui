'use client';

import { isDateExpired, daysToExpiration } from '@/helpers/dates';

export function formatDate(timestamp: number | null): string {
  if (!timestamp) return '';

  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timestamp: number | null): string {
  if (!timestamp) return '';

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
  timestamp: number | null;
}) {
  const isExpired: boolean = timestamp
    ? isDateExpired(timestamp, expirationWindowDays)
    : false;
  const expiresInDays: number = timestamp
    ? daysToExpiration(timestamp, expirationWindowDays)
    : 0;
  const showTimestamp: boolean = !!timestamp && !isExpired;
  return (
    <div className="text-right text-base" aria-label="last login time">
      <div>
        {!timestamp && 'Never logged in'}
        {timestamp && isExpired && 'Login expired'}
        {showTimestamp && formatTime(timestamp)}
      </div>
      <div aria-label="last login date">
        {(!timestamp || (timestamp && isExpired)) && (
          <button className="usa-button usa-button--unstyled">
            Resend invite
          </button>
        )}
        {showTimestamp && formatDate(timestamp)}
      </div>
      {showTimestamp && (
        <div className="padding-top-1 text-italic">
          Login expires in {expiresInDays} day{expiresInDays > 1 && 's'}
        </div>
      )}
    </div>
  );
}
