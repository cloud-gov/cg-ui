import React from 'react';
import Link from 'next/link';

export function OrgPickerFooter() {
  return (
    <footer className="text-right text-bold font-sans-2xs text-primary padding-y-105">
      <Link href="/orgs" className="text-primary">
        View all organizations
      </Link>
      <span className="padding-left-05" aria-hidden="true">
        &raquo;
      </span>
    </footer>
  );
}
