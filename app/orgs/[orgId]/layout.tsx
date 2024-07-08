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
  const { payload, meta } = await getOrg(params.orgId);

  return (
    <>
      <LayoutHeader>
        {meta.status === 'success' ? payload.name : 'Org name not found'}
      </LayoutHeader>
      <main className="padding-4">{children}</main>
    </>
  );
}
