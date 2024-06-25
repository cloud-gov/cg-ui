import { getOrgUserSpacesPage } from '@/controllers/controllers';
import { sortObjectsByParam } from '@/helpers/arrays';

export default async function UserSpacesPage({
  params,
}: {
  params: {
    orgId: string;
    userId: string;
  };
}) {
  const { payload } = await getOrgUserSpacesPage(params.orgId, params.userId);
  /* eslint-disable no-unused-vars */
  const { roles, spaces } = payload;
  const spacesSorted = sortObjectsByParam(spaces, 'name');
  /* eslint-enable no-unused-vars */

  return (
    <>
      <h4 className="border-bottom border-primary-warm padding-bottom-1 margin-bottom-1">
        Spaces and roles
      </h4>
      <p>To be implemented</p>
    </>
  );
}
