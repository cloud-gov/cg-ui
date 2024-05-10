// Request /v3/spaces/[guid]
// Response 200
export const mockSpace = {
  guid: 'd1905d34-15bc-476d-915e-41a0d76ce652',
  created_at: '2024-05-07T18:34:12Z',
  updated_at: '2024-05-07T18:34:12Z',
  name: 'acceptance-tests',
  relationships: {
    organization: {
      data: {
        guid: '4c1b335b-cd42-4f72-a8cc-b61ed3ab7dd3',
      },
    },
    quota: {
      data: null,
    },
  },
  metadata: {
    labels: {},
    annotations: {},
  },
  links: {
    self: {
      href: 'https://example.com/v3/spaces/d1905d34-15bc-476d-915e-41a0d76ce652',
    },
    organization: {
      href: 'https://example.com/v3/organizations/4c1b335b-cd42-4f72-a8cc-b61ed3ab7dd3',
    },
    features: {
      href: 'https://example.com/v3/spaces/d1905d34-15bc-476d-915e-41a0d76ce652/features',
    },
    apply_manifest: {
      href: 'https://example.com/v3/spaces/d1905d34-15bc-476d-915e-41a0d76ce652/actions/apply_manifest',
      method: 'POST',
    },
  },
};

// Request /v3/spaces/[invalid-guid]
// Response 404
export const mockSpaceInvalid = {
  errors: [
    {
      detail: 'Space not found',
      title: 'CF-ResourceNotFound',
      code: 10010,
    },
  ],
};

// Request /v3/spaces
// Response 200
export const mockSpaces = {
  pagination: {
    total_results: 38,
    total_pages: 1,
    first: {
      href: 'https://example.com/v3/spaces?page=1\u0026per_page=50',
    },
    last: {
      href: 'https://example.com/v3/spaces?page=1\u0026per_page=50',
    },
    next: null,
    previous: null,
  },
  resources: [
    {
      guid: '31f60ee5-87d2-4baa-9d44-9c1a356cd07d',
      created_at: '2017-06-01T19:27:19Z',
      updated_at: '2024-02-20T18:45:18Z',
      name: 'services',
      relationships: {
        organization: {
          data: {
            guid: '914b4899-2a7c-4214-bacc-f97576e00777',
          },
        },
        quota: {
          data: null,
        },
      },
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/spaces/31f60ee5-87d2-4baa-9d44-9c1a356cd07d',
        },
        organization: {
          href: 'https://example.com/v3/organizations/914b4899-2a7c-4214-bacc-f97576e00777',
        },
        features: {
          href: 'https://example.com/v3/spaces/31f60ee5-87d2-4baa-9d44-9c1a356cd07d/features',
        },
        apply_manifest: {
          href: 'https://example.com/v3/spaces/31f60ee5-87d2-4baa-9d44-9c1a356cd07d/actions/apply_manifest',
          method: 'POST',
        },
      },
    },
    {
      guid: 'eff20e25-befe-4ee0-adeb-c9a773b979dd',
      created_at: '2017-06-07T01:39:44Z',
      updated_at: '2017-06-07T01:39:44Z',
      name: 'test',
      relationships: {
        organization: {
          data: {
            guid: '914b4899-2a7c-4214-bacc-f97576e00777',
          },
        },
        quota: {
          data: null,
        },
      },
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/spaces/eff20e25-befe-4ee0-adeb-c9a773b979dd',
        },
        organization: {
          href: 'https://example.com/v3/organizations/914b4899-2a7c-4214-bacc-f97576e00777',
        },
        features: {
          href: 'https://example.com/v3/spaces/eff20e25-befe-4ee0-adeb-c9a773b979dd/features',
        },
        apply_manifest: {
          href: 'https://example.com/v3/spaces/eff20e25-befe-4ee0-adeb-c9a773b979dd/actions/apply_manifest',
          method: 'POST',
        },
      },
    },
    {
      guid: '335cf9f9-7a00-487d-88da-4fc80372b6ad',
      created_at: '2018-05-05T02:30:16Z',
      updated_at: '2022-02-15T14:12:21Z',
      name: 'volume',
      relationships: {
        organization: {
          data: {
            guid: '914b4899-2a7c-4214-bacc-f97576e00777',
          },
        },
        quota: {
          data: null,
        },
      },
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/spaces/335cf9f9-7a00-487d-88da-4fc80372b6ad',
        },
        organization: {
          href: 'https://example.com/v3/organizations/914b4899-2a7c-4214-bacc-f97576e00777',
        },
        features: {
          href: 'https://example.com/v3/spaces/335cf9f9-7a00-487d-88da-4fc80372b6ad/features',
        },
        apply_manifest: {
          href: 'https://example.com/v3/spaces/335cf9f9-7a00-487d-88da-4fc80372b6ad/actions/apply_manifest',
          method: 'POST',
        },
      },
    },
  ],
};
