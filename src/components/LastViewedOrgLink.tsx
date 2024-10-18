import Link from 'next/link';
import { cookies } from 'next/headers';
import { getOrg } from '@/api/cf/cloudfoundry';

export async function LastViewedOrgLink() {
  const cookieStore = cookies();
  const orgId = cookieStore.get('lastViewedOrgId')?.value;
  if (!orgId) {
    return null;
  }
  const orgRes = await getOrg(orgId);
  if (!orgRes.ok) {
    return null;
  }
  const org = await orgRes.json();

  return (
    <>
      (Need to jump back in? The organization you last accessed was{' '}
      <Link className="usa-link text-bold" href={`/orgs/${orgId}`}>
        {org.name}
      </Link>
      .)
    </>
  );
}
