import React from 'react';
import { getUser } from '@/controllers/controllers';
import Link from 'next/link';

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
  const { payload, success } = await getUser(params.userId);

  return (
    <>
      <div className="desktop:display-flex border-bottom border-accent-warm-light padding-bottom-105">
        <Link href="/todo" className="usa-link">
          Manage users
        </Link>{' '}
        &nbsp; &gt; Spaces and roles
      </div>
      <h3 className="font-heading-lg text-normal">
        {success ? payload.username : 'User name not found'}
      </h3>
      {children}
    </>
  );
}
