// Request /v3/roles -X POST -d '{ ... }'
// Response 201
export const mockRoleCreate = {
  guid: '6f02d6dc-16c6-4b95-9bff-05166994ed5c',
  created_at: '2024-04-22T14:43:24Z',
  updated_at: '2024-04-22T14:43:24Z',
  type: 'organization_user',
  relationships: {
    user: {
      data: {
        guid: '81de1fa8-eb82-45a8-9202-7c972bfd9347',
      },
    },
    organization: {
      data: {
        guid: '5cf18845-289d-4c84-853b-cc27faa73df3',
      },
    },
    space: {
      data: null,
    },
  },
  links: {
    self: {
      href: 'https://api.dev.us-gov-west-1.aws-us-gov.cloud.gov/v3/roles/6f02d6dc-16c6-4b95-9bff-05166994ed5c',
    },
    user: {
      href: 'https://api.dev.us-gov-west-1.aws-us-gov.cloud.gov/v3/users/81de1fa8-eb82-45a8-9202-7c972bfd9347',
    },
    organization: {
      href: 'https://api.dev.us-gov-west-1.aws-us-gov.cloud.gov/v3/organizations/5cf18845-289d-4c84-853b-cc27faa73df3',
    },
  },
};

// Request /v3/roles -X POST -d '{ ... }'
//   where the role type is not a valid role type
// Response 422
export const mockRoleCreateBadRole = {
  errors: [
    {
      detail:
        'Type must be one of the allowed types ["organization_auditor", "organization_manager", "organization_billing_manager", "organization_user", "space_auditor", "space_manager", "space_developer", "space_supporter"]',
      title: 'CF-UnprocessableEntity',
      code: 10008,
    },
  ],
};

// Request /v3/roles -X POST -d '{ ... }'
//  where the user is already assigned to the org with the requested role
// Response 422
export const mockRoleCreateExisting = {
  errors: [
    {
      detail:
        "User 'existing@example.com' already has 'organization_manager' role in organization 'Org1'.",
      title: 'CF-UnprocessableEntity',
      code: 10008,
    },
  ],
};

// Request /v3/roles -X POST -d '{ ... }'
//   where the username does not exist
// Response 422
export const mockRoleCreateInvalid = {
  errors: [
    {
      detail: "No user exists with the username 'fake@example.com'",
      title: 'CF-UnprocessableEntity',
      code: 10008,
    },
  ],
};

// Request /v3/roles/[guid] -X DELETE
// Response 202 (no body)
export const mockRoleDelete = undefined;

// Request /v3/roles/[invalid-guid] -X DELETE
// Response 404
export const mockRoleDeleteInvalid = {
  errors: [
    {
      detail: 'Role not found',
      title: 'CF-ResourceNotFound',
      code: 10010,
    },
  ],
};
