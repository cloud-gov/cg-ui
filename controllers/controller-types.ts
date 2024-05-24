import * as CF from '@/api/cf/cloudfoundry';

export interface AddOrgRoleArgs {
  orgGuid: string;
  roleType: CF.OrgRole;
  username: string;
}

export interface AddSpaceRoleArgs {
  spaceGuid: string;
  roleType: CF.SpaceRole;
  username: string;
}

export interface UserWithRoles {
  guid: string;
  origin: string;
  roles: {
    guid: string;
    type: CF.OrgRole | CF.SpaceRole;
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
type ResultStatus = 'success' | 'info' | 'warning' | 'error' | 'emergency';

export interface ControllerMetadata {
  status: ResultStatus;
}

export interface ControllerResult {
  payload: any;
  meta: ControllerMetadata;
}

export interface RoleResIncludeUsers {
  pagination: any;
  resources: {
    guid: string;
    created_at: string;
    updated_at: string;
    type: CF.OrgRole;
    relationships: {
      user: {
        data: {
          guid: string;
        };
      };
      organization: any;
      space: any;
    };
    links: any;
  }[];
  included: {
    users: {
      guid: string;
      created_at: string;
      updated_at: string;
      username: string;
      presentation_name: string;
      origin: string;
      metadata: any;
      links: any;
    }[];
  };
}

export interface UserMessage {
  success?: string;
  fail?: string;
}
