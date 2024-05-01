'use server';

import Link from 'next/link';
import {
  getCFOrg,
  getCFOrgUsers,
} from '../../../../api/cloudfoundry/cloudfoundry';
import { UserAction } from './form';
import { OrgMembersList } from '../../../../components/cloudfoundry/OrgMembersList';

export default async function OrgPage({
  params,
}: {
  params: {
    guid: string;
  };
}) {
  try {
    const org = await getCFOrg(params.guid);
    const users = await getCFOrgUsers(params.guid);

    return (
      <>
        <Link href="/cloudfoundry">Back to Cloud Foundry home</Link>;
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
              <OrgMembersList users={users} />
            </div>
            <div className="grid-col-6">
              <UserAction orgGuid={params.guid} />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error: any) {
    return <div>{error.message}</div>;
  }
}
