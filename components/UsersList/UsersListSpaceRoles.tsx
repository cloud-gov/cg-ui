'use client';

import Link from 'next/link';

export interface UserSpaceRole {
  spaceName: string;
  roleName: string;
}

const displaySize = 4;

export function numberExtra(size: number): number {
  return size - displaySize;
}

export function UsersListSpaceRoles({
  spaces,
}: {
  spaces: Array<UserSpaceRole>;
}) {
  const extra = numberExtra(spaces.length);
  return (
    <div>
      <div className="display-flex flex-align-center padding-bottom-1">
        <h4 className="font-heading-2xs margin-0 padding-right-1">
          Spaces and roles
        </h4>
        <span>
          <Link href="/todo" className="font-body-2xs">
            View All
          </Link>
        </span>
      </div>
      <div className="display-flex padding-top-1">
        {spaces.slice(0, displaySize).map((role, i) => (
          <div
            key={`UsersListSpaceRoles-spaces-${i}`}
            className="padding-right-1"
          >
            <div className="text-bold">{role.spaceName}</div>
            <div>{role.roleName}</div>
          </div>
        ))}
        {extra > 0 && <Link href="/todo">+ {extra}</Link>}
      </div>
    </div>
  );
}
