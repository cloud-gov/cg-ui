import { getUsers } from '../../api/users';

export default async function Serverside() {
    try {
        const users = await getUsers();
        return (
            <ul>{users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}</ul>
        )
    } catch (error) {
        return(
            <div role='alert'>{ error.message }</div>
        )
    }
}
