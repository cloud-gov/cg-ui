import { OrgObj } from '@/api/cf/cloudfoundry-types';
import { sortObjectsByParam } from '@/helpers/arrays';
import { GridList } from '../GridList/GridList';
import { OrganizationsListItem } from './OrganizationsListItem';

export function OrganizationsList({ orgs }: { orgs: Array<OrgObj> }) {
  const orgsSorted = sortObjectsByParam(orgs, 'name');

  return orgsSorted.length > 0 ? (
    <GridList>
      {orgsSorted.map((org) => {
        return (
          <OrganizationsListItem key={`OrgsListItem-${org.guid}`} org={org} />
        );
      })}
    </GridList>
  ) : (
    <p>No organizations found</p>
  );
}
