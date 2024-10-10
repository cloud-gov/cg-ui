'use server';
/***/
// Library for translating UI actions to API requests and back
/***/
import { revalidatePath } from 'next/cache';
import * as CF from '@/api/cf/cloudfoundry';
import {
  OrgObj,
  ServiceCredentialBindingObj,
  ServiceInstanceObj,
  SpaceObj,
  UserObj,
} from '@/api/cf/cloudfoundry-types';
import { ControllerResult, UserOrgPage } from './controller-types';
import {
  associateUsersWithRoles,
  defaultSpaceRoles,
  filterUserLogonInfo,
  likelyNonHumanUser,
  logDevError,
  pollForJobCompletion,
  resourceKeyedById,
  apiErrorMessage,
  countUsersPerOrg,
  allocatedMemoryPerOrg,
  memoryUsagePerOrg,
  countSpacesPerOrg,
  countAppsPerOrg,
  getOrgRolesForCurrentUser,
} from './controller-helpers';
import { sortObjectsByParam } from '@/helpers/arrays';
import { daysToExpiration } from '@/helpers/dates';
import { getUserLogonInfo } from '@/api/aws/s3';

/* ------------------- */
//        READ         //
/* ------------------- */

export async function getEditOrgRoles(
  orgGuid: string,
  userGuid: string
): Promise<ControllerResult> {
  const response = await CF.getRoles({
    userGuids: [userGuid],
    organizationGuids: [orgGuid],
  });
  if (!response.ok) {
    logDevError(
      `api error on cf edit org page with http code ${response.status} for url: ${response.url}`
    );
    throw new Error(apiErrorMessage(response.status));
  }
  return {
    meta: { status: 'success' },
    payload: await response.json(),
  };
}

export async function getOrg(guid: string): Promise<ControllerResult> {
  const res = await CF.getOrg(guid);
  if (!res.ok) {
    logDevError(
      `api error on cf org with http code ${res.status} for url: ${res.url}`
    );
    return {
      payload: {},
      meta: { status: 'error' },
    };
  }
  return {
    payload: await res.json(),
    meta: { status: 'success' },
  };
}

export async function getOrgsPage(): Promise<ControllerResult> {
  try {
    const res = await CF.getOrgs();
    if (!res.ok) {
      logDevError(
        `api error on cf orgs with http code ${res.status} for url: ${res.url}`
      );
      throw new Error(
        'There was a problem with the request. Please try again, and if the issue persists, please contact Cloud.gov support.'
      );
    }
    const orgs = (await res.json()).resources;
    const orgGuids = orgs.map((org: OrgObj) => org.guid);
    const userCounts = await countUsersPerOrg(orgGuids);
    const memoryAllocated = await allocatedMemoryPerOrg(orgGuids);
    const memoryCurrentUsage = await memoryUsagePerOrg(orgGuids);
    const spaceCounts = await countSpacesPerOrg(orgGuids);
    const appCounts = await countAppsPerOrg(orgGuids);
    const roles = await getOrgRolesForCurrentUser(orgGuids);

    return {
      payload: {
        orgs: orgs,
        userCounts: userCounts,
        appCounts: appCounts,
        memoryAllocated: memoryAllocated,
        memoryCurrentUsage: memoryCurrentUsage,
        spaceCounts: spaceCounts,
        roles: roles,
        lastUpdated: Date.now(),
      },
      meta: { status: 'success' },
    };
  } catch (e: any) {
    throw new Error(
      'There was a problem with the request. Please try again, and if the issue persists, please contact Cloud.gov support.'
    );
  }
}

