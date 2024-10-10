export function Timestamp({ timestamp }: { timestamp: number }) {
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };
  return (
    <div className="margin-bottom-4">Last updated: {formatTime(timestamp)}</div>
  );
}
