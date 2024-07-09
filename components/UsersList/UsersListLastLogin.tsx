'use client';

import { UserLogonInfoDisplay } from '@/controllers/controller-types';
import { isDateExpired, daysToExpiration, formatDate } from '@/helpers/dates';

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
  userLogonInfo,
}: {
  userLogonInfo: UserLogonInfoDisplay;
}) {
  const timestamp = userLogonInfo.lastLogonTime;
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
