'use client';

import Link from 'next/link';
import { pluralize } from '@/helpers/text';

export function UsersListSpaceRoles({
  spacesCount,
  href,
  spaceRolesCount,
}: {
  href: string;
  spacesCount: number;
  spaceRolesCount: number;
}) {
  if (spaceRolesCount <= 0) {
    return (
      <>
        None yet —{' '}
        <Link href={href} className="usa-button--unstyled text-bold">
          edit permissions
        </Link>
      </>
    );
  }
  return (
    <Link href={href} className="usa-button--unstyled">
      {`${spaceRolesCount} of ${spacesCount} ${pluralize('space', spacesCount)}`}
    </Link>
  );
}
