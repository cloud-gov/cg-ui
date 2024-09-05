import React from 'react';
import Link from 'next/link';

export function OrgPickerListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="padding-y-05">
      <Link href="/" className="text-primary text-ellipsis">
        {children}
      </Link>
    </li>
  );
}
