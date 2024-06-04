import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>test routes</h1>
      <ul>
        <li>
          To test a Cf org page, go to <strong>/orgs/[orgId]</strong>
        </li>
        <li>
          <Link href="/test/authenticated/example">
            Example of an authenticated page (you can&apos;t get to it unless
            you&apos;re logged in).
          </Link>
        </li>
        <li>
          <Link href="/test/clientside">Example of clientside rendering</Link>
        </li>
        <li>
          <Link href="/test/serverside">Example of serverside rendering</Link>
        </li>
        <li>
          <Link href="/test/users">
            Example of dynamic rendering (server-side)
          </Link>
        </li>
        <li>
          <Link href="/test/cloudfoundry">Cloudfoundry home</Link>
        </li>
        <li>
          <Link href="/test/design-guide">Design guide</Link>
        </li>
      </ul>

      <h2>Database experiment</h2>
      <ul>
        <li>
          <Link href="/test/api/table">
            Step 1: create a session table via API request
          </Link>
        </li>
        <li>
          <Link href="/test/session">Step 2: Add your name!</Link>
        </li>
      </ul>

      <h3>API endpoints</h3>
      <p>You can also interact with the database via API.</p>

      <ul>
        <li>View sessions: curl http://localhost:3000/test/api/session</li>
        <li>
          Add session: curl -X POST -d &apos;&#123;&quot;username&quot;:
          &quot;Your name&quot; &#125;&apos;
          http://localhost:3000/test/api/session
        </li>
        <li>Create session table: curl http://localhost:3000/test/api/table</li>
        <li>
          Delete session table: curl -X DELETE
          http://localhost:3000/test/api/table
        </li>
      </ul>
    </div>
  );
}
