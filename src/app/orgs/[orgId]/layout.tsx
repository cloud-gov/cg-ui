import React from 'react';
import { OrgPicker } from '@/components/OrgPicker/OrgPicker';
import { getOrgs } from '@/api/cf/cloudfoundry';

type Params = Promise<{ orgId: string }>;

export default async function OrgLayout(props: {
  children: React.ReactNode;
  params: Params;
}) {
  const params = await props.params;
  const children = await props.children;

  const orgsRes = await getOrgs();
  const orgResJson = await orgsRes.json();
  const orgs = orgResJson.resources;

  return (
    <>
      <div className="display-flex flex-column flex-align-end width-full desktop:height-10 margin-top-3">
        <OrgPicker orgs={orgs} currentOrgId={params.orgId} />
      </div>
      {children}
    </>
  );
}
