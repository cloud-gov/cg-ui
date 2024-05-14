'use client';
import { useEffect, useState } from 'react';
import { getUsers } from '@/api/users';

function Users() {
  const [users, setUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadError, setDataLoadError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedResult = await getUsers();
        if (!dataLoaded) setUsers(fetchedResult);
      } catch (error) {
        setDataLoadError(error.message);
      }
      setDataLoaded(true);
    };
    fetchUsers();
  });

  if (!dataLoaded) {
    return <div role="alert">loading...</div>;
  }

  if (dataLoadError) {
    return <div role="alert">{dataLoadError}</div>;
  }

  return (
    <ul role="list">
      {users.map((user) => (
        <li role="listitem" key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

export default function Clientside() {
  return <Users />;
}
