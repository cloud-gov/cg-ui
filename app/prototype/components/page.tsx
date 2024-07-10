import { Users } from '@/components/Users';

const mockUsers = [{ name: 'foo name' }];

export default function TestComponentPage() {
  return (
    <>
      <Users users={mockUsers}>{/* <UserOrgRoles></UserOrgRoles> */}</Users>
    </>
  );
}
