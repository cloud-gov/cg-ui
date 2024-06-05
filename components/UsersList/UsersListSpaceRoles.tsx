'use client';

import Link from 'next/link';
import { underscoreToText } from '@/helpers/text';
import {
  SpacesBySpaceId,
  RankedSpaceRoles,
} from '@/controllers/controller-types';

const displaySize = 4;

export function numberExtra(size: number): number {
  return size - displaySize;
}

export function UsersListSpaceRoles({
  roles,
  spaces,
}: {
  roles: RankedSpaceRoles;
  spaces: SpacesBySpaceId;
}) {
  // const rolesRes = groupedRoles(roles);
  const rolesKeys = Object.keys(roles);
  const extra = numberExtra(rolesKeys.length);
  return (
    <div className="tablet:padding-right-2 tablet:border-right tablet:border-base-light tablet:height-full">
      <div className="display-flex flex-align-center padding-bottom-1">
        <h4 className="margin-0 margin-right-2 font-body-2xs text-semibold text-base">
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
      <div className="tablet:display-flex tablet:flex-row padding-top-1">
        {rolesKeys.slice(0, displaySize).map((spaceGuid: string, i: number) => (
          <div
            key={`UsersListSpaceRoles-spaces-${i}`}
            className="width-card padding-right-1"
          >
            <div className="text-bold text-capitalize">
              {spaces[spaceGuid].name}
            </div>
            <div className="text-capitalize">
              {underscoreToText(roles[spaceGuid].role)}
            </div>
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
