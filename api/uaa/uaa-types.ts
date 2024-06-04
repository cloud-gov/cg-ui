// Note: there are more fields available for users if needed
// https://docs.cloudfoundry.org/api/uaa/version/77.10.0/index.html#get
export type UsersFieldList =
  | 'id'
  | 'userName'
  | 'emails'
  | 'active'
  | 'verified'
  | 'origin'
  | 'previousLogonTime';
