'use client';

import Link from 'next/link';
import { underscoreToText } from '@/helpers/text';
import { RolesByUserRole } from '@/controllers/controller-types';

export function UsersListOrgRoles({
  orgRoles,
}: {
  orgRoles: Array<RolesByUserRole>;
}) {
  return (
    <div className="margin-bottom-2 tablet:margin-bottom-0 tablet:margin-right-2 tablet:border-right tablet:border-base-light height-full">
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
      {orgRoles.map((role, i) => (
        <div
          key={`UsersListOrgRoles-roles-${i}`}
          className="padding-top-1 text-capitalize"
        >
          {underscoreToText(role.role)}
        </div>
      ))}
    </div>
  );
}
