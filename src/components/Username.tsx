'use client';

import {
  ServiceCredentialBindingObj,
  UserObj,
} from '@/api/cf/cloudfoundry-types';

export function Username({
  user,
  serviceAccount,
}: {
  user: UserObj;
  serviceAccount?: ServiceCredentialBindingObj | undefined;
}) {
  if (serviceAccount) {
    return <>{serviceAccount.name} [service account]</>;
  } else {
    return <>{user.username ? user.username : 'Unnamed user'}</>;
  }
}
