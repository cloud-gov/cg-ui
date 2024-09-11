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
      <h4
        className="margin-top-0 margin-bottom-7 text-uppercase text-light underline-base-light text-underline"
        style={{ textUnderlineOffset: '0.7em' }}
      >
        {header}
      </h4>
      {serviceAccount && (
        <Tag
          className={'bg-primary font-sans-3xs text-white text-light text-ls-3'}
          label="service"
        />
      )}
      <h2 className="margin-top-1 margin-bottom-5">
        <Username username={username} />
      </h2>
    </>
  );
}
