'use server';

import Link from 'next/link';
import { getOrgPage } from '@/controllers/controllers';
import { ControllerResult } from '@/controllers/controller-types';

export default async function OrgPage({
  params,
}: {
  params: {
    orgId: string;
  };
}) {
  const controllerRes = (await getOrgPage(params.orgId)) as ControllerResult;

  const { org, roles, spaces, users } = controllerRes.payload;

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

        <div className="grid-row grid-gap">
          <h3>Roles</h3>
          {JSON.stringify(roles)}
          <h3>Users</h3>
          {JSON.stringify(users)}
        </div>
      </div>
    </>
  );
}
