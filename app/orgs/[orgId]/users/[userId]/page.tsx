import { getOrgUserSpacesPage } from '@/controllers/controllers';
import { GridList } from '@/components/GridList/GridList';
import { UsersActionsSpaceRoles } from '@/components/UsersActions/UsersActionsSpaceRoles';

export default async function OrgUserSpaceRolesPage({
  params,
}: {
  params: { orgId: string; userId: string };
}) {
  const res = await getOrgUserSpacesPage(params.orgId, params.userId);
  const { spaces, roles } = res.payload;

  return (
    <>
      <h2>Space roles</h2>
      <p>
        Optional. By assigning additional roles, you can grant access to space
        level information and features.
      </p>
      <GridList>
        {spaces.map((space: any) => (
          <UsersActionsSpaceRoles
            key={space.guid}
            space={space}
            currentRoles={roles[space.guid]}
            onCancelPath={`/orgs/${params.orgId}/users/${params.userId}`}
          />
        ))}
      </GridList>
    </>
  );
}
