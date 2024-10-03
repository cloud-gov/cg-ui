export const mockOrgQuotas = {
  pagination: {
    total_results: 1,
    total_pages: 1,
    first: {
      href: 'https://api.dev.us-gov-west-1.aws-us-gov.cloud.gov/v3/organization_quotas?organization_guids=470bd8ff-ed0e-4d11-95c4-cf765202cebd&page=1&per_page=50',
    },
    last: {
      href: 'https://api.dev.us-gov-west-1.aws-us-gov.cloud.gov/v3/organization_quotas?organization_guids=470bd8ff-ed0e-4d11-95c4-cf765202cebd&page=1&per_page=50',
    },
    next: null,
    previous: null,
  },
  resources: [
    {
      guid: '3564fac5-c405-480e-b758-57912da29f9e',
      created_at: '2017-04-27T19:12:50Z',
      updated_at: '2022-07-18T21:01:25Z',
      name: 'default',
      apps: {
        total_memory_in_mb: 10240,
        per_process_memory_in_mb: null,
        total_instances: null,
        per_app_tasks: null,
        log_rate_limit_in_bytes_per_second: null,
      },
      services: {
        paid_services_allowed: true,
        total_service_instances: 100,
        total_service_keys: 1000,
      },
      routes: {
        total_routes: 1000,
        total_reserved_ports: 5,
      },
      domains: {
        total_domains: null,
      },
      relationships: {
        organizations: {
          data: [
            {
              guid: 'orgId1',
            },
            {
              guid: 'foo',
            },
            {
              guid: 'bar',
            },
            {
              guid: 'baz',
            },
          ],
        },
      },
      links: {
        self: {
          href: 'https://api.dev.us-gov-west-1.aws-us-gov.cloud.gov/v3/organization_quotas/3564fac5-c405-480e-b758-57912da29f9e',
        },
      },
    },
    {
      guid: '3564fac5-c405-480e-b758-57912da29f9f',
      created_at: '2017-04-27T19:12:50Z',
      updated_at: '2022-07-18T21:01:25Z',
      name: 'staging',
      apps: {
        total_memory_in_mb: 500,
        per_process_memory_in_mb: null,
        total_instances: null,
        per_app_tasks: null,
        log_rate_limit_in_bytes_per_second: null,
      },
      services: {
        paid_services_allowed: true,
        total_service_instances: 100,
        total_service_keys: 1000,
      },
      routes: {
        total_routes: 1000,
        total_reserved_ports: 5,
      },
      domains: {
        total_domains: null,
      },
      relationships: {
        organizations: {
          data: [
            {
              guid: 'orgId2',
            },
            {
              guid: 'foo',
            },
            {
              guid: 'bar',
            },
            {
              guid: 'baz',
            },
          ],
        },
      },
      links: {
        self: {
          href: 'https://api.dev.us-gov-west-1.aws-us-gov.cloud.gov/v3/organization_quotas/3564fac5-c405-480e-b758-57912da29f9e',
        },
      },
    },
  ],
};
