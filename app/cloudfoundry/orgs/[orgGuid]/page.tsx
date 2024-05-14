'use server';

import Link from 'next/link';
import {
  getOrg,
  getOrgUsers,
  getSpaces,
  Result,
} from '@/controllers/controllers';
import { UserAction } from './form';
import { OrgMembersList } from '@/components/CloudFoundry/OrgMembersList';

export default async function OrgPage({
  params,
}: {
  params: {
    orgGuid: string;
  };
}) {
  try {
    const orgRes = await getOrg(params.orgGuid);
    const users = await getOrgUsers(params.orgGuid);
    const spacesRes = await getSpaces([params.orgGuid]);
    const spaces = spacesRes.payload?.resources || [];

    if (orgRes.payload) {
      const org = orgRes.payload;
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

            <h2>Spaces</h2>
            <ul>
              {spaces.map((space: any) => (
                <li key={space.guid}>
                  <Link
                    href={`/cloudfoundry/orgs/${org.guid}/spaces/${space.guid}`}
                  >
                    {space.name}
                  </Link>
                </li>
              ))}
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
  if (users && users.payload) {
    return (
      <>
        <div className="grid-col-6">
          <h2>Org members</h2>
          <OrgMembersList org={org} users={users.payload} />
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
