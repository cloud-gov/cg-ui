import Link from "next/link";

export function OrgPickerList() {
  return (
    <ul
      className="orgs-selector__list usa-list usa-list--unstyled maxh-card overflow-x-hidden overflow-y-scroll border-bottom border-top border-base-light"
      tabIndex={0}
      aria-label="Organizations list"
    >
      <li className="padding-y-05">
        <Link href="/" className="text-primary text-ellipsis">
          another-organization-name-goes-here
        </Link>
      </li>
      <li className="padding-y-05">
        <Link href="/" className="text-primary text-ellipsis">
          significantly-shorter-name
        </Link>
      </li>
      <li className="padding-y-05">
        <Link href="/" className="text-primary text-ellipsis">
          another-organization-name-goes-here
        </Link>
      </li>
      <li className="padding-y-05">
        <Link href="/" className="text-primary text-ellipsis">
          what-happens-when-an-organization-name-is-really-long
        </Link>
      </li>
      <li className="padding-y-05">
        <Link href="/" className="text-primary text-ellipsis">
          significantly-shorter-name
        </Link>
      </li>
      <li className="padding-y-05">
        <Link href="/" className="text-primary text-ellipsis">
          another-shorter-name
        </Link>
      </li>
      <li className="padding-y-05">
        <Link href="/" className="text-primary text-ellipsis">
          hey-that-is-a-really-long-name-for-an-organization
        </Link>
      </li>
    </ul>
  )
}