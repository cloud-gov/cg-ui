'use client';

import { getData } from '../../api/api';
import { SessionForm } from './form';
import { SessionList } from './list';
import { useEffect, useState } from 'react';

export default function Page() {
  const [sessions, setSessionData] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getData('/api/session');
        setSessionData(res['rows']);
      } catch (error) {
        // placeholder so the page still displays until we
        // implement better error handling logic
        setSessionData([]);
      }
    };
    fetchSessions();
  }, []);

  return (
    <main>
      <h1>Sessions</h1>
      <SessionForm sessions={sessions} setSessionData={setSessionData} />
      <SessionList sessions={sessions} />
    </main>
  );
}
