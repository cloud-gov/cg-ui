'use client';

import { UsersTable } from '../../../components/prototypes/UsersTable';
import { UsersTableRow } from '../../../components/prototypes/UsersTableRow';

export default function ManageUsersPage() {
  const users = [
    {
      email: 'leonard.cat2reallylongname@gsa.gov',
      spaces: [
        { spaceName: 'a-space-name', roleName: 'Manager' },
        { spaceName: 'another-space-name', roleName: 'User' },
        { spaceName: 'another-space-name', roleName: 'User' },
        { spaceName: 'another-space-name', roleName: 'User' },
        { spaceName: 'another-space-name', roleName: 'User' },
        { spaceName: 'another-space-name', roleName: 'User' },
        { spaceName: 'another-space-name', roleName: 'User' },
        { spaceName: 'another-space-name', roleName: 'User' },
        { spaceName: 'another-space-name', roleName: 'User' },
        { spaceName: 'another-space-name', roleName: 'User' },
      ],
    },
    {
      email: 'leonard.cat@gsa.gov',
      spaces: [
        { spaceName: 'a-space-name', roleName: 'Manager' },
        { spaceName: 'another-space-name', roleName: 'User' },
      ],
    },
  ];

  return (
    <>
      <div className="grid-container">
        <h1> Org Users </h1>
        <UsersTable>
          {users.map((user, i) => (
            <UsersTableRow user={user} key={i} />
          ))}
        </UsersTable>
      </div>
    </>
  );
}
