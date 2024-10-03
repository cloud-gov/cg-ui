import * as CF from '@/api/cf/cloudfoundry';
import { OrgQuotaObject, RolesByUser, SpaceRoleMap } from './controller-types';
import { RoleObj, UserObj, SpaceObj } from '@/api/cf/cloudfoundry-types';
import { UserLogonInfoById } from '@/api/aws/s3-types';
import { cfRequestOptions } from '@/api/cf/cloudfoundry-helpers';
import { request } from '@/api/api';
import { delay } from '@/helpers/timeout';

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
    // if the role is a space role, add to space role list
    if (relation.space.data?.guid) {
      const spaceId = relation.space.data.guid;
      if (userObj[userId].space[spaceId]) {
        userObj[userId].space[spaceId].push({
          guid: resource.guid, // role guid
          role: resource.type,
        });
      } else {
        userObj[userId].space[spaceId] = [
          {
            guid: resource.guid,
            role: resource.type,
          },
        ];
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

// We are filtering the user logon info object so that only those
// users which are available to the particular requesting user in CF
// are part of this controller response, instead of sending ALL users
// that are part of the UAA application
export function filterUserLogonInfo(
  userInfo: UserLogonInfoById,
  allowedIds: Array<string>
): UserLogonInfoById {
  const allowedUserInfo = {} as UserLogonInfoById;
  for (const id of allowedIds) {
    if (id in userInfo) {
      allowedUserInfo[id] = userInfo[id];
    } else {
      // if this user was not found in the dataset, we assume they have never
      // logged in and we can display that data in the UI
      allowedUserInfo[id] = {
        userName: null, // we don't have a way of knowing in this context
        active: false,
        lastLogonTime: null,
        lastLogonTimePretty: null,
      };
    }
  }
  return allowedUserInfo;
}

// this function makes an assumption about a user based on a number of factors,
// but we can't actually programmatically tell if this is a non-human without checking
// against serviceCredentialBindings for the user's guid matching against a credential guid
export function likelyNonHumanUser(user: UserObj): boolean {
  const guidRegex = new RegExp(
    '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
  );
  return !!(user.origin === 'uaa' && guidRegex.test(user.username));
}

export async function logDevError(message: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(message);
  }
}

export function apiErrorMessage(resStatus: number, customMsg = ''): string {
  if (resStatus === 401) {
    return 'You are logged out. Please log in.';
  }
  return customMsg || 'something went wrong with the request';
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

export const defaultSpaceRoles = {
  space_supporter: {
    name: 'Supporter',
    type: 'space_supporter',
    description: 'TODO',
    selected: false,
  },
  space_auditor: {
    name: 'Auditor',
    type: 'space_auditor',
    description:
      'Space auditors can view logs, reports, and settings for a space',
    selected: false,
  },
  space_developer: {
    name: 'Developer',
    type: 'space_developer',
    description:
      'Space developers can do everything space auditors can do, and can create and manage apps and services',
    selected: false,
  },
  space_manager: {
    name: 'Manager',
    type: 'space_manager',
    description:
      'Space managers can manage users and enable features but do not create and manage apps and services',
    selected: false,
  },
} as SpaceRoleMap;

export function resourceKeyedById(resource: Array<any>): Object {
  return resource.reduce((acc, item) => {
    acc[item.guid || item.id] = item;
    return acc;
  }, {});
}

// get number of users for each org
export async function countUsersPerOrg(
  orgGuids: Array<string>
): Promise<{ [orgGuid: string]: number }> {
  const responses = await Promise.all(
    orgGuids.map((orgId: string) => CF.getOrgUsers(orgId))
  );
  const responsesJson = await Promise.all(responses.map((res) => res.json()));
  return responsesJson.reduce((acc, curRes, curIndex) => {
    acc[orgGuids[curIndex]] = curRes?.resources?.length || 0;
    return acc;
  }, {});
}

// get allocated memory for each org
export async function allocatedMemoryPerOrg(
  orgGuids: Array<string>
): Promise<{ [orgGuid: string]: number }> {
  let memoryAllocated = {};
  const orgQuotaRes = await CF.getOrgQuotas({
    organizationGuids: orgGuids,
  });
  if (orgQuotaRes.ok) {
    const orgQuotas = (await orgQuotaRes.json()).resources;
    memoryAllocated = orgQuotas.reduce(
      (acc: { [orgId: string]: number }, curQuota: OrgQuotaObject) => {
        const relatedOrgs = curQuota.relationships.organizations.data.map(
          (o: any) => o.guid
        );
        orgGuids.map((orgGuid: string) => {
          if (
            relatedOrgs.find(
              (relatedOrgGuid: string) => relatedOrgGuid === orgGuid
            )
          ) {
            acc[orgGuid] = curQuota.apps.total_memory_in_mb;
          }
        });
        return acc;
      },
      {}
    );
  }
  return memoryAllocated;
}

// get memory usage for each org
export async function memoryUsagePerOrg(
  orgGuids: Array<string>
): Promise<{ [orgGuid: string]: number }> {
  let memoryUsage = {};
  const responses = await Promise.all(
    orgGuids.map((orgId: string) => CF.getOrgUsageSummary(orgId))
  );
  const responsesJson = await Promise.all(responses.map((res) => res.json()));
  memoryUsage = responsesJson.reduce((acc, curResponse, index) => {
    acc[orgGuids[index]] = curResponse.usage_summary.memory_in_mb;
    return acc;
  }, {});
  return memoryUsage;
}

// get spaces for each org
export async function countSpacesPerOrg(
  orgGuids: Array<string>
): Promise<{ [orgGuid: string]: number }> {
  let spaceCounts = {};
  const responses = await CF.getSpaces({
    organizationGuids: orgGuids,
  });
  const spaces = (await responses.json()).resources;
  spaceCounts = spaces.reduce(
    (acc: { [orgId: string]: number }, curSpace: SpaceObj) => {
      const orgId = curSpace.relationships.organization.data.guid;
      if (!acc[orgId]) acc[orgId] = 0;
      acc[orgId] = acc[orgId] + 1;
      return acc;
    },
    {}
  );
  return spaceCounts;
}

// get number of apps per org
export async function countAppsPerOrg(
  orgGuids: Array<string>
): Promise<{ [orgGuid: string]: number }> {
  const responses = await Promise.all(
    orgGuids.map((orgId: string) =>
      CF.getApps({
        organizationGuids: [orgId],
      })
    )
  );
  const responsesJson = await Promise.all(responses.map((res) => res.json()));
  return responsesJson.reduce((acc, curRes, curIndex) => {
    acc[orgGuids[curIndex]] = curRes?.resources?.length || 0;
    return acc;
  }, {});
}
