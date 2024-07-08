'use server';

import Link from 'next/link';
import { getOrgPage } from '@/controllers/prototype-controller';
import { ControllerResult } from '@/controllers/controller-types';
import { RoleType } from '@/api/cf/cloudfoundry-types';
import { UserAction } from './form';
import { OrgMembersList } from '@/components/CloudFoundry/OrgMembersList';

export default async function OrgPage({
  params,
}: {
  params: {
    orgGuid: string;
  };
}) {
  const controllerRes = (await getOrgPage(params.orgGuid)) as ControllerResult;

  const { org, users, spaces } = controllerRes.payload;

  return (
    <>
      <Link href="/prototype/cloudfoundry">Back to Cloud Foundry home</Link>
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
                href={`/prototype/cloudfoundry/orgs/${org.guid}/spaces/${space.guid}`}
              >
                {space.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="grid-row grid-gap">
          <OrgMembers org={org} users={users} />
        </div>
      </div>
    </>
  );
}

async function OrgMembers({
  org,
  users,
}: {
  org: any;
  users: {
    guid: string;
    origin: string;
    roles: {
      guid: string;
      type: RoleType;
    }[];
    username: string;
  }[];
}) {
  if (users) {
    return (
      <>
        <div className="grid-col-6">
          <h2>Org members</h2>
          <OrgMembersList org={org} users={users} />
        </div>
        <div className="grid-col-6">
          <UserAction orgGuid={org.guid} />
        </div>
      </>
    );
  } else {
    return <div role="alert">This organization does not have users</div>;
  }
}
