'use client';

import Link from 'next/link';
import { getCFOrg, getCFOrgUsers } from '../../../../api/cloudfoundry';
import { addData } from '../../../../api/api';

export function UserAction({ orgGuid }) {
  const addUser = async (event) => {
    event.preventDefault();
    const username = event.currentTarget.elements['email-username'];
    const roleType = event.currentTarget.elements['org-role'];
    try {
      // TODO implement error handling
      if (!username) {
        return;
      }
      const res = await addData('/api/cf/roles', {
        orgGuid: orgGuid,
        roleType: roleType,
        username: username,
      });
      if (!res) {
        // TODO figure out what we want to do here
        console.log('did not receive a response');
        return;
      }
      return;
    } catch (error) {
      console.log('error with request: ' + error.message);
    }
  };
  return (
    <form onSubmit={addUser} className="usa-form" action="#">
      <label className="usa-label" htmlFor="email-username">
        Email
      </label>
      <input className="usa-input" id="email-username" name="email-username" />
      <label className="usa-label" htmlFor="org-role">
        Organization role
      </label>
      <select className="usa-select" name="org-role" id="org-role">
        <option value>- Select -</option>
        <option value="organization_manager">Organization manager</option>
        <option value="organization_user">Organization user</option>
        <option value="organization_auditor">Organization auditor</option>
        <option value="organization_billing_manager">
          Organization billing_manager
        </option>
      </select>
      <div>
        <button className="usa-button" role="button" type="submit">
          Add user (not implemented)
        </button>
      </div>
    </form>
  );
}

export default async function OrgPage({
  params,
}: {
  params: {
    guid: string;
  };
}) {
  <Link href="/cloudfoundry">Back to Cloud Foundry home</Link>;
  try {
    const org = await getCFOrg(params.guid);
    const users = await getCFOrgUsers(params.guid);
    return (
      <>
        <div className="grid-container">
          <h1>{org.name}</h1>
          <ul>
            <li>Name: {org.name}</li>
            <li>Suspended: {org.suspended}</li>
            <li>Created: {org.created_at}</li>
          </ul>

          <div className="grid-row">
            <div className="grid-col-6">
              <h2>Org members</h2>
              <ul>
                {users.map((user: any) => (
                  <li key={user.guid}>
                    {user.username}, {user.origin}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid-col-6">
              <UserAction orgGuid={org.guid} />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error: any) {
    return <div>{error.message}</div>;
  }
}
