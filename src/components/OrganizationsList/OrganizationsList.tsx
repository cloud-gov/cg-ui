import React from 'react';
import { OrgObj } from '@/api/cf/cloudfoundry-types';
import { chunkArray, sortObjectsByParam } from '@/helpers/arrays';
import { CardRow } from '@/components/Card/CardRow';
import { OrganizationsListCard } from './OrganizationsListCard';

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

  return (
    <div className="margin-y-4">
      {orgsGrouped.map((orgGoup, groupIndex) => {
        return (
          <CardRow key={`org-group-${groupIndex}`}>
            {orgGoup.map((org) => {
              return (
                <OrganizationsListCard
                  key={`org-${org.guid}`}
                  org={org}
                  userCount={userCounts[org.guid]}
                  appCount={appCounts[org.guid]}
                  memoryAllocated={memoryAllocated[org.guid]}
                  memoryCurrentUsage={memoryCurrentUsage[org.guid]}
                  spaceCount={spaceCounts[org.guid]}
                  roles={roles[org.guid]}
                />
              );
            })}
          </CardRow>
        );
      })}
    </div>
  );
}
