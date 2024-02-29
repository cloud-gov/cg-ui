import { getUsers } from '../api/users';

export const getServerSideProps = async () => {
    try {
        const users = await getUsers();
        return {
            props: { users }
        }
    } catch (error) {
        return {
            props: { error }
        }
    }
}

const Serverside = ({users = [], error = null}) => {
    if (error) {
        return(
            <div role='alert'>{ error.message }</div>
        )
    }
    return (
        <ul>{users.map(user => (
            <li key={user.id}>{user.name}</li>
        ))}</ul>
    )
}

export default Serverside;

