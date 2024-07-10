import Link from 'next/link';
import { getOrgs } from '@/controllers/prototype-controller';

export default async function CloudFoundryOrgsPage() {
  try {
    const res = await getOrgs();
    if (res.payload) {
      const orgs = res.payload.resources;
      return (
        <>
          <h1>Your CF Organizations</h1>
          <Link href="/prototype/cloudfoundry">Back to Cloud Foundry home</Link>
          <ul>
            {orgs.map((org: any) => (
              <li key={org.guid}>
                <Link href={`/prototype/cloudfoundry/orgs/${org.guid}`}>
                  {org.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      );
    } else {
      return <div role="alert">{res.message}</div>;
    }
  } catch (error: any) {
    return <div role="alert">{error.message}</div>;
  }
}
