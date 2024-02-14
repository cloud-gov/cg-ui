import { Suspense, useEffect, useState } from 'react';

import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { getUsers } from '../api/users';

function Users() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        let fetchHappened = false;
        const fetchUsers = async () => {
            try {
                const fetchedResult = await getUsers();
                if (!fetchHappened) setUsers(fetchedResult);
            } catch (error) {
                console.log(error)
            }
            fetchHappened = true;
        }
        fetchUsers();
    })

    return (
        <ul>{users.map(user => (
            <li key={user.id}>{user.name}</li>
        ))}</ul>
    )
}

export default function Home() {
    return (<Users />)
};
