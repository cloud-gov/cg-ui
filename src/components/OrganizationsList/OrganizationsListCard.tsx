import React from 'react';
import Link from 'next/link';
import { OrgObj } from '@/api/cf/cloudfoundry-types';
import { Card } from '@/components/Card/Card';
import { formatInt } from '@/helpers/numbers';
import { MemoryBar } from '@/components/MemoryBar';
import { formatOrgRoleName } from '@/helpers/text';

export function OrganizationsListCard({
  org,
  userCount,
  appCount,
  memoryAllocated,
  memoryCurrentUsage,
  spaceCount,
  roles,
}: {
  org: OrgObj;
  userCount: number;
  appCount: number;
  memoryAllocated: number;
  memoryCurrentUsage: number;
  spaceCount: number;
  roles: Array<string>;
}) {
  const getOrgRolesText = (orgGuid: string): React.ReactNode => {
    if (!roles || !roles.length) {
      return (
        <>
          You're a <strong>User</strong> in this organization.
        </>
      );
    }
    const formattedRoles = roles
      .map<React.ReactNode>((r) => (
        <span className="text-bold text-capitalize" key={`${orgGuid}-${r}`}>
          {formatOrgRoleName(r).replace('org ', '')}
        </span>
      ))
      .reduce((prev, cur) => [prev, ' and ', cur]);
    return <>You're a {formattedRoles} in this organization.</>;
  };

  return (
    <Card>
      <h2 className="margin-top-0 border-bottom border-gray-cool-20 padding-bottom-2 font-sans-md tablet-lg:font-sans-lg">
        <Link href={`/orgs/${org.guid}`} className="usa-link text-ellipsis">
          {org.name}
        </Link>
      </h2>

      <div className="display-flex flex-justify">
        <div className="maxw-card font-sans-3xs line-height-sans-4">
          {getOrgRolesText(org.guid)}
        </div>
        <div className="maxw-15 font-sans-3xs line-height-sans-4">
          <p className="margin-top-0 margin-bottom-1 text-uppercase">
            at&nbsp;a&nbsp;glance:
          </p>
          <ul className="usa-list usa-list--unstyled">
            <li>
              <Link href={`/orgs/${org.guid}`} className="usa-link">
                {formatInt(userCount)}&nbsp;users
              </Link>
            </li>
            <li>
              <Link href={`/orgs/${org.guid}`} className="usa-link">
                {formatInt(spaceCount)}&nbsp;spaces
              </Link>
            </li>
            <li>
              <Link href={`/orgs/${org.guid}/apps`} className="usa-link">
                {formatInt(appCount)}&nbsp;applications
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <MemoryBar
        memoryUsed={memoryCurrentUsage}
        memoryAllocated={memoryAllocated}
      />
    </Card>
  );
}
