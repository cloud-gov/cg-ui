// Request /v3/apps?include=space&per_page=2
// Response 200
export const mockApps = {
  pagination: {
    total_results: 69,
    total_pages: 35,
    first: {
      href: 'https://example.com/v3/apps?include=space\u0026page=1\u0026per_page=2',
    },
    last: {
      href: 'https://example.com/v3/apps?include=space\u0026page=35\u0026per_page=2',
    },
    next: {
      href: 'https://example.com/v3/apps?include=space\u0026page=2\u0026per_page=2',
    },
    previous: null,
  },
  resources: [
    {
      guid: '4d2517dd-75af-4c09-9053-24fea3157a54',
      created_at: '2017-06-07T01:40:01Z',
      updated_at: '2017-06-07T01:40:14Z',
      name: 'app1',
      state: 'STARTED',
      lifecycle: {
        type: 'buildpack',
        data: {
          buildpacks: [],
          stack: 'cflinuxfs2',
        },
      },
      relationships: {
        space: {
          data: {
            guid: '3b9dc728-45f0-40cf-ba2a-a836dc50e5b7',
          },
        },
      },
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54',
        },
        environment_variables: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/environment_variables',
        },
        space: {
          href: 'https://example.com/v3/spaces/3b9dc728-45f0-40cf-ba2a-a836dc50e5b7',
        },
        processes: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/processes',
        },
        packages: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/packages',
        },
        current_droplet: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/droplets/current',
        },
        droplets: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/droplets',
        },
        tasks: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/tasks',
        },
        start: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/actions/start',
          method: 'POST',
        },
        stop: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/actions/stop',
          method: 'POST',
        },
        revisions: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/revisions',
        },
        deployed_revisions: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/revisions/deployed',
        },
        features: {
          href: 'https://example.com/v3/apps/4d2517dd-75af-4c09-9053-24fea3157a54/features',
        },
      },
    },
    {
      guid: 'f8bfd925-6c35-47da-b1ea-ac3371309932',
      created_at: '2017-06-29T15:09:34Z',
      updated_at: '2017-06-29T15:14:14Z',
      name: 'app2',
      state: 'STOPPED',
      lifecycle: {
        type: 'buildpack',
        data: {
          buildpacks: ['binary_buildpack'],
          stack: 'cflinuxfs2',
        },
      },
      relationships: {
        space: {
          data: {
            guid: '3b9dc728-45f0-40cf-ba2a-a836dc50e5b7',
          },
        },
      },
      metadata: {
        labels: {},
        annotations: {},
      },
      links: {
        self: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932',
        },
        environment_variables: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/environment_variables',
        },
        space: {
          href: 'https://example.com/v3/spaces/042655eb-6cea-4fd8-ad8b-d03048f95072',
        },
        processes: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/processes',
        },
        packages: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/packages',
        },
        current_droplet: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/droplets/current',
        },
        droplets: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/droplets',
        },
        tasks: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/tasks',
        },
        start: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/actions/start',
          method: 'POST',
        },
        stop: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/actions/stop',
          method: 'POST',
        },
        revisions: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/revisions',
        },
        deployed_revisions: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/revisions/deployed',
        },
        features: {
          href: 'https://example.com/v3/apps/f8bfd925-6c35-47da-b1ea-ac3371309932/features',
        },
      },
    },
  ],
  included: {
    spaces: [
      {
        guid: '042655eb-6cea-4fd8-ad8b-d03048f95072',
        created_at: '2017-06-01T19:27:19Z',
        updated_at: '2024-02-20T18:45:18Z',
        name: 'space 1',
        relationships: {
          organization: {
            data: {
              guid: 'bc8d469d-030d-49e2-b0fc-dd883fac59fb',
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
            href: 'https://example.com/v3/spaces/042655eb-6cea-4fd8-ad8b-d03048f95072',
          },
          organization: {
            href: 'https://example.com/v3/organizations/bc8d469d-030d-49e2-b0fc-dd883fac59fb',
          },
          features: {
            href: 'https://example.com/v3/spaces/042655eb-6cea-4fd8-ad8b-d03048f95072/features',
          },
          apply_manifest: {
            href: 'https://example.com/v3/spaces/042655eb-6cea-4fd8-ad8b-d03048f95072/actions/apply_manifest',
            method: 'POST',
          },
        },
      },
    ],
  },
};
