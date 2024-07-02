export interface UserLogonInfo {
  timestamp: string;
  total_accounts: number;
  user_summary: UserLogonInfoById;
}

export interface UserLogonInfoById {
  [userId: string]: UAAUser;
}

export interface UAAUser {
  userName: string;
  active: boolean;
  lastLogonTime: number;
  idlastLogonTimePretty: string;
}
