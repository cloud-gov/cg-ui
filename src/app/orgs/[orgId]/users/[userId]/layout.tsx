import React from 'react';
import { getUser } from '@/controllers/controllers';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Username } from '@/components/UserAccount/Username';

export default async function SpaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    orgId: string;
    userId: string;
  };
}) {
  const { payload } = await getUser(params.userId);
  const { user, serviceAccount } = payload;
  return (
    <div className="padding-bottom-4">
      <div className="desktop:display-flex border-bottom border-accent-warm-light padding-bottom-105">
        <Link href={`/orgs/${params.orgId}`} className="usa-link">
          Manage users
        </Link>{' '}
        &nbsp; &gt; Roles
      </div>
      <div className="margin-top-3">
        <PageHeader
          heading={<Username user={user} serviceAccount={serviceAccount} />}
        />
      </div>
      {children}
    </div>
  );
}
