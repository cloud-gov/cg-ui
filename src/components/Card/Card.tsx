import React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <li className="tablet:grid-col-6 tablet-lg:grid-col-4 margin-bottom-3">
      <div className="bg-white border border-gray-cool-20 radius-md padding-2 tablet-lg:padding-3">
        {children}
      </div>
    </li>
  );
}
