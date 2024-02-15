import { Suspense, useEffect, useState } from 'react';

import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { getUsers } from '../api/users';

function Users() {
    const [users, setUsers] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedResult = await getUsers();
                if (!dataLoaded) setUsers(fetchedResult);
            } catch (error) {
                console.log(error)
            }
            setDataLoaded(true);
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
