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

export interface GetOrgQuotasArgs {
  // guids and names refer to quota guids
  guids?: string[];
  names?: string[];
  organizationGuids?: string[];
}

export interface GetRoleArgs {
  // guids refers to role guids
  guids?: string[];
  include?: Array<'user' | 'space' | 'organization'>;
  organizationGuids?: string[];
  perPage?: string;
  spaceGuids?: string[];
  types?: RoleType[];
  userGuids?: string[];
}

export interface GetServiceCredentialBindingsArgs {
  // guids and names refers to the credential bindings
  guids?: string[];
  names?: string[];
  serviceInstanceGuids?: string[];
  serviceInstanceNames?: string[];
  appGuids?: string[];
  appNames?: string[];
  servicePlanGuids?: string[];
  servicePlanNames?: string[];
  serviceOfferingGuids?: string[];
  serviceOfferingNames?: string[];
  type?: 'app' | 'key';
  include?: Array<'app' | 'service_instance'>;
  // other arguments not yet implemented
  // createdAts
  // updatedAts
  // labelSelector
}

export interface GetServiceInstancesArgs {
  // guids and names refer to the service instances
  guids?: string[];
  names?: string[];
  organizationGuids?: string[];
  perPage?: string;
  servicePlanGuids?: string[];
  servicePlanNames?: string[];
  spaceGuids?: string[];
  type?: Array<'managed' | 'user-provided'>;
  // other arguments not yet implemented
  //   fields (https://v3-apidocs.cloudfoundry.org/version/3.169.0/index.html#fields-parameter)
  //   labelSelector (https://v3-apidocs.cloudfoundry.org/version/3.169.0/index.html#labels-and-selectors)
  //   createdAts (timestamps and relational operators)
  //   updatedAts (timestamps and relational operators)
}

// space and org filters do not filter out plans that are public, only those restricted to an organization
export interface GetServicePlansArgs {
  // guids and names refer to the service plans
  guids?: string[];
  names?: string[];
  available?: boolean;
  brokerCatalogIds?: string[];
  organizationGuids?: string[];
  serviceBrokerGuids?: string[];
  serviceBrokerNames?: string[];
  serviceOfferingGuids?: string[];
  serviceOfferingNames?: string[];
  serviceInstanceGuids?: string[];
  spaceGuids?: string[];
  include?: Array<'space.organization' | 'service_offering'>;
  // other arguments not yet implemented
  //   fields (https://v3-apidocs.cloudfoundry.org/version/3.169.0/index.html#fields-parameter)
  //   labelSelector (https://v3-apidocs.cloudfoundry.org/version/3.169.0/index.html#labels-and-selectors)
  //   createdAts (timestamps and relational operators)
  //   updatedAts (timestamps and relational operators)
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

export interface ServiceCredentialBindingObj {
  guid: string;
  name: string;
  type: 'key' | 'app';
  last_operation: {
    // almost identical to last_operation for svc instance but type field differs
    type: 'create' | 'delete';
    state: 'initial' | 'in progress' | 'succeeded' | 'failed';
    description: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
  metadata: any;
  relationships: {
    service_instance: {
      data: {
        guid: string;
      };
    };
    // only for app bindings
    app?: {
      data: {
        guid: string;
      };
    };
  };
  links: any;
}

export interface ServiceInstanceObj {
  guid: string;
  created_at: string;
  updated_at: string;
  name: string;
  type: 'managed' | 'user-provided';
  tags: string[];
  last_operation: {
    type: 'create' | 'update' | 'delete';
    state: 'initial' | 'in progress' | 'succeeded' | 'failed';
    description: string;
    created_at: string;
    updated_at: string;
  };
  relationships: {
    // service plan only shown if type managed
    service_plan?: {
      data: {
        guid: string;
      };
    };
    space: {
      data: {
        guid: string;
      };
    };
  };
  metadata: any;
  links: any;
  // syslog and route only if type user-provided
  syslog_drain_url?: string;
  route_service_url?: string;
  // following only if type managed
  maintenance_info?: any;
  upgrade_available?: boolean;
  dashboard_url?: string;
}

export interface ServicePlanObj {
  guid: string;
  created_at: string;
  updated_at: string;
  name: string;
  visibility_type: 'public' | 'admin' | 'organization' | 'space';
  available: boolean;
  free: boolean;
  description: string;
  relationships: {
    service_offering: {
      data: {
        guid: string;
      };
    };
    space: {
      data: {
        guid: string;
      };
    };
  };
  // TODO update if we start using the below
  costs: any;
  maintenance_info: any;
  broker_catalog: any;
  schemas: any;
  metadata: any;
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
