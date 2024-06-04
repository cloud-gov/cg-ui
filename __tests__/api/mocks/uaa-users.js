// Request /Users?attributes=id,previousLogonTime,verified,active
// Response 200
export const mockUaaUsers = {
  resources: [
    {
      previousLogonTime: 1717424827664,
      verified: true,
      active: true,
      id: '986e21c9-ed0a-480f-9198-23b9a6720518',
    },
    {
      previousLogonTime: null,
      verified: true,
      active: true,
      id: '78e27489-174f-4531-bf76-af0110c25df9',
    },
    {
      previousLogonTime: 1717521383463,
      verified: true,
      active: true,
      id: 'ee1f53d0-cd0f-4801-9aa0-197ec5ad075c',
    },
  ],
};
