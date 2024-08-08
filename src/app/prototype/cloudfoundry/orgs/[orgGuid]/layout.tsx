import React from 'react';

export default function CFOrganizationLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div>this is the cloudfoundry org layout</div>
      {children}
    </section>
  );
}
