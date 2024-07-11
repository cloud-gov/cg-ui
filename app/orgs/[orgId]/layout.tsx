import React from 'react';
import Link from 'next/link';
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
      <main className="padding-4">
        <div className="display-block padding-bottom-2">
          <Link href="/orgs">Back to all organizations</Link>
        </div>
        {children}
      </main>
    </>
  );
}