export async function getOrgPage(orgGuid: string): Promise<ControllerResult> {
  const [orgUserRolesRes, spacesRes, userLogonInfoRes] = await Promise.all([
    // use this request to roles to also obtain the organization details and list the org users
    CF.getRoles({
      organizationGuids: [orgGuid],
      include: ['organization', 'user'],
    }),
    CF.getSpaces({ organizationGuids: [orgGuid] }),
    getUserLogonInfo(),
  ]);
  [orgUserRolesRes, spacesRes].map((res) => {
    if (!res.ok) {
      logDevError(
        `api error on cf org page with http code ${res.status} for url: ${res.url}`
      );
      throw new Error(apiErrorMessage(res.status));
    }
  });

  const orgUserRolesPayload = await orgUserRolesRes.json();
  let users = orgUserRolesPayload.included.users;
  const userGuids = [] as Array<string>;
  const suspectedNonHumans = [] as Array<string>;
  users.forEach(function (user: UserObj) {
    userGuids.push(user.guid);
    if (likelyNonHumanUser(user)) {
      suspectedNonHumans.push(user.username);
    }
  });

  // only pass info about users available to this org to the UI
  const userLogonInfo = userLogonInfoRes
    ? filterUserLogonInfo(userLogonInfoRes.user_summary, userGuids)
    : undefined;

  const spaces = (await spacesRes.json()).resources;
  const spacesBySpaceId = resourceKeyedById(spaces);
  const spaceGuids = spaces.map(function (space: SpaceObj) {
    return space.guid;
  });

  const additionalQueries = [CF.getRoles({ spaceGuids: spaceGuids })];
  // attempt to find service credential bindings for any users suspected of being non-human
  if (suspectedNonHumans.length > 0) {
    additionalQueries.push(
      CF.getServiceCredentialBindings({ guids: suspectedNonHumans })
    );
  }
  const [spaceRolesRes, svcCredsRes] = await Promise.all(additionalQueries);
  [spaceRolesRes, svcCredsRes].map((res) => {
    if (res && !res.ok) {
      logDevError(
        `api error on cf org page with http code ${res.status} for url: ${res.url}`
      );
      throw new Error(apiErrorMessage(res.status));
    }
  });

  const spaceRoles = (await spaceRolesRes.json()).resources;
  const rolesByUser = associateUsersWithRoles(
    orgUserRolesPayload.resources.concat(spaceRoles)
  );

  // if there are any service credential bindings returned, format them for easier lookup
  let svcAccounts = {};
  if (svcCredsRes) {
    const svcCreds = (await svcCredsRes.json()).resources;
    svcAccounts = resourceKeyedById(svcCreds);
  }

  // collect rollup numbers for table sorting
  users = users.map((user: UserObj) => ({
    ...user,
    orgRolesCount: rolesByUser[user.guid]?.org?.length || 0,
    spaceRolesCount: Object.keys(rolesByUser[user.guid]?.space)?.length || 0,
    daysToExpiration:
      userLogonInfo && userLogonInfo[user.guid]
        ? daysToExpiration(userLogonInfo[user.guid].lastLogonTime || 0)
        : null,
    lastLogonTime: userLogonInfo
      ? userLogonInfo[user.guid]?.lastLogonTime
      : undefined,
  })) as UserOrgPage;

  return {
    meta: { status: 'success' },
    payload: {
      org: orgUserRolesPayload.included.organizations[0],
      roles: rolesByUser,
      serviceAccounts: svcAccounts,
      spaces: spacesBySpaceId,
      users: users,
      userLogonInfo: userLogonInfo,
    },
  };
}

export async function getOrgAppsPage(
  orgGuid: string
): Promise<ControllerResult> {
  const appsRes = await CF.getApps({
    organizationGuids: [orgGuid],
    include: ['space'],
  });
  if (!appsRes.ok) {
    logDevError(`unable to retrieve org apps information: ${appsRes.status}`);
    throw new Error(apiErrorMessage(appsRes.status));
  }
  const appsJson = await appsRes.json();
  const spaces = resourceKeyedById(appsJson.included.spaces);

  return {
    meta: { status: 'success' },
    payload: {
      apps: appsJson.resources,
      spaces: spaces,
    },
  };
}

export async function getOrgUsagePage(
  orgGuid: string
): Promise<ControllerResult> {
  const [orgQuotasRes, orgUsageRes, svcInstancesRes] = await Promise.all([
    CF.getOrgQuotas({ organizationGuids: [orgGuid] }),
    CF.getOrgUsageSummary(orgGuid),
    CF.getServiceInstances({ organizationGuids: [orgGuid] }),
  ]);
  [orgQuotasRes, orgUsageRes, svcInstancesRes].map((res) => {
    if (!res.ok) {
      logDevError(
        `api error on cf org usage page with http code ${res.status} for url: ${res.url}`
      );
      throw new Error(apiErrorMessage(res.status));
    }
  });

  const quotas = await orgQuotasRes.json();
  const svcInstances = await svcInstancesRes.json();
  const svcPlanGuids = svcInstances.resources.map(function (
    instance: ServiceInstanceObj
  ) {
    // Note: some instances do not appear to have associated plans
    if (instance.relationships.service_plan) {
      return instance.relationships.service_plan.data.guid;
    }
  });

  const svcPlansRes = await CF.getServicePlans({ guids: svcPlanGuids });
  if (!svcPlansRes.ok) {
    logDevError(
      `api error on cf org usage page with http code ${svcPlansRes.status} for url: ${svcPlansRes.url}`
    );
    throw new Error(
      apiErrorMessage(svcPlansRes.status, 'could not retrieve service plans')
    );
  }
  const svcPlans = await svcPlansRes.json();
  const svcPlansById = resourceKeyedById(svcPlans.resources);
  return {
    meta: { status: 'success' },
    payload: {
      // there must be exactly one quota per organization
      quota: quotas.resources[0],
      usage: await orgUsageRes.json(),
      services: {
        instances: svcInstances.resources,
        plans: svcPlansById,
      },
    },
  };
}

