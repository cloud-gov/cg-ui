'use client';

import { Alert } from '@/components/uswds/Alert';
import { useState } from 'react';

export default function AlertsPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  return (
    <div className="grid-container margin-1 margin-y-4">
      <h2>Success alert</h2>

      <button
        className="usa-button"
        onClick={() => {
          setShowSuccess(!showSuccess);
          setSuccessCount(showSuccess ? successCount + 1 : successCount);
        }}
      >
        show success alert
      </button>

      <div className="margin-top-2">
        <Alert type="success" isVisible={showSuccess}>
          This is success alert number {successCount}
        </Alert>
      </div>

      <h2>Error alert</h2>

      <button
        className="usa-button"
        onClick={() => {
          setShowError(!showError);
          setErrorCount(showError ? errorCount + 1 : errorCount);
        }}
      >
        show error alert
      </button>

      <div className="margin-top-2">
        <Alert type="error" isVisible={showError}>
          This is an error alert number {errorCount}
        </Alert>
      </div>
    </div>
  );
}
