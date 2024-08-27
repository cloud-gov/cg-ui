import { Button } from '@/components/uswds/Button';
import Link from 'next/link';
import classnames from 'classnames';
import { Table } from '@/components/uswds/Table/Table';
import { TableHead } from '@/components/uswds/Table/TableHead';
import { TableHeadCell } from '@/components/uswds/Table/TableHeadCell';
import { TableBody } from '@/components/uswds/Table/TableBody';
import { TableRow } from '@/components/uswds/Table/TableRow';
import { TableCell } from '@/components/uswds/Table/TableCell';
import { ServiceTag } from '@/components/ServiceTag';
import { SortButton } from '@/components/SortButton';

export default function TablePage() {
  // active color: bg-accent-cool-lightest

  const mockUsers = [
    {
      email: 'firstname.lastname@gsa.gov',
      orgRoles: '4 roles',
      spaceRoles: '2 of 3 spaces',
      expires: 'Never',
      lastLogin: 'Oct. 24, 2023',
    },
    {
      email: 'longerfirstname+service-account12345678.lastname@gsa.gov',
      orgRoles: 'None yet — edit roles',
      spaceRoles: 'None yet — edit permissions',
      expires: '90 days',
      lastLogin: 'Unknown — resend invite',
    },
  ];

  const MobileLabel = ({ label }: { label: string }) => (
    <div className="mobile-lg:display-none text-bold text-capitalize">
      {label}
    </div>
  );

  return (
    <div className="grid-container padding-bottom-5">
      <h2>Table</h2>

      <Table
        caption="users for this organization"
        sortText="This table is now sorted by Account Name in descending order."
      >
        <TableHead>
          <TableHeadCell data="account name" sortDir="desc" />
          <TableHeadCell data="organization roles" />
          <TableHeadCell data="access permissions" />
          <TableHeadCell data="expires" />
          <TableHeadCell data="last login" />
          <TableHeadCell />
        </TableHead>
        <TableBody>
          {mockUsers.map((user, index) => (
            <TableRow key={`table-row-${index}`}>
              <TableCell colName="account name" rowheader={true}>
                <div className="display-flex flex-justify">
                  <span className="mobile-lg:text-bold maxw-card-lg text-ellipsis">
                    {user.email}
                  </span>
                  {index === 1 && (
                    <ServiceTag className="margin-left-1 margin-right-0" />
                  )}
                </div>
              </TableCell>

              <TableCell colName="organization roles">
                {index === 0 && <Link href="/">{user.orgRoles}</Link>}
                {index === 1 && (
                  <>
                    None yet —{' '}
                    <Link href="/" className="text-bold">
                      edit roles
                    </Link>
                  </>
                )}
              </TableCell>

              <TableCell colName="access permissions">
                <Link href="/">{user.spaceRoles}</Link>
              </TableCell>

              <TableCell colName="expires">{user.expires}</TableCell>

              <TableCell colName="last login">{user.lastLogin}</TableCell>

              <TableCell className="text-center mobile-lg:text-right">
                <Button className="usa-button--outline width-auto margin-0 mobile-lg:padding-y-1 mobile-lg:padding-x-105 mobile-lg:font-sans-xs">
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2>Layout Grid</h2>

      <div role="table" aria-describedby="users-table" aria-rowcount={2}>
        <div className="display-none tablet:display-flex grid-row" role="row">
          <div className="usa-sr-only" id="users-table">
            Users list
          </div>
          <div
            role="columnheader"
            className="grid-col grid-col-3 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            account name <SortButton colName="account name" />
          </div>
          <div
            role="columnheader"
            className="grid-col grid-col-2 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            organization roles <SortButton colName="organization roles" />
          </div>
          <div
            role="columnheader"
            className="grid-col grid-col-2 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            access permissions <SortButton colName="access permissions" />
          </div>
          <div
            role="columnheader"
            className="grid-col grid-col-1 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            expires <SortButton colName="expires" />
          </div>
          <div
            role="columnheader"
            className="grid-col grid-col-2 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            last login <SortButton colName="last login" />
          </div>
        </div>
        {mockUsers.map((u, i) => (
          <div
            key={`layout-grid-row-${i}`}
            role="row"
            aria-rowindex={i}
            className={classnames(
              'grid-row',
              'margin-top-4',
              'tablet:margin-top-0',
              'bg-white',
              'border-x',
              'border-base-light',
              'tablet:border-base-light', // need this again to stay the right color on desktop
              'border-top-05',
              'tablet:border-top-1px',
              'border-bottom-1px',
              i == mockUsers.length - 1
                ? 'tablet:border-bottom-1px'
                : 'tablet:border-bottom-0',
              'font-ui-2xs'
            )}
          >
            <div
              role="cell"
              className="tablet:grid-col tablet:grid-col-3 tablet:display-flex flex-align-center tablet:border-right tablet:border-base-light padding-2 tablet:text-bold"
            >
              <MobileLabel label="Account name" />
              {u.email}
            </div>
            <div
              role="cell"
              className="tablet:grid-col tablet:grid-col-2 tablet:display-flex flex-align-center padding-2"
            >
              <MobileLabel label="Organization roles" />
              <Link href="/">{u.orgRoles}</Link>
            </div>
            <div
              role="cell"
              className="tablet:grid-col tablet:grid-col-2 tablet:display-flex flex-align-center padding-2"
            >
              <MobileLabel label="Access permissions" />
              <Link href="/">{u.spaceRoles}</Link>
            </div>
            <div
              role="cell"
              className="tablet:grid-col tablet:grid-col-1 tablet:display-flex flex-align-center padding-2"
            >
              <MobileLabel label="Expires" />
              {u.expires}
            </div>
            <div
              role="cell"
              className="tablet:grid-col tablet:grid-col-2 tablet:display-flex flex-align-center padding-2"
            >
              <MobileLabel label="Last login" />
              {u.lastLogin}
            </div>
            <div
              role="cell"
              className="tablet:grid-col tablet:display-flex flex-align-center flex-justify-end padding-1 text-center"
            >
              <Button className="usa-button--outline width-auto">Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
