'use client';

import React from 'react';
import Link from 'next/link';
import { RolesByUserRole } from '@/controllers/controller-types';

export function UsersListOrgRoles({
  orgRoles,
  orgGuid,
  userGuid,
}: {
  orgRoles: Array<RolesByUserRole>;
  orgGuid: string;
  userGuid: string;
}) {
  if (orgRoles.length <= 0) {
    return (
      <>
        None yet —{' '}
        <Link
          href={`/orgs/${orgGuid}/users/${userGuid}/org-roles`}
          className="usa-button--unstyled text-bold"
        >
          edit roles
        </Link>
      </>
    );
  }
  return (
    <Link
      href={`/orgs/${orgGuid}/users/${userGuid}/org-roles`}
      className="usa-button--unstyled"
    >
      {`${orgRoles.length} role${orgRoles.length != 1 ? 's' : ''}`}
    </Link>
  );
}
