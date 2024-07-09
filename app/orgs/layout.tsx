import React from 'react';

export default function OrgsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="padding-4">{children}</main>;
}
