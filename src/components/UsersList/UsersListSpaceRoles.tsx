'use client';

import Link from 'next/link';
import { SpacesBySpaceId, SpaceRoles } from '@/controllers/controller-types';

const displaySize = 4;

export function numberExtra(size: number): number {
  return size - displaySize;
}

export function UsersListSpaceRoles({
  roles,
  spaces,
  orgGuid,
  userGuid,
}: {
  roles: SpaceRoles;
  spaces: SpacesBySpaceId;
  orgGuid: string;
  userGuid: string;
}) {
  const userLink = `/orgs/${orgGuid}/users/${userGuid}`;
  const rolesCount = Object.keys(roles).length;
  const spacesCount = Object.keys(spaces).length;

  if (rolesCount <= 0) {
    return (
      <>
        None yet —{' '}
        <Link href={userLink} className="usa-button--unstyled text-bold">
          edit permissions
        </Link>
      </>
    );
  }
  return (
    <Link href={userLink} className="usa-button--unstyled">
      {`${rolesCount} of ${spacesCount} space${spacesCount != 1 ? 's' : ''}`}
    </Link>
  );
}
