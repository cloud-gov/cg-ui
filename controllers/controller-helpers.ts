import { RolesByUser, UserWithRoles } from './controller-types';
import { ListRolesRes, RoleObj } from '@/api/cf/cloudfoundry-types';

export function associateUsersWithRoles(roles: RoleObj[]): RolesByUser {
  return roles.reduce((userObj, resource: RoleObj) => {
    const relation = resource.relationships;
    if (!userObj[relation.user.data.guid]) {
      userObj[relation.user.data.guid] = { org: [], space: [] };
    }
    if (relation.space.data?.guid) {
      const spaceObj = { guid: relation.space.data.guid, role: resource.type };
      userObj[relation.user.data.guid].space.push(spaceObj);
    }
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
