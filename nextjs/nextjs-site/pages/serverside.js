import { getUsers } from '../api/users';

export const getServerSideProps = async () => {
    const users = await getUsers();
    return {
        props: { users }
    }
}

const Serverside = ({users = []}) => {
    return (
        <ul>{users.map(user => (
            <li key={user.id}>{user.name}</li>
        ))}</ul>
    )
}

export default Serverside;

