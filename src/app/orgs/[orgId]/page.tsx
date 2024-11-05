import Image from '@/components/Image';
import Link from 'next/link';
import { getOrgLandingpage } from '@/controllers/controllers';
import { CardRow } from '@/components/Card/CardRow';
import { Card } from '@/components/Card/Card';
import { RoleObj } from '@/api/cf/cloudfoundry-types';
import { BlogSnippet } from '@/components/BlogSnippet/BlogSnippet';
import peopleIcon from '@/../public/img/uswds/usa-icons/people.svg';

export default async function OrgLandingPage() {
  const { payload } = await getOrgLandingpage();
  const { currentOrgId, userCounts, currentUserRoles } = payload;
  const usersText = () => {
    const count = userCounts[currentOrgId];
    if (count > 1) {
      return `${count} users`;
    }
    if (count === 1) {
      return '1 user';
    }
    return '0 users';
  };
  const showManageUsers = currentUserRoles.find(
    (role: RoleObj) => role.type === 'organization_manager'
  );

  return (
    <div className="margin-bottom-5">
      <h1 className="margin-bottom-4 font-sans-lg mobile-lg:font-sans-xl">
        Welcome to the Dashboard. Let’s get started.
      </h1>
      <CardRow>
        {showManageUsers && (
          <Card
            className="display-flex flex-column flex-justify"
            containerClassname="tablet-lg:grid-col-8"
          >
            <div>
              <h2 className="margin-top-0">
                <Image
                  unoptimized
                  src={peopleIcon}
                  alt=""
                  className="margin-right-1"
                />
                Users
              </h2>
              <p className="font-sans-md line-height-sans-4">
                View the <strong>{usersText()}</strong> in your organization,
                manage their permissions, and control their access to Spaces.
              </p>
            </div>
            <div>
              <Link href={`/orgs/${currentOrgId}/users`} className="usa-button">
                Manage users
              </Link>
            </div>
          </Card>
        )}
        <li className="tablet:grid-col-6 tablet-lg:grid-col-4 margin-bottom-3">
          <BlogSnippet />
        </li>
      </CardRow>
    </div>
  );
}
