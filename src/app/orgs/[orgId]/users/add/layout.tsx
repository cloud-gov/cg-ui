import React from 'react';
import Link from 'next/link';

export default function AddUserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    orgId: string;
  };
}) {
  return (
    <>
      <div className="desktop:display-flex border-bottom border-accent-warm-light padding-bottom-105 margin-bottom-4">
        <Link href={`/orgs/${params.orgId}`} className="usa-link">
          Manage users
        </Link>{' '}
        &nbsp; &gt; Add a user
      </div>
      {children}
    </>
  );
}
