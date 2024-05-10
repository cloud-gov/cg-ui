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
      href: 'https://example.com/v3/roles/6f02d6dc-16c6-4b95-9bff-05166994ed5c',
    },
    user: {
      href: 'https://example.com/v3/users/81de1fa8-eb82-45a8-9202-7c972bfd9347',
    },
    organization: {
      href: 'https://example.com/v3/organizations/5cf18845-289d-4c84-853b-cc27faa73df3',
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
// Response 202
// (no body)

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

// Request /v3/roles?organization_guids=[guid]&user_guids=[guid]
// Response 200
export const mockRolesFilteredByOrgAndUser = {
  pagination: {
    total_results: 2,
    total_pages: 1,
    first: {
      href: 'https://example.com/v3/roles?order_by=%2Bcreated_at\u0026organization_guids=e8e31994-0dba-41e3-96ea-39942f1b30a4\u0026page=1\u0026per_page=50\u0026user_guids=46ff1fd5-4238-4e22-a00a-1bec4fc0f9da',
    },
    last: {
      href: 'https://example.com/v3/roles?order_by=%2Bcreated_at\u0026organization_guids=e8e31994-0dba-41e3-96ea-39942f1b30a4\u0026page=1\u0026per_page=50\u0026user_guids=46ff1fd5-4238-4e22-a00a-1bec4fc0f9da',
    },
    next: null,
    previous: null,
  },
  resources: [
    {
      guid: 'c7c1b7d7-1f1d-4abb-84d4-72bcc254e180',
      created_at: '2024-01-17T19:34:54Z',
      updated_at: '2024-01-17T19:34:54Z',
      type: 'organization_manager',
      relationships: {
        user: {
          data: {
            guid: '46ff1fd5-4238-4e22-a00a-1bec4fc0f9da',
          },
        },
        organization: {
          data: {
            guid: 'e8e31994-0dba-41e3-96ea-39942f1b30a4',
          },
        },
        space: {
          data: null,
        },
      },
      links: {
        self: {
          href: 'https://example.com/v3/roles/c7c1b7d7-1f1d-4abb-84d4-72bcc254e180',
        },
        user: {
          href: 'https://example.com/v3/users/46ff1fd5-4238-4e22-a00a-1bec4fc0f9da',
        },
        organization: {
          href: 'https://example.com/v3/organizations/e8e31994-0dba-41e3-96ea-39942f1b30a4',
        },
      },
    },
    {
      guid: '48215058-5d30-4f02-99d2-7c0f200549b7',
      created_at: '2024-01-17T19:35:20Z',
      updated_at: '2024-01-17T19:35:20Z',
      type: 'organization_user',
      relationships: {
        user: {
          data: {
            guid: '46ff1fd5-4238-4e22-a00a-1bec4fc0f9da',
          },
        },
        organization: {
          data: {
            guid: 'e8e31994-0dba-41e3-96ea-39942f1b30a4',
          },
        },
        space: {
          data: null,
        },
      },
      links: {
        self: {
          href: 'https://example.com/v3/roles/48215058-5d30-4f02-99d2-7c0f200549b7',
        },
        user: {
          href: 'https://example.com/v3/users/46ff1fd5-4238-4e22-a00a-1bec4fc0f9da',
        },
        organization: {
          href: 'https://example.com/v3/organizations/e8e31994-0dba-41e3-96ea-39942f1b30a4',
        },
      },
    },
  ],
};

// Request /v3/organizations/[guid]/users
// Response 200
export const mockUsersByOrganization = {
  pagination: {
    total_results: 15,
    total_pages: 1,
    first: {
      href: 'https://example.com/v3/roles?include=user\u0026order_by=%2Bcreated_at\u0026organization_guids=89c0b2a8-957d-4900-abab-87395efaffdb\u0026page=1\u0026per_page=50',
    },
    last: {
      href: 'https://example.com/v3/roles?include=user\u0026order_by=%2Bcreated_at\u0026organization_guids=89c0b2a8-957d-4900-abab-87395efaffdb\u0026page=1\u0026per_page=50',
    },
    next: null,
    previous: null,
  },
  resources: [
    {
      guid: 'fb55574d-6b84-405e-b23c-0984f0a0964a',
      created_at: '2024-01-17T19:08:55Z',
      updated_at: '2024-01-17T19:08:55Z',
      type: 'organization_user',
      relationships: {
        user: {
          data: {
            guid: '73193f8c-e03b-43c8-aeee-8670908899d2',
          },
        },
        organization: {
          data: {
            guid: '89c0b2a8-957d-4900-abab-87395efaffdb',
          },
        },
        space: {
          data: null,
        },
      },
      links: {
        self: {
          href: 'https://example.com/v3/roles/fb55574d-6b84-405e-b23c-0984f0a0964a',
        },
        user: {
          href: 'https://example.com/v3/users/73193f8c-e03b-43c8-aeee-8670908899d2',
        },
        organization: {
          href: 'https://example.com/v3/organizations/89c0b2a8-957d-4900-abab-87395efaffdb',
        },
      },
    },
    {
      guid: 'c98f8f55-dc53-498a-bb65-9991ab9f8b78',
      created_at: '2024-01-17T19:10:53Z',
      updated_at: '2024-01-17T19:10:53Z',
      type: 'organization_manager',
      relationships: {
        user: {
          data: {
            guid: 'ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199',
          },
        },
        organization: {
          data: {
            guid: '89c0b2a8-957d-4900-abab-87395efaffdb',
          },
        },
        space: {
          data: null,
        },
      },
      links: {
        self: {
          href: 'https://example.com/v3/roles/c98f8f55-dc53-498a-bb65-9991ab9f8b78',
        },
        user: {
          href: 'https://example.com/v3/users/ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199',
        },
        organization: {
          href: 'https://example.com/v3/organizations/89c0b2a8-957d-4900-abab-87395efaffdb',
        },
      },
    },
  ],
  included: {
    users: [
      {
        guid: '73193f8c-e03b-43c8-aeee-8670908899d2',
        created_at: '2020-07-02T17:23:28Z',
        updated_at: '2020-07-02T17:23:28Z',
        username: 'user1@example.com',
        presentation_name: 'User1 Example',
        origin: 'example.com',
        metadata: {
          labels: {},
          annotations: {},
        },
        links: {
          self: {
            href: 'https://example.com/v3/users/73193f8c-e03b-43c8-aeee-8670908899d2',
          },
        },
      },
      {
        guid: 'ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199',
        created_at: '2024-01-17T19:08:21Z',
        updated_at: '2024-01-17T19:08:21Z',
        username: 'user2@example.com',
        presentation_name: 'User2 Example',
        origin: 'example.com',
        metadata: {
          labels: {},
          annotations: {},
        },
        links: {
          self: {
            href: 'https://example.com/v3/users/ab9dc32e-d7be-4b8d-b9cb-d30d82ae0199',
          },
        },
      },
    ],
  },
};
