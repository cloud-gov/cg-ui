import { OrgActionsAddUser } from '@/components/OrgActions/OrgActionsAddUser';

export default function AddUserPage({
  params,
}: {
  params: {
    orgId: string;
  };
}) {
  return (
    <>
      <div className="maxw-mobile-lg">
        <div className="usa-prose">
          <h4>Add a user</h4>
          <OrgActionsAddUser
            orgId={params.orgId}
            onCancelPath={`/orgs/${params.orgId}/users`}
          />
        </div>
      </div>
    </>
  );
}
