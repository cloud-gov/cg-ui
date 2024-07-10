'use server';

import Link from 'next/link';
import {
  getSpace,
  getSpaceUsers,
  Result,
} from '@/controllers/prototype-controller';
import { UserAction } from './form';
import { SpaceMembersList } from '@/components/CloudFoundry/SpaceMembersList';

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
    const users = await getSpaceUsers(params.spaceGuid);

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

            <div className="grid-row">
              <SpaceMembers space={space} users={users} />
            </div>
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

async function SpaceMembers({ space, users }: { space: any; users: Result }) {
  if (users?.payload) {
    return (
      <>
        <div className="grid-col-6">
          <h2>Space members</h2>
          <SpaceMembersList space={space} users={users.payload} />
        </div>
        <div className="grid-col-6">
          <UserAction spaceGuid={space.guid} />
        </div>
      </>
    );
  } else {
    return <div role="alert">{users.message}</div>;
  }
}
