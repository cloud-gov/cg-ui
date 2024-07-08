import { RoleType, SpaceObj } from '@/api/cf/cloudfoundry-types';

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

export interface RolesByUserRole {
  guid: string;
  role: RoleType;
}

export interface SpaceRoles {
  [spaceGuid: string]: RolesByUserRole[];
}

export interface RolesByUserItem {
  org: RolesByUserRole[];
  space: SpaceRoles;
  allSpaceRoleGuids: string[];
  allOrgRoleGuids: string[];
}

export interface RolesByUser {
  [userGuid: string]: RolesByUserItem;
}

export interface SpacesBySpaceId {
  [spaceGuid: string]: SpaceObj;
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

export interface ControllerMetadata {
  status: ResultStatus;
  errors?: string[];
}

export interface ControllerResult {
  payload: any;
  meta: ControllerMetadata;
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

export interface SpaceRoleMap {
  [roleType: string]: {
    name: string;
    guid?: string;
    type: string;
    description: string;
    selected: boolean;
  };
}

export interface RolesState {
  [spaceGuid: string]: SpaceRoleMap;
}
