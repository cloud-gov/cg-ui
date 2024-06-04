'use client';

import { useState } from 'react';
import { GridList } from '@/components/GridList/GridList';
import { UsersListItem } from '@/components/UsersList/UsersListItem';

export function UsersList() {
  // We're not using setUsers now,
  // but will once we hook up real data.
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState([
    {
      username: 'anna.herman@cloud.gov',
      orgRoles: [{ name: 'billing manager' }, { name: 'org auditor' }],
      spaceRoles: [
        { spaceName: 'a-space-name', roleName: 'dev' },
        { spaceName: 'b-space-name', roleName: 'manager' },
        { spaceName: 'dev', roleName: 'dev' },
        { spaceName: 'e-space-name', roleName: 'dev' },
        { spaceName: 'extra', roleName: 'auditor' },
      ],
      lastLogin: '2024-05-29T13:27:12+0000',
    },
    {
      username: 'eleni.chappen@example.gov',
      orgRoles: [{ name: 'billing manager' }, { name: 'org auditor' }],
      spaceRoles: [
        { spaceName: 'a-space-name', roleName: 'dev' },
        { spaceName: 'b-space-name', roleName: 'manager' },
        { spaceName: 'dev', roleName: 'dev' },
        { spaceName: 'e-space-name', roleName: 'dev' },
        { spaceName: 'extra', roleName: 'auditor' },
      ],
      lastLogin: '2020-05-29T13:27:12+0000',
    },
    {
      username: 'eleni.chappen+NoLogin@example.gov',
      orgRoles: [{ name: 'billing manager' }, { name: 'org auditor' }],
      spaceRoles: [
        { spaceName: 'a-space-name', roleName: 'dev' },
        { spaceName: 'b-space-name', roleName: 'manager' },
        { spaceName: 'dev', roleName: 'dev' },
        { spaceName: 'e-space-name', roleName: 'dev' },
        { spaceName: 'extra', roleName: 'auditor' },
      ],
      lastLogin: null,
    },
  ]);

  return (
    <GridList>
      {users.map((user, i) => (
        <UsersListItem key={`UsersListItem-${i}`} user={user} />
      ))}
    </GridList>
  );
}
