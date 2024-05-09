'use server';

import Link from 'next/link';
import {
  getOrg,
  getOrgUsers,
  Result,
} from '../../../../controllers/controllers';
import { UserAction } from './form';
import { OrgMembersList } from '../../../../components/CloudFoundry/OrgMembersList';

export default async function OrgPage({
  params,
}: {
  params: {
    guid: string;
  };
}) {
  try {
    const orgRes = await getOrg(params.guid);
    const users = await getOrgUsers(params.guid);

    if (orgRes.body) {
      const org = orgRes.body;
      return (
        <>
          <Link href="/cloudfoundry">Back to Cloud Foundry home</Link>
          <div className="grid-container">
            <h1>{org.name}</h1>
            <ul>
              <li>Name: {org.name}</li>
              <li>Suspended: {org.suspended}</li>
              <li>Created: {org.created_at}</li>
            </ul>

            <div className="grid-row">
              <OrgMembers org={org} users={users} />
            </div>
          </div>
        </>
      );
    } else {
      return <div role="alert">{orgRes.message}</div>;
    }
  } catch (error: any) {
    return <div role="alert">{error.message}</div>;
  }
}

async function OrgMembers({ org, users }: { org: any; users: Result }) {
  if (users && users.body) {
    return (
      <>
        <div className="grid-col-6">
          <h2>Org members</h2>
          <OrgMembersList org={org} users={users.body} />
        </div>
        <div className="grid-col-6">
          <UserAction orgGuid={org.guid} />
        </div>
      </>
    );
  } else {
    return <div role="alert">{users.message}</div>;
  }
}
