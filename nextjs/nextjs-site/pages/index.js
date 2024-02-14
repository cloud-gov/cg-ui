import { Suspense } from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { getUsers } from '../api/users';

async function Users() {
    const users = await getUsers();

    return (
        <ul>{ users.map(user => (
            <li key={user.id}>{ user.name }</li>
        ))}</ul>
    )
}

export default function Home() {
    return (<Users />)
};
