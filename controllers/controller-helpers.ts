import { UserWithRoles } from './controller-types';
import { ListRolesRes } from '@/api/cf/cloudfoundry-types';

export function associateUsersWithOrgAndSpaceRoles(
  orgRoles: ListRolesRes,
  spaceRoles?: ListRolesRes
): UserWithRoles[] {
  if (!orgRoles.included?.users) {
    return [];
  }
  const users = orgRoles.included.users
    .map(function (user) {
      const associatedOrgRoles = orgRoles.resources.filter(function (role) {
        return user.guid == role.relationships.user.data.guid;
      });
      const userObj: UserWithRoles = {
        guid: user.guid,
        username: user.username,
        origin: user.origin,
        orgRoles: associatedOrgRoles.map(function (role) {
          return {
            guid: role.guid,
            type: role.type,
          };
        }),
      };

      if (spaceRoles && spaceRoles.included?.spaces) {
        userObj.spaceRoles = [];
        const userSpaceRoles = spaceRoles.resources.filter(function (role) {
          return user.guid == role.relationships.user.data.guid;
        });

        // TODO figure out where we want to filter out space roles so that we are only receiving
        // the one with the most privileges and hiding the others from the UI
        // Example: display space_developer instead of space_auditor
        userObj.spaceRoles = userSpaceRoles.map(function (role) {
          const spaceGuid = role.relationships.space?.data.guid || '';
          const spaceDetails = spaceRoles.included?.spaces?.find(
            function (space) {
              return space.guid == spaceGuid;
            }
          );
          const spaceName = spaceDetails
            ? spaceDetails.name
            : 'Unable to locate space name';
          return {
            guid: role.guid,
            type: role.type,
            spaceGuid: spaceGuid,
            spaceName: spaceName,
          };
        });
      }
      return userObj;
    })
    .sort(function (a, b) {
      // sort null usernames at the bottom of the list
      return a.username ? a.username.localeCompare(b.username) : 1;
    });
  return users;
}

export function associateUsersWithSpaceRoles(
  spaceRoles: ListRolesRes
): UserWithRoles[] {
  if (!spaceRoles.included?.users) {
    return [];
  }
  const users = spaceRoles.included.users
    .map(function (user) {
      const associatedSpaceRoles = spaceRoles.resources.filter(function (role) {
        return user.guid == role.relationships.user.data.guid;
      });
      const userObj: UserWithRoles = {
        guid: user.guid,
        username: user.username,
        origin: user.origin,
        spaceRoles: associatedSpaceRoles.map(function (role) {
          return {
            guid: role.guid,
            type: role.type,
          };
        }),
      };
      return userObj;
    })
    .sort(function (a, b) {
      // sort null usernames at the bottom of the list
      return a.username ? a.username.localeCompare(b.username) : 1;
    });
  return users;
}
