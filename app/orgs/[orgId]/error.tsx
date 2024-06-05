'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Alert } from '@/components/uswds/Alert';

export default function Error({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  // reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <Alert type="error">Error: {error.message}</Alert>
    </div>
  );
}
