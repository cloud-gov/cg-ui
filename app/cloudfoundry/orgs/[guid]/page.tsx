'use server';

import Link from 'next/link';
import {
  getCFOrg,
  getCFOrgUsers,
} from '../../../../api/cloudfoundry/cloudfoundry';
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
    const orgRes = await getCFOrg(params.guid);
    const users = await getCFOrgUsers(params.guid);

    if (orgRes.status == 'success' && orgRes.body) {
      const org = orgRes.body;
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
                <OrgMembersList org={org} users={users} />
              </div>
              <div className="grid-col-6">
                <UserAction orgGuid={params.guid} />
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return <div role="alert">{orgRes.messages.join(', ')}</div>;
    }
  } catch (error: any) {
    return <div role="alert">{error.message}</div>;
  }
}
