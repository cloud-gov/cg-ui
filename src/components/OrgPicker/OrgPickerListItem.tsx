import Link from 'next/link';

export function OrgPickerListItem({
  href,
  name,
}: {
  href: string;
  name: string;
}) {
  return (
    <li className="padding-y-05">
      <Link href={href} className="text-primary text-ellipsis">
        {name}
      </Link>
    </li>
  );
}
