import { ServiceCredentialBindingObj } from '@/api/cf/cloudfoundry-types';
import { Username } from '@/components/UserAccount/Username';
import { Tag } from '@/components/uswds/Tag';

export function OverlayHeaderUsername({
  header,
  serviceAccount,
  username,
}: {
  header: string;
  serviceAccount?: ServiceCredentialBindingObj | undefined | null;
  username: string;
}) {
  return (
    <>
      <h2 className="margin-top-0 margin-bottom-7 text-uppercase text-light underline-base-light text-underline text-underline-offset font-sans-xs">
        {header}
      </h2>
      {serviceAccount && (
        <Tag
          className={'bg-primary font-sans-3xs text-white text-light text-ls-3'}
          label="service"
        />
      )}
      <h3 className="margin-top-1 margin-bottom-5 font-sans-md mobile-lg:font-sans-lg">
        <Username username={username} />
      </h3>
    </>
  );
}
