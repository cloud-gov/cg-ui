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
    <div className="tablet:padding-right-2 tablet:border-right tablet:border-base-light tablet:height-full">
      <div className="display-flex flex-align-center padding-bottom-1">
        <h4 className="margin-0 margin-right-2 font-body-xs text-semibold text-base">
          Spaces and roles
        </h4>
        <span>
          <Link
            href="/todo"
            className="usa-button usa-button--unstyled margin-right-2 font-body-2xs"
          >
            Edit
          </Link>
        </span>
        <span>
          <Link
            href="/todo"
            className="usa-button usa-button--unstyled font-body-2xs"
          >
            View All
          </Link>
        </span>
      </div>
      <div className="tablet:display-flex padding-top-1">
        {spaces.slice(0, displaySize).map((role, i) => (
          <div
            key={`UsersListSpaceRoles-spaces-${i}`}
            className="flex-1 padding-right-1"
          >
            <div className="text-bold">{role.spaceName}</div>
            <div>{role.roleName}</div>
          </div>
        ))}
        {extra > 0 && (
          <Link href="/todo" className="usa-button usa-button--unstyled">
            + {extra}
          </Link>
        )}
      </div>
    </div>
  );
}
