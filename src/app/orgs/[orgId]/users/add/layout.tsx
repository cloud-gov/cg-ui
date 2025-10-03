import React from 'react';
import Link from 'next/link';

type Params = Promise<{ orgId: string }>;

export default async function AddUserLayout(props: {
  children: React.ReactNode;
  params: Params;
}) {
  const params = await props.params;
  const children = await props.children;
  return (
    <>
      <div className="desktop:display-flex border-bottom border-accent-warm-light padding-bottom-105 margin-bottom-4">
        <Link href={`/orgs/${params.orgId}/users`} className="usa-link">
          Manage users
        </Link>{' '}
        &nbsp; &gt; Add a user
      </div>
      {children}
    </>
  );
}
