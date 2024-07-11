import React from 'react';

// render routes for each user at request time
export const dynamic = 'force-dynamic';

export default function OrgsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="padding-4">{children}</main>;
}
