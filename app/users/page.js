import Link from 'next/link';
import { getUsers } from '../../api/users';

export default async function UsersPage() {
  let users;
  try {
    users = await getUsers();
  } catch (err) {
    return <div>{err.message}</div>;
  }

  return (
    <>
      <h1>users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
