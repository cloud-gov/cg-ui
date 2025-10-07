import { OrgActionsAddUser } from '@/components/OrgActions/OrgActionsAddUser';

type Params = Promise<{ orgId: string }>;

export default async function AddUserPage(props: { params: Params }) {
  const params = await props.params;
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
