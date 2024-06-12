'use client';

import React from 'react';
import Link from 'next/link';
import { formatOrgRoleName } from '@/helpers/text';
import { RolesByUserRole } from '@/controllers/controller-types';
import { RoleType } from '@/api/cf/cloudfoundry-types';

function OrgRoleName({ children }: { children: React.ReactNode }) {
  return <div className="padding-top-1 text-capitalize">{children}</div>;
}

function RoleNamesList({ orgRoles }: { orgRoles: Array<RolesByUserRole> }) {
  if (
    orgRoles.length === 1 &&
    orgRoles[0].role === ('organization_user' as RoleType)
  ) {
    return (
      <OrgRoleName>
        <p className="margin-0 text-italic">No additional roles</p>
      </OrgRoleName>
    );
  }
  var managerRole;
  if (
    (managerRole = orgRoles.find(
      (role) => role.role === 'organization_manager'
    ))
  ) {
    return <OrgRoleName>{formatOrgRoleName(managerRole.role)}</OrgRoleName>;
  }
  return orgRoles.map((role, i) => {
    if (role.role !== ('organization_user' as RoleType)) {
      return (
        <OrgRoleName key={`UsersListOrgRoles-roles-${i}`}>
          {formatOrgRoleName(role.role)}
        </OrgRoleName>
      );
    }
  });
}

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
            aria-label="Edit organization roles for this user"
          >
            Edit
          </Link>
        </span>
      </div>
      <RoleNamesList orgRoles={orgRoles} />
    </div>
  );
}
