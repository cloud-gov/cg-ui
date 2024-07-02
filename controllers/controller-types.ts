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

// TODO: remove this Result in favor of the interfaces below
export interface Result {
  success: boolean;
  status?: ResultStatus;
  message?: string;
  payload?: any;
}

// taken from USWDS alert options: https://designsystem.digital.gov/components/uswds/Alert/
type ResultStatus =
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
