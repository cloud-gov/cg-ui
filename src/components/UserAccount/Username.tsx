'use client';

import {
  ServiceCredentialBindingObj,
  UserObj,
} from '@/api/cf/cloudfoundry-types';
import { ServiceTag } from '@/components/ServiceTag';

export function Username({
  user,
  serviceAccount,
}: {
  user: UserObj;
  serviceAccount?: ServiceCredentialBindingObj | undefined;
}) {
  if (serviceAccount) {
    return (
      <>
        {serviceAccount.name}{' '}
        <ServiceTag className="margin-left-1 margin-right-0" />
      </>
    );
  } else {
    return <>{user.username ? user.username : 'Unnamed user'}</>;
  }
}
