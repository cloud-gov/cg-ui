export const expirationWindowDays = 90;

export function addDays(date: Date, days: number): Date {
  return new Date(date.setDate(date.getDate() + days));
}

export function isDateExpired(
  timestamp: number,
  daysToExpiry: number = expirationWindowDays
): boolean {
  const timestampDate = new Date(timestamp);
  const expirationDate = addDays(timestampDate, daysToExpiry);
  const nowDate = new Date();
  if (nowDate > expirationDate) return true;
  return false;
}

export function daysToExpiration(
  timestamp: number,
  daysToExpiry: number = expirationWindowDays
): number {
  const timestampDate = new Date(timestamp);
  const futureDate = timestampDate.setDate(
    timestampDate.getDate() + daysToExpiry
  ); // returns a time
  const now = new Date();
  return Math.round((futureDate - now.getTime()) / 1000 / 60 / 60 / 24);
}

export function formatDate(timestamp: number | string | null): string {
  if (!timestamp) return '';

  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// taken from https://stackoverflow.com/a/60180035
export function randomDate(from: Date, to: Date) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}
