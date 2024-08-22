import { Button } from '@/components/uswds/Button';
import Link from 'next/link';
import classnames from 'classnames';

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
      email: 'longerfirstname.lastname@gsa.gov',
      orgRoles: 'None yet — edit roles',
      spaceRoles: 'None yet — edit permissions',
      expires: '90 days',
      lastLogin: 'Unknown — resend invite',
    },
  ];

  const SortArrow = ({
    direction = 'unsorted',
  }: {
    direction?: 'unsorted' | 'asc' | 'desc';
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      {direction === 'desc' && (
        <path d="M17 17L15.59 15.59L12.9999 18.17V2H10.9999V18.17L8.41 15.58L7 17L11.9999 22L17 17Z"></path>
      )}
      {direction === 'asc' && (
        <path
          transform="rotate(180, 12, 12)"
          d="M17 17L15.59 15.59L12.9999 18.17V2H10.9999V18.17L8.41 15.58L7 17L11.9999 22L17 17Z"
        ></path>
      )}
      {direction === 'unsorted' && (
        <polygon points="15.17 15 13 17.17 13 6.83 15.17 9 16.58 7.59 12 3 7.41 7.59 8.83 9 11 6.83 11 17.17 8.83 15 7.42 16.41 12 21 16.59 16.41 15.17 15"></polygon>
      )}
    </svg>
  );

  const MobileLabel = ({ label }: { label: string }) => (
    <div className="tablet:display-none text-bold">{label}</div>
  );

  return (
    <div className="grid-container padding-bottom-5">
      <h2>Using Table</h2>

      <table className="usa-table usa-table--stacked">
        <caption className="usa-sr-only">Users for this organization</caption>
        <thead>
          <tr>
            <th scope="col text-uppercase">
              <div className="display-flex flex-align-center font-sans-3xs text-normal text-uppercase">
                account name <SortArrow />
              </div>
            </th>
            <th scope="col">
              <div className="display-flex flex-align-center font-sans-3xs text-normal text-uppercase">
                organization roles <SortArrow />
              </div>
            </th>
            <th scope="col">
              <div className="display-flex flex-align-center font-sans-3xs text-normal text-uppercase">
                access permissions <SortArrow />
              </div>
            </th>
            <th scope="col">
              <div className="display-flex flex-align-center font-sans-3xs text-normal text-uppercase">
                expires <SortArrow />
              </div>
            </th>
            <th scope="col">
              <div className="display-flex flex-align-center font-sans-3xs text-normal text-uppercase">
                last login <SortArrow />
              </div>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user, index) => (
            <tr key={`table-row-${index}`}>
              <th>
                <span className="text-bold">{user.email}</span>
              </th>
              <td>
                <Link href="/">{user.orgRoles}</Link>
              </td>
              <td>
                <Link href="/">{user.spaceRoles}</Link>
              </td>
              <td>{user.expires}</td>
              <td>{user.lastLogin}</td>
              <td>
                <Button className="usa-button--outline">Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Using Layout Grid</h2>

      <div aria-role="table" aria-describedby="users-table" aria-row-count="2">
        <div
          className="display-none tablet:display-flex grid-row"
          aria-role="row"
        >
          <div className="usa-sr-only" id="users-table">
            Users list
          </div>
          <div
            aria-role="columnheader"
            className="grid-col grid-col-3 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            account name <SortArrow />
          </div>
          <div
            aria-role="columnheader"
            className="grid-col grid-col-2 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            organization roles <SortArrow />
          </div>
          <div
            aria-role="columnheader"
            className="grid-col grid-col-2 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            access permissions <SortArrow />
          </div>
          <div
            aria-role="columnheader"
            className="grid-col grid-col-1 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            expires <SortArrow />
          </div>
          <div
            aria-role="columnheader"
            className="grid-col grid-col-2 display-flex flex-align-center padding-x-2 padding-y-1 font-sans-3xs text-uppercase"
          >
            last login <SortArrow />
          </div>
        </div>
        {mockUsers.map((u, i) => (
          <div
            key={`layout-grid-row-${i}`}
            aria-role="row"
            aria-row-index={i}
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
                : 'tablet:border-bottom-0'
            )}
          >
            <div
              aria-role="cell"
              className="tablet:grid-col tablet:grid-col-3 tablet:display-flex flex-align-center tablet:border-right tablet:border-base-light padding-2 tablet:text-bold"
            >
              <MobileLabel label="Account name" />
              {u.email}
            </div>
            <div
              aria-role="cell"
              className="tablet:grid-col tablet:grid-col-2 tablet:display-flex flex-align-center padding-2"
            >
              <MobileLabel label="Organization roles" />
              <Link href="/">{u.orgRoles}</Link>
            </div>
            <div
              aria-role="cell"
              className="tablet:grid-col tablet:grid-col-2 tablet:display-flex flex-align-center padding-2"
            >
              <MobileLabel label="Access permissions" />
              <Link href="/">{u.spaceRoles}</Link>
            </div>
            <div
              aria-role="cell"
              className="tablet:grid-col tablet:grid-col-1 tablet:display-flex flex-align-center padding-2"
            >
              <MobileLabel label="Expires" />
              {u.expires}
            </div>
            <div
              aria-role="cell"
              className="tablet:grid-col tablet:grid-col-2 tablet:display-flex flex-align-center padding-2"
            >
              <MobileLabel label="Last login" />
              {u.lastLogin}
            </div>
            <div
              aria-role="cell"
              className="tablet:grid-col tablet:display-flex flex-align-center padding-1 text-center"
            >
              <Button className="usa-button--outline">Remove</Button>
            </div>
          </div>
        ))}
      </div>

      <h2>Modeling a Table with ARIA roles</h2>
      <div aria-role="table">
        <div aria-role="row">
          <div aria-role="columnheader">first name</div>
          <div aria-role="columnheader">last name</div>
        </div>
        <div aria-role="row">
          <div aria-role="cell">eleni</div>
          <div aria-role="cell">chappen</div>
        </div>
      </div>
    </div>
  );
}
