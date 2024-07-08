import { ListRolesRes, RoleType } from '@/api/cf/cloudfoundry-types';
import { ResultStatus } from './controller-types';

export function associateUsersWithRoles(
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

// TYPES AND INTERFACES

export interface Result {
  success: boolean;
  status?: ResultStatus;
  message?: string;
  payload?: any;
}

export interface UserWithRoles {
  guid: string;
  origin: string;
  orgRoles?: {
    guid: string;
    type: RoleType;
  }[];
  spaceRoles?: {
    spaceGuid?: string;
    spaceName?: string;
    guid: string;
    type: RoleType;
  }[];
  username: string;
}
