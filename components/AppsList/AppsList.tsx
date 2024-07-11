import { AppObj } from '@/api/cf/cloudfoundry-types';
import { sortObjectsByParam } from '@/helpers/arrays';
import { GridList } from '../GridList/GridList';
import { AppsListItem } from './AppsListItem';

export function AppsList({
  apps,
  orgGuid,
  spaces,
}: {
  apps: Array<AppObj>;
  orgGuid: string;
  // TODO do we want to define this better?
  spaces: any;
}) {
  const appsSorted = sortObjectsByParam(apps, 'name');

  return appsSorted.length > 0 ? (
    <GridList>
      {appsSorted.map((app) => {
        return (
          <AppsListItem
            key={`AppsListItem-${app.guid}`}
            app={app}
            orgGuid={orgGuid}
            space={spaces[app.relationships.space.data.guid]}
          />
        );
      })}
    </GridList>
  ) : (
    <p>No applications found</p>
  );
}
