'use client';

import React from 'react';
import Link from 'next/link';

export function UsersListOrgRoles({
  orgRolesCount,
  href,
}: {
  orgRolesCount: number;
  href: string;
}) {
  if (orgRolesCount <= 0) {
    return (
      <>
        None yet —{' '}
        <Link href={href} className="usa-button--unstyled text-bold">
          edit roles
        </Link>
      </>
    );
  }
  return (
    <Link href={href} className="usa-button--unstyled">
      {`${orgRolesCount} role${orgRolesCount != 1 ? 's' : ''}`}
    </Link>
  );
}
