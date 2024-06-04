'use client';

import Link from 'next/link';

export interface UserOrgRole {
  name: string;
}

export function UsersListOrgRoles({ roles }: { roles: Array<UserOrgRole> }) {
  return (
    <div className="margin-bottom-2 tablet:margin-bottom-0 tablet:margin-right-2 tablet:border-right tablet:border-base-light">
      <div className="display-flex flex-align-center padding-bottom-1">
        <h4 className="margin-0 padding-right-1 font-body-2xs text-semibold text-base">
          Org roles
        </h4>
        <span>
          <Link
            href="/todo"
            className="usa-button usa-button--unstyled font-body-2xs"
          >
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
