import React from 'react';
import { OrgPicker } from '@/components/OrgPicker/OrgPicker';
import { getOrgs } from '@/api/cf/cloudfoundry';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
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
