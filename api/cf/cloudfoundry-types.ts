export type RoleType =
  | 'organization_manager'
  | 'organization_user'
  | 'organization_auditor'
  | 'organization_billing_manager'
  | 'space_manager'
  | 'space_developer'
  | 'space_auditor'
  | 'space_supporter';

/* FUNCTION ARGUMENTS */

export interface AddRoleArgs {
  orgGuid?: string;
  roleType: string;
  spaceGuid?: string;
  username?: string;
  userGuid?: string;
}

export interface GetAppArgs {
  // guids refers to application guids
  guids?: string[];
  names?: string[];
  include?: Array<'space' | 'space.organization'>;
  organizationGuids?: string[];
  perPage?: string;
  spaceGuids?: string[];
}

export interface GetRoleArgs {
  // guids refers to role guids
  guids?: string[];
  types?: RoleType[];
  include?: Array<'user' | 'space' | 'organization'>;
  organizationGuids?: string[];
  perPage?: string;
  spaceGuids?: string[];
  userGuids?: string[];
}

export interface GetSpaceArgs {
  // guids refers to space guids
  guids?: string[];
  include?: Array<'organization'>;
  names?: string[];
  organizationGuids?: string[];
  perPage?: string;
}

/* INDIVIDUAL API RESPONSE OBJECTS */

export interface AppObj {
  guid: string;
  created_at: string;
  updated_at: string;
  name: string;
  state: 'STOPPED' | 'STARTED';
  // TODO update once we start using the lifecycle object
  lifecycle: any;
  relationships: {
    space: {
      data: {
        guid: string;
      };
    };
  };
  metadata: any;
  links: any;
}

export interface OrgObj {
  guid: string;
  created_at: string;
  updated_at: string;
  name: string;
  suspended: boolean;
  relationships: {
    // TODO update once we start using the org quota object
    quota?: any;
  };
  metadata: any;
  links: any;
}

export interface RoleObj {
  guid: string;
  created_at: string;
  updated_at: string;
  type: RoleType;
  relationships: {
    user: {
      data: {
        guid: string;
      };
    };
    organization: {
      data: {
        guid: string | undefined;
      };
    };
    space: {
      data: {
        guid: string | undefined;
      };
    };
  };
  links: any;
}

export interface SpaceObj {
  guid: string;
  created_at: string;
  updated_at: string;
  name: string;
  relationships: {
    organization: {
      data: {
        guid: string;
      };
    };
    // TODO update once we start using the space quota object
    quota?: any;
  };
}

export interface UserObj {
  guid: string;
  created_at: string;
  updated_at: string;
  username: string;
  presentation_name: string;
  origin: string;
  metadata: any;
  links: any;
}

/* API ENDPOINT RESPONSES */

// ROLES

// POST /v3/roles data
export interface AddRoleApiData {
  type: string;
  relationships: {
    user: {
      data: {
        username?: string;
        guid?: string;
      };
    };
    organization?: {
      data: {
        guid: string;
      };
    };
    space?: {
      data: {
        guid: string;
      };
    };
  };
}

// GET /v3/roles with optional ?include
export interface ListRolesRes {
  pagination: any;
  resources: RoleObj[];
  included?: {
    organizations?: OrgObj[];
    spaces?: SpaceObj[];
    users?: UserObj[];
  };
}

// SPACES

// GET /v3/spaces with optional ?include
export interface ListSpacesRes {
  pagination: any;
  resources: SpaceObj[];
  included?: {
    organizations?: OrgObj[];
  };
}
