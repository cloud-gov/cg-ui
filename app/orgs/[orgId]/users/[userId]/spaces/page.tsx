import { getOrgUserSpacesPage } from '@/controllers/controllers';
import { sortObjectsByParam } from '@/helpers/arrays';
import { underscoreToText } from '@/helpers/text';
import Link from 'next/link';

export default async function UserSpacesPage({
  params,
}: {
  params: {
    orgId: string;
    userId: string;
  };
}) {
  const { payload } = await getOrgUserSpacesPage(params.orgId, params.userId);
  const { roles, spaces } = payload;
  const spacesSorted = sortObjectsByParam(spaces, 'name');

  return (
    <>
      <h4 className="border-bottom border-primary-warm padding-bottom-1 margin-bottom-1">
        Spaces and roles ({spaces.length})
      </h4>
      <Link href="/todo" className="usa-link">
        Edit spaces and roles
      </Link>
      <ul className="padding-left-0 margin-top-4">
        {spacesSorted.map(
          (space: any) =>
            roles[space.guid] && (
              <li
                key={space.guid}
                id={space.guid}
                className="usa-list--unstyled margin-bottom-3"
              >
                <strong>{space.name}</strong>
                <span className="display-block margin-top-1 text-capitalize">
                  {underscoreToText(roles[space.guid].type)}
                </span>
              </li>
            )
        )}
      </ul>
    </>
  );
}
