export function addDays(date: Date, days: number): Date {
  return new Date(date.setDate(date.getDate() + days));
}

export function isDateExpired(
  timestamp: number,
  daysToExpiry: number
): boolean {
  const timestampDate = new Date(timestamp);
  const expirationDate = addDays(timestampDate, daysToExpiry);
  const nowDate = new Date();
  if (nowDate > expirationDate) return true;
  return false;
}

export function daysToExpiration(
  timestamp: number,
  daysToExpiry: number
): number {
  const timestampDate = new Date(timestamp);
  const futureDate = timestampDate.setDate(
    timestampDate.getDate() + daysToExpiry
  ); // returns a time
  const now = new Date();
  return Math.round((futureDate - now.getTime()) / 1000 / 60 / 60 / 24);
}
