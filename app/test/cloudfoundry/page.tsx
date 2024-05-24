import Link from 'next/link';

export default function CloudFoundryPage() {
  return (
    <>
      <h1>Cloud Foundry Functions</h1>
      <ul>
        <li>
          <Link href="/test/cloudfoundry/apps">apps list</Link>
        </li>
        <li>
          <Link href="/test/cloudfoundry/orgs">organizations list</Link>
        </li>
      </ul>
    </>
  );
}
