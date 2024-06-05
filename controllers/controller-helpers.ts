import { RolesByUser, UserWithRoles, RoleRanking } from './controller-types';
import { ListRolesRes, RoleObj } from '@/api/cf/cloudfoundry-types';
import { RoleType } from '@/api/cf/cloudfoundry-types';

export function resourceKeyedById(resource: Array<any>): Object {
  return resource.reduce((acc, item) => {
    acc[item.guid] = item;
    return acc;
  }, {});
}

export function associateUsersWithRoles(roles: RoleObj[]): RolesByUser {
  return roles.reduce((userObj, resource: RoleObj) => {
    const relation = resource.relationships;
    const userId = relation.user.data.guid;
    // add a user object if one doesn't exist yet
    if (!userObj[userId]) {
      userObj[userId] = { org: [], space: {} };
    }
    // if the role is a space role, evaluate space role
    if (relation.space.data?.guid) {
      const spaceId = relation.space.data.guid;
      if (userObj[userId].space[spaceId]) {
        const rankedRole = rankRole(
          userObj[userId].space[spaceId].role,
          resource.type
        );
        userObj[userId].space[spaceId] = {
          guid: spaceId,
          role: rankedRole as RoleType,
        };
      } else {
        userObj[userId].space[spaceId] = { guid: spaceId, role: resource.type };
      }
    }
    // evaluate org role
    if (relation.organization.data?.guid) {
      const orgObj = {
        guid: relation.organization.data.guid,
        role: resource.type,
      };
      userObj[relation.user.data.guid].org.push(orgObj);
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
