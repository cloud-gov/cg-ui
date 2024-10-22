/*
Test:
When Alert shows on the page,
SR reads the message.
*/

'use client';

import { Alert } from '@/components/uswds/Alert';
import { useState } from 'react';

export default function AlertPage() {
  const [alertShown, setAlertShown] = useState(false);

  return (
    <>
      <button onClick={() => setAlertShown(true)}>show alert</button>
      <button onClick={() => setAlertShown(false)}>hide alert</button>
      {alertShown && <Alert type="error">this is an alert!</Alert>}
    </>
  );
}
