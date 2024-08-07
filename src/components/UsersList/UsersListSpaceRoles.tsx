'use client';

import Link from 'next/link';
import { underscoreToText } from '@/helpers/text';
import {
  SpacesBySpaceId,
  SpaceRoles,
  RolesByUserRole,
} from '@/controllers/controller-types';
import { sortObjectsByParam } from '@/helpers/arrays';

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
  const rolesKeys = Object.keys(roles);
  const extra = numberExtra(rolesKeys.length);
  const userLink = `/orgs/${orgGuid}/users/${userGuid}`;
  return (
    <div className="tablet:padding-right-2 tablet:border-right tablet:border-base-light tablet:height-full">
      <div className="display-flex flex-align-center padding-bottom-1">
        <h3 className="margin-0 margin-right-2 font-body-2xs text-semibold text-base font-heading-sm">
          Spaces and roles
        </h3>
        <span>
          <Link
            href={userLink}
            className="usa-button usa-button--unstyled margin-right-2 font-body-2xs"
            aria-label="edit spaces and roles for this user"
          >
            Edit
          </Link>
        </span>
      </div>
      <div className="tablet:display-flex tablet:flex-row padding-top-1">
        {!rolesKeys.length && (
          <p className="text-italic text-base">
            This user has not been added to any spaces. You can add them to
            spaces and manage access by clicking Edit.
          </p>
        )}
        {rolesKeys.slice(0, displaySize).map((spaceGuid: string, i: number) => (
          <div
            key={`UsersListSpaceRoles-spaces-${i}`}
            className="width-card padding-right-1"
          >
            <div className="text-bold text-capitalize">
              {spaces[spaceGuid].name}
            </div>
            {sortObjectsByParam(roles[spaceGuid], 'role').map(
              (roleObj: RolesByUserRole, ri: number) => (
                <div
                  key={`UsersListSpaceRoles-spaceRoles-${ri}`}
                  className="text-capitalize padding-top-1"
                >
                  {underscoreToText(roleObj.role)}
                </div>
              )
            )}
          </div>
        ))}
        {extra > 0 && (
          <Link
            href={userLink}
            className="usa-button usa-button--unstyled text-no-wrap"
          >
            +{extra}
          </Link>
        )}
      </div>
    </div>
  );
}
