'use server';
/***/
// Library for translating UI actions to API requests and back
/***/
import { revalidatePath } from 'next/cache';
import * as CF from '@/api/cf/cloudfoundry';
import { GetRoleArgs, SpaceObj, UserObj } from '@/api/cf/cloudfoundry-types';
import {
  ControllerResult,
} from './controller-types';
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
  const args: GetRoleArgs = {
    userGuids: [userGuid],
    orgGuids: [orgGuid],
  };
  const response = await CF.getRoles(args);
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

export async function getOrgPage(orgGuid: string): Promise<ControllerResult> {
  const [orgUserRolesRes, spacesRes, userLogonInfoRes] = await Promise.all([
    // use this request to roles to also obtain the organization details and list the org users
    CF.getRoles({ orgGuids: [orgGuid], include: ['organization', 'user'] }),
    CF.getSpaces([orgGuid]),
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
  const spacesRes = await CF.getSpaces([orgGuid]);
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
