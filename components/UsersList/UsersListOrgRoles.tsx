'use client';

import Link from 'next/link';

export interface UserOrgRole {
  name: string;
}

export function UsersListOrgRoles({ roles }: { roles: Array<UserOrgRole> }) {
  return (
    <div>
      <div className="display-flex flex-align-center padding-bottom-1">
        <h4 className="font-heading-2xs margin-0 padding-right-1">Org roles</h4>
        <span>
          <Link href="/todo" className="font-body-2xs">
            Edit
          </Link>
        </span>
      </div>
      {roles.map((role, i) => (
        <div
          key={`UsersListOrgRoles-roles-${i}`}
          className="padding-top-1 text-capitalize"
        >
          {role.name}
        </div>
      ))}
    </div>
  );
}
