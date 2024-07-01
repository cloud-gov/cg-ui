import {
  RolesByUser,
  UserWithRoles,
  RoleRanking,
  UAAUser,
} from './controller-types';
import { ListRolesRes, RoleObj, UserObj } from '@/api/cf/cloudfoundry-types';
import { addDays, randomDate } from '@/helpers/dates';
import { cfRequestOptions } from '@/api/cf/cloudfoundry';
import { request } from '@/api/api';
import { delay } from '@/helpers/timeout';

export function resourceKeyedById(resource: Array<any>): Object {
  return resource.reduce((acc, item) => {
    acc[item.guid || item.id] = item;
    return acc;
  }, {});
}

export function associateUsersWithRoles(roles: RoleObj[]): RolesByUser {
  return roles.reduce((userObj, resource: RoleObj) => {
    const relation = resource.relationships;
    const userId = relation.user.data.guid;
    // add a user object if one doesn't exist yet
    if (!userObj[userId]) {
      userObj[userId] = {
        org: [],
        space: {},
        allSpaceRoleGuids: [],
        allOrgRoleGuids: [],
      };
    }
    // if the role is a space role, add to space role lisr
    if (relation.space.data?.guid) {
      const spaceId = relation.space.data.guid;
      if (userObj[userId].space[spaceId]) {
        userObj[userId].space[spaceId].push({
          guid: spaceId,
          role: resource.type,
        });
      } else {
        userObj[userId].space[spaceId] = [];
      }
      // collect all space role guids needed for removing a user from an org
      userObj[userId].allSpaceRoleGuids.push(resource.guid);
    }
    // evaluate org role
    if (relation.organization.data?.guid) {
      const orgObj = {
        guid: relation.organization.data.guid,
        role: resource.type,
      };
      userObj[relation.user.data.guid].org.push(orgObj);
      // collect all org role guids needed for removing a user from an org
      userObj[userId].allOrgRoleGuids.push(resource.guid);
    }
    return userObj;
  }, {} as RolesByUser);
}

const role_ranking: RoleRanking = {
  space_manager: 4,
  space_developer: 3,
  space_auditor: 2,
  space_supporter: 1,
};

export function rankRole(curRole: string, newRole: string): string {
  if (role_ranking[newRole] > role_ranking[curRole]) {
    return newRole;
  }
  return curRole;
}

// TODO delete associateUsersWithRolesTest and
// in favor of associateUsersWithRoles
// once the org / space detail views have been refactored

export function associateUsersWithRolesTest(
  payload: ListRolesRes
): UserWithRoles[] {
  if (!payload.included?.users) {
    return [];
  }

  const users = payload.included.users
    .map(function (userObj) {
      const user = structuredClone(userObj);
      const associatedRoles = payload.resources.filter(function (role) {
        return user.guid == role.relationships.user.data.guid;
      });
      return {
        guid: user.guid,
        username: user.username,
        origin: user.origin,
        roles: associatedRoles.map(function (role) {
          return {
            guid: role.guid,
            type: role.type,
          };
        }),
      };
    })
    .sort(function (a, b) {
      // sort null usernames at the bottom of the list
      return a.username ? a.username.localeCompare(b.username) : 1;
    });
  return users;
}

export function createFakeUaaUser(user: UserObj): UAAUser {
  const cases = [
    // never logged in
    {
      id: user.guid,
      verified: false,
      active: false,
      previousLogonTime: null,
    },
    // logged in previously but expired
    {
      id: user.guid,
      verified: true,
      active: false,
      previousLogonTime: randomDate(
        addDays(new Date(), -180),
        addDays(new Date(), -90)
      ).getTime(),
    },
    // logged in recently
    {
      id: user.guid,
      verified: true,
      active: true,
      previousLogonTime: randomDate(
        addDays(new Date(), -10),
        addDays(new Date(), -1)
      ).getTime(),
    },
    // logged in previously, not expired
    {
      id: user.guid,
      verified: true,
      active: true,
      previousLogonTime: randomDate(
        addDays(new Date(), -89),
        addDays(new Date(), -11)
      ).getTime(),
    },
  ];
  const index = Math.floor(Math.random() * cases.length);
  return cases[index];
}

export async function logDevError(message: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(message);
  }
}

export async function pollForJobCompletion(
  jobLocation: string | null | undefined
): Promise<void> {
  if (!jobLocation) return;
  try {
    const options = await cfRequestOptions('get', null);
    const res = await request(jobLocation, options);
    const body = await res.json();
    if (!res.ok) {
      throw new Error(
        body.errors[0]?.detail || 'something went wrong with a polling request'
      );
    }
    switch (body.state) {
      case 'COMPLETE':
        return;
      case 'FAILED':
        throw new Error('a CF job failed');
    }
    await delay(200);
    await pollForJobCompletion(jobLocation);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