export async function getUser(userGuid: string): Promise<ControllerResult> {
  const userRes = await CF.getUser(userGuid);
  if (!userRes.ok) {
    logDevError(`unable to retrieve user information: ${userRes.status}`);
    throw new Error(apiErrorMessage(userRes.status));
  }

  const userObj = (await userRes.json()) as UserObj;
  let svcCred = undefined as ServiceCredentialBindingObj | undefined;

  if (likelyNonHumanUser(userObj)) {
    const svcCredRes = await CF.getServiceCredentialBindings({
      guids: [userObj.username],
    });
    if (!svcCredRes.ok) {
      logDevError(
        `unable to retrieve service credential information: ${svcCredRes.status}`
      );
      // don't throw an error, because we can still display some information about the user
      // even if user isn't actually a service account or something happened to go wrong with the req
    } else {
      // should only be one service cred result
      svcCred = (await svcCredRes.json()).resources[0];
    }
  }
  return {
    payload: {
      user: userObj,
      serviceAccount: svcCred,
    },
    meta: {
      status: 'success',
    },
  };
}

export async function getOrgUserSpacesPage(
  orgGuid: string,
  userGuid: string
): Promise<ControllerResult> {
  const spacesRes = await CF.getSpaces({ organizationGuids: [orgGuid] });
  if (!spacesRes.ok) {
    logDevError(
      `api error on cf org page with http code ${spacesRes.status} for url: ${spacesRes.url}`
    );
    throw new Error(apiErrorMessage(spacesRes.status));
  }
  const spacesPayload = (await spacesRes.json()).resources;
  const spaceGuids = spacesPayload.map(function (space: SpaceObj) {
    return space.guid;
  });

  const userRolesRes = await CF.getRoles({
    spaceGuids: spaceGuids,
    userGuids: [userGuid],
  });

  if (!userRolesRes.ok) {
    logDevError(
      `api error on cf org page with http code ${userRolesRes.status} for url: ${userRolesRes.url}`
    );
    throw new Error(apiErrorMessage(userRolesRes.status));
  }

  const userRolesPayload = await userRolesRes.json();
  const userRolesBySpaceId = userRolesPayload.resources.reduce(
    (acc: any, role: any) => {
      const key = role.relationships.space.data.guid;
      if (key in acc) {
        acc[key][role.type] = {
          ...defaultSpaceRoles[role.type],
          guid: role.guid,
          selected: true,
        };
      } else {
        acc[key] = JSON.parse(JSON.stringify(defaultSpaceRoles));
        acc[key][role.type] = {
          ...defaultSpaceRoles[role.type],
          guid: role.guid,
          selected: true,
        };
      }
      return acc;
    },
    {}
  );

  return {
    meta: { status: 'success' },
    payload: {
      roles: userRolesBySpaceId,
      spaces: sortObjectsByParam(spacesPayload, 'name'),
    },
  };
}

/* ------------------- */
//       DELETE        //
/* ------------------- */

export async function removeUserFromOrg(
  allSpaceRoleGuids: string[],
  allOrgRoleGuids: string[]
): Promise<ControllerResult> {
  try {
    const spaceRolesResponses = await Promise.all(
      allSpaceRoleGuids.map((guid) => CF.deleteRole(guid))
    );
    const jobLocations = spaceRolesResponses.map((response) => {
      if (!response.ok) {
        throw new Error(
          'Unable to remove user from space role. Please try again'
        );
      }
      return response.headers.get('Location');
    });
    await Promise.all(jobLocations.map((loc) => pollForJobCompletion(loc)));
    const orgRoleResponses = await Promise.all(
      allOrgRoleGuids.map((guid) => CF.deleteRole(guid))
    );
    orgRoleResponses.map((response) => {
      if (!response.ok) {
        throw new Error(
          apiErrorMessage(
            response.status,
            'Unable to remove user from org role. Please try again'
          )
        );
      }
    });
    // Bust the Nextjs cache for getting the org users:
    // https://nextjs.org/docs/app/api-reference/functions/revalidatePath
    if (process.env.NODE_ENV !== 'test') {
      revalidatePath('/roles');
    }
    return {
      meta: {
        status: 'success',
      },
      payload: {},
    };
  } catch (e: any) {
    logDevError(`error in removeUserFromOrg: ${e.message}`);
    return {
      meta: {
        status: 'error',
        errors: [e.message],
      },
      payload: {},
    };
  }
}
