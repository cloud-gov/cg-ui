import { getOrgUserSpacesPage } from '@/controllers/controllers';
import { GridList } from '@/components/GridList/GridList';
import { UsersActionsSpaceRoles } from '@/components/UsersActions/UsersActionsSpaceRoles';
import { Button } from '@/components/uswds/Button';

export default async function OrgUserSpaceRolesPage({
  params,
}: {
  params: { orgId: string; userId: string };
}) {
  const res = await getOrgUserSpacesPage(params.orgId, params.userId);
  const { spaces, roles } = res.payload;

  return (
    <form>
      <div className="tablet:display-flex flex-row flex-justify margin-bottom-3">
        <div className="flex-4 maxw-mobile-lg">
          <h2>Space roles</h2>
          <p className="margin-bottom-0">
            Optional. By assigning additional roles, you can grant access to
            space level information and features.
          </p>
        </div>
        <div className="align-self-end margin-top-2 tablet:margin-top-auto">
          <Button type="submit" disabled={true}>
            Save changes
          </Button>
        </div>
      </div>
      <GridList>
        {spaces.map((space: any) => (
          <fieldset key={space.guid} className="usa-fieldset">
            <legend className="usa-legend usa-sr-only">
              <strong>Select roles for space: {space.name}</strong>
            </legend>
            <UsersActionsSpaceRoles
              space={space}
              currentRoles={roles[space.guid]}
              onCancelPath={`/orgs/${params.orgId}/users/${params.userId}`}
            />
          </fieldset>
        ))}
      </GridList>
    </form>
  );
}
