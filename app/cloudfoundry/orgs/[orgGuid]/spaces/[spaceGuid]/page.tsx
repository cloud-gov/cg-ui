'use server';

import Link from 'next/link';
import { getSpace } from '@controllers/controllers';

export default async function SpacePage({
  params,
}: {
  params: {
    orgGuid: string;
    spaceGuid: string;
  };
}) {
  try {
    const spaceRes = await getSpace(params.spaceGuid);

    if (spaceRes.payload) {
      const space = spaceRes.payload;
      return (
        <>
          <div className="grid-container">
            <Link href="../">Back to organization</Link>
            <h1>{space.name}</h1>
            <ul>
              <li>Name: {space.name}</li>
              <li>Created: {space.created_at}</li>
              <li>Quota: {space.relationships.quota.data}</li>
            </ul>
          </div>
        </>
      );
    } else {
      return <div role="alert">{spaceRes.message}</div>;
    }
  } catch (error: any) {
    return <div role="alert">{error.message}</div>;
  }
}
