import React from 'react';
import { getUser } from '@/controllers/controllers';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Username } from '@/components/UserAccount/Username';

type Params = Promise<{
  orgId: string;
  userId: string;
}>;

export default async function SpaceLayout(props: {
  children: React.ReactNode;
  params: Params;
}) {
  const params = await props.params;
  const children = await props.children;

  const { payload } = await getUser(params.userId);
  const { user, serviceAccount } = payload;
  return (
    <div className="padding-bottom-4">
      <div className="desktop:display-flex border-bottom border-accent-warm-light padding-bottom-105">
        <Link href={`/orgs/${params.orgId}/users`} className="usa-link">
          Manage users
        </Link>{' '}
        &nbsp; &gt; Roles
      </div>
      <div className="margin-top-3">
        <PageHeader
          heading={
            <Username
              username={user.username}
              serviceAccount={serviceAccount}
            />
          }
        />
      </div>
      {children}
    </div>
  );
}
