import {
  ServiceInstanceObj,
  ServicePlanObj,
} from '@/api/cf/cloudfoundry-types';
import { PageHeader } from '@/components/PageHeader';
import { getOrgUsagePage } from '@/controllers/controllers';
import { formatDate } from '@/helpers/dates';

interface ServicePlanLookup {
  [index: string]: ServicePlanObj;
}

function formatCost(plan: ServicePlanObj): string {
  const firstCost = plan.costs[0];
  if (plan.free === true) {
    return 'Free';
  } else if (firstCost) {
    const currency = firstCost.currency === 'USD' ? '$' : firstCost.currency;
    return `${currency}${firstCost.amount} ${firstCost.unit.toLowerCase()}`;
  } else {
    return 'No pricing available';
  }
}

function formatLimits(limit: string | null) {
  if (limit === null) {
    return 'None';
  }
  return limit;
}

function Service({
  service,
  plans,
}: {
  service: ServiceInstanceObj;
  plans: ServicePlanLookup;
}) {
  if (service.relationships.service_plan) {
    const plan = plans[service.relationships.service_plan.data.guid];
    return (
      <>
        <h3>
          {service.name} ({plan.name})
        </h3>
        {service.upgrade_available && <dd>Upgrade available!</dd>}
        <ul>
          <li>{plan.description}</li>
          <li>Created: {formatDate(service.created_at)}</li>
          <li>Cost: {formatCost(plan)}</li>
        </ul>
      </>
    );
  } else {
    return (
      <>
        <h3>{service.name} (no associated service plan)</h3>
        {service.upgrade_available && <dd>Upgrade available!</dd>}
        <ul>
          <li>Created: {formatDate(service.created_at)}</li>
        </ul>
      </>
    );
  }
}

export default async function OrgUsagePage({
  params,
}: {
  params: { orgId: string };
}) {
  const { payload } = await getOrgUsagePage(params.orgId);
  const quota = payload.quota;
  const usage = payload.usage.usage_summary;
  const svcInstances = payload.services.instances as Array<ServiceInstanceObj>;
  const svcPlans = payload.services.plans as ServicePlanLookup;

  return (
    <>
      <PageHeader
        heading="View organization usage"
        intro="View a summary of your organization's resource usage and limits"
      />

      <h2>Organization usage overview</h2>

      <dl>
        <dt>Application instances</dt>
        <dd>Current: {usage.started_instances} active instances</dd>
        <dd>Limit: {formatLimits(quota.apps.total_instances)}</dd>

        <dt>Total memory</dt>
        <dd>Current: {usage.memory_in_mb} mb</dd>
        <dd>Limit: {quota.apps.total_memory_in_mb} mb</dd>

        <dt>Routes</dt>
        <dd>Current: {usage.routes}</dd>
        <dd>Limit: {formatLimits(quota.routes.total_routes)}</dd>

        <dt>Reserved ports</dt>
        <dd>Current: {usage.reserved_ports}</dd>
        <dd>Limit: {formatLimits(quota.routes.total_reserved_ports)}</dd>

        <dt>Service instances</dt>
        <dd>Current: {usage.service_instances}</dd>
        <dd>Limit: {formatLimits(quota.services.total_service_instances)}</dd>

        <dt>Domains</dt>
        <dd>Current: {usage.domains}</dd>
        <dd>Limit: {formatLimits(quota.domains.total_domains)}</dd>

        <dt>Per app tasks</dt>
        <dd>Current: {usage.per_app_tasks}</dd>
        <dd>Limit: {formatLimits(quota.apps.per_app_tasks)}</dd>

        <dt>Service keys</dt>
        <dd>Current: {usage.service_keys}</dd>
        <dd>Limit: {formatLimits(quota.services.total_service_keys)}</dd>
      </dl>

      {/* See https://v3-apidocs.cloudfoundry.org/version/3.169.0/index.html#organization-quotas
      for more information about quota limits that we may want to reveal to users of an organization */}

      <h2>Services overview</h2>
      {svcInstances.map((svc: ServiceInstanceObj) => {
        return (
          <>
            <Service service={svc} plans={svcPlans} key={svc.guid} />
          </>
        );
      })}
    </>
  );
}
