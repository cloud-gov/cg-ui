import React from 'react';
import { OrgObj } from '@/api/cf/cloudfoundry-types';
import { chunkArray, sortObjectsByParam } from '@/helpers/arrays';
import Link from 'next/link';
import { MemoryBar } from '@/components/MemoryBar';
import { formatInt } from '@/helpers/numbers';
import { formatOrgRoleName } from '@/helpers/text';

export function OrganizationsList({
  orgs,
  userCounts,
  appCounts,
  memoryAllocated,
  memoryCurrentUsage,
  spaceCounts,
  roles,
}: {
  orgs: Array<OrgObj>;
  userCounts: { [orgGuid: string]: number };
  appCounts: { [orgGuid: string]: number };
  memoryAllocated: { [orgGuid: string]: number };
  memoryCurrentUsage: { [orgGuid: string]: number };
  spaceCounts: { [orgGuid: string]: number };
  roles: { [orgGuid: string]: Array<string> };
}) {
  if (!orgs.length) {
    return <>no orgs found</>;
  }

  const orgsSorted = sortObjectsByParam(orgs, 'name');
  const orgsGrouped = chunkArray(orgsSorted, 3);

  const getOrgRolesText = (orgGuid: string): React.ReactNode => {
    const orgRoles = roles[orgGuid];
    if (!orgRoles || !orgRoles.length) {
      return (
        <>
          You're a <strong>User</strong> in this organization.
        </>
      );
    }
    const formattedRoles = orgRoles
      .map<React.ReactNode>((r) => (
        <span className="text-bold text-capitalize" key={`${orgGuid}-${r}`}>
          {formatOrgRoleName(r).replace('org ', '')}
        </span>
      ))
      .reduce((prev, cur) => [prev, ' and ', cur]);
    return <>You're a {formattedRoles} in this organization.</>;
  };

  return (
    <div className="margin-y-4">
      {orgsGrouped.map((orgGoup, groupIndex) => {
        return (
          <ul
            className="grid-row grid-gap-3 usa-card-group"
            key={`org-group-${groupIndex}`}
          >
            {orgGoup.map((org, index) => {
              return (
                <li
                  className="tablet:grid-col-6 tablet-lg:grid-col-4 margin-bottom-3"
                  key={`org-${index}`}
                >
                  <div className="bg-white border border-gray-cool-20 radius-md padding-2 tablet-lg:padding-3">
                    <h2 className="margin-top-0 border-bottom border-gray-cool-20 padding-bottom-2 font-sans-md tablet-lg:font-sans-lg">
                      <Link
                        href={`/orgs/${org.guid}`}
                        className="usa-link text-ellipsis"
                      >
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
                            <Link
                              href={`/orgs/${org.guid}`}
                              className="usa-link"
                            >
                              {formatInt(userCounts[org.guid])}&nbsp;users
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/orgs/${org.guid}`}
                              className="usa-link"
                            >
                              {formatInt(spaceCounts[org.guid])}&nbsp;spaces
                            </Link>
                          </li>
                          <li>
                            <Link
                              href={`/orgs/${org.guid}/apps`}
                              className="usa-link"
                            >
                              {formatInt(appCounts[org.guid])}&nbsp;applications
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <MemoryBar
                      memoryUsed={memoryCurrentUsage[org.guid]}
                      memoryAllocated={memoryAllocated[org.guid]}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
}
