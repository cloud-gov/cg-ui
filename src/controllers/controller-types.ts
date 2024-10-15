import { RoleType, SpaceObj, UserObj } from '@/api/cf/cloudfoundry-types';

export interface AddOrgRoleArgs {
  orgGuid: string;
  roleType: RoleType;
  username: string;
}

export interface AddSpaceRoleArgs {
  spaceGuid: string;
  roleType: RoleType;
  username: string;
}

export interface ControllerResult {
  payload: any;
  meta: ControllerMetadata;
}

export interface ControllerMetadata {
  status: ResultStatus;
  errors?: string[];
}

// taken from USWDS alert options: https://designsystem.digital.gov/components/uswds/Alert/
export type ResultStatus =
  | 'default'
  | 'pending'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'emergency';

export interface RolesByUser {
  [userGuid: string]: RolesByUserItem;
}

export interface RolesByUserItem {
  org: RolesByUserRole[];
  space: SpaceRoles;
  allSpaceRoleGuids: string[];
  allOrgRoleGuids: string[];
}

export interface RolesByUserRole {
  guid: string;
  role: RoleType;
}

export interface RolesState {
  [spaceGuid: string]: SpaceRoleMap;
}

export interface SpacesBySpaceId {
  [spaceGuid: string]: SpaceObj;
}

export interface SpaceRoles {
  [spaceGuid: string]: RolesByUserRole[];
}

export interface SpaceRoleMap {
  [roleType: string]: {
    name: string;
    guid?: string;
    type: string;
    description: string;
    selected: boolean;
  };
}

// this interface is a combination of a user's info we expect from
// the JSON in s3 and the controller's manipulation of the data for
// UI purposes. null values indicate this user has never logged into cloud
export interface UserLogonInfoDisplay {
  userName: string | null;
  active: boolean;
  lastLogonTime: number | null;
  lastLogonTimePretty: string | null;
}

export interface UserMessage {
  success?: string;
  fail?: string;
}

export interface UserOrgPage extends UserObj {
  orgRolesCount: number;
  spaceRolesCount: number;
  daysToExpiration: number | null;
  lastLogonTime: number | null | undefined;
}

export interface OrgQuotaObject {
  apps: {
    total_memory_in_mb: number | null;
  };
  relationships: {
    organizations: {
      data: { guid: string }[];
    };
  };
}
