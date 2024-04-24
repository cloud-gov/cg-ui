import { useState } from 'react';
import { UsersTableCol } from './UsersTableCol';
import { UsersTableSpaces } from './UsersTableSpaces';
import { CFUserInterface } from './_interfaces';

export function UsersTableRow({ user }: { user: CFUserInterface }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="grid-row users-table-row">
        <UsersTableCol auto>
          <p>
            <strong>{user.email}</strong>
          </p>
          <p>Billing manager</p>
          <p>Org auditor</p>
        </UsersTableCol>
        <UsersTableCol>
          <div className="display-flex flex-row padding-y-2">
            <div className="padding-x-2">
              <button className="usa-button usa-button--unstyled">
                <svg
                  className="usa-icon"
                  aria-hidden="true"
                  role="img"
                  width="13"
                  height="13"
                >
                  <use xlinkHref="/img/uswds/sprite.svg#edit"></use>
                </svg>
                manage spaces and roles
              </button>
            </div>
            <div>
              <button className="usa-button usa-button--unstyled">
                <svg
                  className="usa-icon"
                  aria-hidden="true"
                  role="img"
                  width="13"
                  height="13"
                >
                  <use xlinkHref="/img/uswds/sprite.svg#remove_circle"></use>
                </svg>
                remove from org
              </button>
            </div>
          </div>

          <div className="display-flex flex-row">
            <UsersTableSpaces
              spaces={user.spaces}
              expanded={expanded}
              setExpanded={setExpanded}
            />
            <div className="padding-x-2 users-table-timestamp">
              <div>12:21 PM Oct. 24, 2023</div>
              <div>
                <em>Over 3 months ago</em>
              </div>
            </div>
          </div>
        </UsersTableCol>
      </div>
    </>
  );
}
