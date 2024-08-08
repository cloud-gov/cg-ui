// import Link from "next/link";
import { AppObj, SpaceObj } from '@/api/cf/cloudfoundry-types';
import { GridListItem } from '../GridList/GridListItem';
import { GridListItemTop } from '../GridList/GridListItemTop';
import { GridListItemBottom } from '../GridList/GridListItemBottom';
import { GridListItemBottomLeft } from '../GridList/GridListItemBottomLeft';
import { GridListItemBottomCenter } from '../GridList/GridListItemBottomCenter';
import { GridListItemBottomRight } from '../GridList/GridListItemBottomRight';
import { formatDate } from '@/helpers/dates';

export function AppsListItem({
  app,
  // eslint-disable-next-line no-unused-vars
  orgGuid,
  space,
}: {
  app: AppObj;
  orgGuid: string;
  space: SpaceObj;
}) {
  return (
    <GridListItem>
      <div className="margin-bottom-2 tablet:margin-bottom-0">
        <GridListItemTop>
          <h2 className="font-heading-md margin-bottom-0 text-break-all">
            {app.name.length > 0 ? app.name : 'Unnamed application'}
          </h2>
        </GridListItemTop>
        <GridListItemBottom>
          <GridListItemBottomLeft>Status: {app.state}</GridListItemBottomLeft>
          <GridListItemBottomCenter>
            <div className="tablet:border-x tablet:border-base-light tablet:padding-x-2">
              Space: {space.name}
            </div>
          </GridListItemBottomCenter>
          <GridListItemBottomRight>
            <div
              className="text-right text-base"
              aria-label="organization creation date"
            >
              Created: {formatDate(app.created_at)}
            </div>
          </GridListItemBottomRight>
        </GridListItemBottom>
      </div>
    </GridListItem>
  );
}
