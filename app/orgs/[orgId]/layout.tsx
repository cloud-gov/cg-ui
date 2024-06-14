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
  const { payload, success } = await getOrg(params.orgId);

  return (
    <>
      <LayoutHeader>
        {success ? payload.name : 'Org name not found'}
      </LayoutHeader>
      <main className="padding-4 overflow-y-auto">{children}</main>
    </>
  );
}
