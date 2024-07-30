import Link from 'next/link';
import { OrgObj } from '@/api/cf/cloudfoundry-types';
import { GridListItem } from '../GridList/GridListItem';
import { GridListItemTop } from '../GridList/GridListItemTop';
import { GridListItemBottom } from '../GridList/GridListItemBottom';
import { GridListItemBottomLeft } from '../GridList/GridListItemBottomLeft';
import { GridListItemBottomCenter } from '../GridList/GridListItemBottomCenter';
import { GridListItemBottomRight } from '../GridList/GridListItemBottomRight';
import { formatDate } from '@/helpers/dates';

export function OrganizationsListItem({ org }: { org: OrgObj }) {
  return (
    <GridListItem>
      <div className="margin-bottom-2 tablet:margin-bottom-0">
        <GridListItemTop>
          <h2 className="font-heading-md margin-bottom-0 text-break-all">
            {org.name}
          </h2>
        </GridListItemTop>
        <GridListItemBottom>
          <GridListItemBottomLeft>
            Status: {org.suspended ? 'Suspended' : 'Active'}
          </GridListItemBottomLeft>
          <GridListItemBottomCenter>
            <div className="tablet:border-x tablet:border-base-light tablet:padding-x-2">
              <ul>
                <li>
                  <Link href={`/orgs/${org.guid}`} className="usa-link">
                    Manage users
                  </Link>
                </li>
                <li>
                  <Link href={`/orgs/${org.guid}/apps`} className="usa-link">
                    View applications
                  </Link>
                </li>
                <li>
                  <Link href={`/orgs/${org.guid}/usage`} className="usa-link">
                    View usage
                  </Link>
                </li>
              </ul>
            </div>
          </GridListItemBottomCenter>
          <GridListItemBottomRight>
            <div
              className="text-right text-base"
              aria-label="organization creation date"
            >
              Created: {formatDate(org.created_at)}
            </div>
          </GridListItemBottomRight>
        </GridListItemBottom>
      </div>
    </GridListItem>
  );
}
