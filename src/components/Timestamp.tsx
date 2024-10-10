export function Timestamp({ timestamp }: { timestamp: number }) {
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };
  return (
    <p className="margin-0 margin-bottom-4 font-sans-2xs">
      Page last updated: {formatTime(timestamp)}
    </p>
  );
}
