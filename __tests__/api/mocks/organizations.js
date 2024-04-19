// /v3/organizations/[guid]
export const mockOrg = {
  guid: 'af961639-b7c4-4257-aa33-854f81a435a9',
  created_at: '2024-01-17T19:08:37Z',
  updated_at: '2024-01-17T19:08:37Z',
  name: 'Org1',
  suspended: false,
  relationships: {
    quota: {
      data: {
        guid: 'e649ef69-0483-4c28-bc05-fa67bf30b180',
      },
    },
  },
  metadata: {
    labels: {},
    annotations: {},
  },
  links: {
    self: {
      href: 'https://example.com/v3/organizations/af961639-b7c4-4257-aa33-854f81a435a9',
    },
    domains: {
      href: 'https://example.com/v3/organizations/af961639-b7c4-4257-aa33-854f81a435a9/domains',
    },
    default_domain: {
      href: 'https://example.com/v3/organizations/af961639-b7c4-4257-aa33-854f81a435a9/domains/default',
    },
    quota: {
      href: 'https://example.com/v3/organization_quotas/3564fac5-c405-480e-b758-57912da29f9e',
    },
  },
};

// /v3/organizations/[bad-guid]
export const mockOrgNotFound = {
  errors: [
    {
      detail: 'Organization not found',
      title: 'CF-ResourceNotFound',
      code: 10010,
    },
  ],
};

// /v3/organizations/[guid]/users
export const mockOrgUsers = {
  pagination: {
    total_results: 2,
    total_pages: 1,
    first: {
      href: 'https://example.com/v3/organizations/470bd8ff-ed0e-4d11-95c4-cf765202cebd/users?page=1\u0026per_page=50',
    },
    last: {
      href: 'https://example.com/v3/organizations/470bd8ff-ed0e-4d11-95c4-cf765202cebd/users?page=1\u0026per_page=50',
    },
    next: null,
    previous: null,
  },
  resources: [
    {
      guid: 'c017eb42-97f8-481d-9a23-13856c9d94ce',
      created_at: '2020-07-02T17:23:28Z',
      updated_at: '2020-07-02T17:23:28Z',
      username: 'org1.user1@gsa.gov',
      presentation_name: 'Org1 User1',
      origin: 'gsa.gov',
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/users/c017eb42-97f8-481d-9a23-13856c9d94ce',
        },
      },
    },
    {
      guid: '77f4f6ad-a21b-459e-8716-8add7e675dcc',
      created_at: '2024-01-17T19:08:21Z',
      updated_at: '2024-01-17T19:08:21Z',
      username: 'org1.user2@gsa.gov',
      presentation_name: 'Org1 User1',
      origin: 'gsa.gov',
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/users/77f4f6ad-a21b-459e-8716-8add7e675dcc',
        },
      },
    },
  ],
};

// /v3/organizations
export const mockOrgs = {
  pagination: {
    total_results: 3,
    total_pages: 1,
    first: {
      href: 'https://example.com/v3/organizations?page=1\u0026per_page=50',
    },
    last: {
      href: 'https://example.com/v3/organizations?page=1\u0026per_page=50',
    },
    next: null,
    previous: null,
  },
  resources: [
    {
      guid: 'b4b52bd5-4940-456a-9432-90c168af6cf8',
      created_at: '2017-04-27T19:12:50Z',
      updated_at: '2017-04-27T19:12:50Z',
      name: 'Org1',
      suspended: false,
      relationships: {
        quota: {
          data: {
            guid: '2eb984e7-0402-4100-9a5e-2fa3a83dc9e7',
          },
        },
      },
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/organizations/b4b52bd5-4940-456a-9432-90c168af6cf8',
        },
        domains: {
          href: 'https://example.com/v3/organizations/b4b52bd5-4940-456a-9432-90c168af6cf8/domains',
        },
        default_domain: {
          href: 'https://example.com/v3/organizations/b4b52bd5-4940-456a-9432-90c168af6cf8/domains/default',
        },
        quota: {
          href: 'https://example.com/v3/organization_quotas/b4b52bd5-4940-456a-9432-90c168af6cf8',
        },
      },
    },
    {
      guid: 'f114757b-568a-4291-a389-6b97e6b47c47',
      created_at: '2017-06-01T19:26:48Z',
      updated_at: '2024-02-20T18:45:18Z',
      name: 'Org2',
      suspended: false,
      relationships: {
        quota: {
          data: {
            guid: '546ff68d-81b6-41fc-ae0b-bbc8032967bf',
          },
        },
      },
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/organizations/f114757b-568a-4291-a389-6b97e6b47c47',
        },
        domains: {
          href: 'https://example.com/v3/organizations/f114757b-568a-4291-a389-6b97e6b47c47/domains',
        },
        default_domain: {
          href: 'https://example.com/v3/organizations/f114757b-568a-4291-a389-6b97e6b47c47/domains/default',
        },
        quota: {
          href: 'https://example.com/v3/organization_quotas/25e6d1de-08b6-43d2-8c46-63c365006f5a',
        },
      },
    },
    {
      guid: '726fcdbd-c243-4743-aecf-67c37ffa1a3c',
      created_at: '2018-01-03T17:03:51Z',
      updated_at: '2022-07-19T18:06:23Z',
      name: 'Org3',
      suspended: false,
      relationships: {
        quota: {
          data: {
            guid: 'fe29b113-d419-462a-ad49-352bd4598175',
          },
        },
      },
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/organizations/726fcdbd-c243-4743-aecf-67c37ffa1a3c',
        },
        domains: {
          href: 'https://example.com/v3/organizations/726fcdbd-c243-4743-aecf-67c37ffa1a3c/domains',
        },
        default_domain: {
          href: 'https://example.com/v3/organizations/726fcdbd-c243-4743-aecf-67c37ffa1a3c/domains/default',
        },
        quota: {
          href: 'https://example.com/v3/organization_quotas/3564fac5-c405-480e-b758-57912da29f9e',
        },
      },
    },
  ],
};
