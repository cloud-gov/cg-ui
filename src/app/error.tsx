'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Alert } from '@/components/uswds/Alert';

export default function Error({
  error,
  // reset, // reset is for retrying actions, see https://nextjs.org/docs/app/building-your-application/routing/error-handling
}: {
  error: Error & { digest?: string };
  // reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="padding-top-4">
      <Alert type="error" isVisible={true}>
        Error: {error.message}
      </Alert>
    </div>
  );
}
