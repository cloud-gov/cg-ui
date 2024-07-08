import { UserLogonInfoDisplay } from '@/controllers/controller-types';

export interface UserLogonResponse {
  timestamp: string;
  total_accounts: number;
  user_summary: UserLogonInfoById;
}

export interface UserLogonInfoById {
  [userId: string]: UserLogonInfoDisplay;
}
