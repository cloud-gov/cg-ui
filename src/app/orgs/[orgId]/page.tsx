import Image from 'next/image';
import Link from 'next/link';
import { getOrgLandingpage } from '@/controllers/controllers';
import { CardRow } from '@/components/Card/CardRow';
import { Card } from '@/components/Card/Card';
import { RoleObj } from '@/api/cf/cloudfoundry-types';
import peopleIcon from '@/../public/img/uswds/usa-icons/people.svg';
import assessmentIcon from '@/../public/img/uswds/usa-icons/assessment.svg';

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
  const showManageBilling = currentUserRoles.find(
    (role: RoleObj) => role.type === 'organization_billing_manager'
  );

  return (
    <div className="margin-bottom-5">
      <h1>Welcome to the Dashboard. Let’s get started.</h1>
      <CardRow>
        {showManageUsers && (
          <Card className="display-flex flex-column flex-justify">
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
              <p>
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
        {showManageBilling && (
          <Card className="display-flex flex-column flex-justify">
            <div>
              <h2 className="margin-top-0">
                <Image
                  unoptimized
                  src={assessmentIcon}
                  alt=""
                  className="margin-right-1"
                />
                Billing
              </h2>
              <p>
                View previous invoices, access cost estimates, and view usage
                quotas for an organization.
              </p>
            </div>
            <div>
              {/* TODO: what link should we use here? */}
              <Link href={'/'} className="usa-button">
                Access billing
              </Link>
            </div>
          </Card>
        )}
        <li className="tablet:grid-col-6 tablet-lg:grid-col-4 margin-bottom-3">
          <h2 className="margin-top-0 text-light">
            Here’s the latest from <strong>the Cloud.gov blog</strong>:
          </h2>
        </li>
      </CardRow>
    </div>
  );
}
