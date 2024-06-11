import React from 'react';
import { LayoutHeader } from '@/components/LayoutHeader';
import { getOrg } from '@/controllers/controllers';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  const { payload } = await getOrg(params.orgId);
  const orgName = payload.name;

  return (
    <>
      <LayoutHeader>{orgName}</LayoutHeader>
      <main className="padding-4 overflow-y-auto">{children}</main>
    </>
  );
}
