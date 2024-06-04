'use client';

import Link from 'next/link';
import { underscoreToText } from '@/helpers/text';
import {
  RolesByUserRole,
  SpacesBySpaceId,
} from '@/controllers/controller-types';
import { RoleType } from '@/api/cf/cloudfoundry-types';

interface RoleRanking {
  [roleType: string]: number;
}

const role_ranking: RoleRanking = {
  space_manager: 4,
  space_developer: 3,
  space_auditor: 2,
  space_supporter: 1,
};

interface RolesResult {
  [spaceGuid: string]: RoleType;
}

const displaySize = 4;

export function numberExtra(size: number): number {
  return size - displaySize;
}

export function groupedRoles(roles: Array<RolesByUserRole>): RolesResult {
  return roles.reduce((acc: RolesResult, item) => {
    if (!acc[item.guid]) {
      acc[item.guid] = item.role;
      return acc;
    }
    var thisRole = item.role;
    var currentRole = acc[item.guid];
    if (role_ranking[thisRole] > role_ranking[currentRole]) {
      acc[item.guid] = item.role;
    }
    return acc;
  }, {} as RolesResult);
}

export function UsersListSpaceRoles({
  roles,
  spaces,
}: {
  roles: Array<RolesByUserRole>;
  spaces: SpacesBySpaceId;
}) {
  const rolesRes = groupedRoles(roles);
  const rolesResKeys = Object.keys(rolesRes);
  const extra = numberExtra(rolesResKeys.length);
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
        {rolesResKeys
          .slice(0, displaySize)
          .map((spaceGuid: string, i: number) => (
            <div
              key={`UsersListSpaceRoles-spaces-${i}`}
              className="width-card padding-right-1"
            >
              <div className="text-bold text-capitalize">
                {spaces[spaceGuid].name}
              </div>
              <div className="text-capitalize">
                {underscoreToText(rolesRes[spaceGuid])}
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
