import React from 'react';

// render routes for each user at request time
export const dynamic = 'force-dynamic';

export default function OrgsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="minh-viewport">{children}</div>;
}
