import Link from 'next/link';

export default function CloudFoundryPage() {
    return(
        <>
            <h1>Cloud Foundry Functions</h1>
            <ul>
                <li><Link href="/cloudfoundry/apps">apps list</Link></li>
            </ul>
        </>
    );
};
