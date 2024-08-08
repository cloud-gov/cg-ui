import React from 'react';

export function PageHeader({
  heading,
  intro,
  children,
}: {
  heading: string | React.ReactNode;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="usa-prose margin-bottom-3">
      <h1>{heading}</h1>
      {intro && <p className="usa-prose-intro">{intro}</p>}
      {children}
    </div>
  );
}
