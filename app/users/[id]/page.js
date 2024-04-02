import { getUser } from '../../../api/users';

export default async function UserPage({ params }) {
  try {
    const user = await getUser(params.id);
    return <div>{user.name}</div>;
  } catch (err) {
    return <div>{err.message}</div>;
  }
}
