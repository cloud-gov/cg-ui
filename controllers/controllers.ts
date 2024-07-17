'use server';
/***/
// Library for translating UI actions to API requests and back
/***/
import { revalidatePath } from 'next/cache';
import * as CF from '@/api/cf/cloudfoundry';
import { SpaceObj, UserObj } from '@/api/cf/cloudfoundry-types';
import { ControllerResult } from './controller-types';
import {
  associateUsersWithRoles,
  defaultSpaceRoles,
  filterUserLogonInfo,
  logDevError,
  pollForJobCompletion,
  resourceKeyedById,
} from './controller-helpers';
import { sortObjectsByParam } from '@/helpers/arrays';
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
    throw new Error(
      'Something went wrong with loading the form. Please try again later.'
    );
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
  const res = await CF.getOrgs();
  if (!res.ok) {
    logDevError(
      `api error on cf orgs with http code ${res.status} for url: ${res.url}`
    );
    return {
      payload: {
        orgs: [],
      },
      meta: { status: 'error' },
    };
  }
  return {
    payload: {
      orgs: (await res.json()).resources,
    },
    meta: { status: 'success' },
  };
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
      throw new Error('something went wrong with the request');
    }
  });

  const orgUserRolesPayload = await orgUserRolesRes.json();
  const users = orgUserRolesPayload.included.users;
  const userGuids = users.map(function (user: UserObj) {
    return user.guid;
  });

  const userLogonInfo = userLogonInfoRes
    ? filterUserLogonInfo(userLogonInfoRes.user_summary, userGuids)
    : undefined;

  const spaces = (await spacesRes.json()).resources;
  const spacesBySpaceId = resourceKeyedById(spaces);
  const spaceGuids = spaces.map(function (space: SpaceObj) {
    return space.guid;
  });

  const spaceRolesRes = await CF.getRoles({ spaceGuids: spaceGuids });
  if (!spaceRolesRes.ok) {
    logDevError(
      `api error on cf org page with http code ${spaceRolesRes.status} for url: ${spaceRolesRes.url}`
    );
    throw new Error('something went wrong with the request');
  }

  const spaceRoles = (await spaceRolesRes.json()).resources;
  const rolesByUser = associateUsersWithRoles(
    orgUserRolesPayload.resources.concat(spaceRoles)
  );

  return {
    meta: { status: 'success' },
    payload: {
      org: orgUserRolesPayload.included.organizations[0],
      roles: rolesByUser,
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
    throw new Error('something went wrong with the request');
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
      throw new Error('something went wrong with the request');
    }
  });

  const quotas = await orgQuotasRes.json();
  const svcInstances = await svcInstancesRes.json();
  const svcPlanGuids = svcInstances.resources.map(function (instance: any) {
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
    throw new Error('could not retrieve service plans');
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
  const res = await CF.getUser(userGuid);
  if (!res.ok) {
    logDevError(`unable to retrieve user information: ${res.status}`);
    return {
      payload: null,
      meta: {
        status: 'error',
      },
    };
  }
  return {
    payload: await res.json(),
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
    throw new Error('something went wrong with the request');
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
    throw new Error('something went wrong with the request');
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
          'Unable to remove user from org role. Please try again'
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
