'use client';

import { ServiceCredentialBindingObj } from '@/api/cf/cloudfoundry-types';
import { ServiceTag } from '@/components/ServiceTag';

export function Username({
  username,
  serviceAccount,
}: {
  username?: string;
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
    return <>{username ? username : 'Unnamed user'}</>;
  }
}
