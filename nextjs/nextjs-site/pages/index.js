import Link from 'next/link';

export default function Home() {
    return (
        <div>
        <h1>Hello world!</h1>
        <ul>
            <li><Link href="/clientside">Example of clientside rendering</Link></li>
            <li><Link href="/serverside">Example of serverside rendering</Link></li>
        </ul>
        </div>
    );
};
