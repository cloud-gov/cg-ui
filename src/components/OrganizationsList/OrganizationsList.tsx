import { OrgObj } from '@/api/cf/cloudfoundry-types';
import { sortObjectsByParam } from '@/helpers/arrays';
import { GridList } from '../GridList/GridList';
import { OrganizationsListItem } from './OrganizationsListItem';

export function OrganizationsList({
  orgs,
  userCounts,
  appCounts,
  memoryAllocated,
  memoryCurrentUsage,
  spaceCounts,
}: {
  orgs: Array<OrgObj>;
  userCounts: { [orgGuid: string]: number };
  appCounts: { [orgGuid: string]: number };
  memoryAllocated: { [orgGuid: string]: number };
  memoryCurrentUsage: { [orgGuid: string]: number };
  spaceCounts: { [orgGuid: string]: number };
}) {
  const orgsSorted = sortObjectsByParam(orgs, 'name');

  return orgsSorted.length > 0 ? (
    <GridList>
      {orgsSorted.map((org) => {
        return (
          <div key={`OrgsListItem-${org.guid}`}>
            <OrganizationsListItem org={org} />
            <ol>
              <li>number of users: {userCounts[org.guid]}</li>
              <li>number of apps: {appCounts[org.guid]}</li>
              <li>
                memory allocated:{' '}
                {memoryAllocated[org.guid] === null
                  ? 'unlimited'
                  : memoryAllocated[org.guid]}
              </li>
              <li>memory current usage: {memoryCurrentUsage[org.guid]}</li>
              <li>
                memory remaining:{' '}
                {memoryAllocated[org.guid] - memoryCurrentUsage[org.guid]}
              </li>
              <li>number of spaces: {spaceCounts[org.guid] || 0}</li>
            </ol>
          </div>
        );
      })}
    </GridList>
  ) : (
    <p>No organizations found</p>
  );
}
