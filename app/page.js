import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Hello world!</h1>
      <ul>
        <li>
          <Link href="/authenticated/example">
            Example of an authenticated page (you can&apos;t get to it unless
            you&apos;re logged in).
          </Link>
        </li>
        <li>
          <Link href="/clientside">Example of clientside rendering</Link>
        </li>
        <li>
          <Link href="/serverside">Example of serverside rendering</Link>
        </li>
        <li>
          <Link href="/users">Example of dynamic rendering (server-side)</Link>
        </li>
        <li>
          <Link href="/cloudfoundry">Cloudfoundry home</Link>
        </li>
        <li>
          <Link href="/design-guide">Design guide</Link>
        </li>
      </ul>

      <h2>Database experiment</h2>
      <ul>
        <li>
          <Link href="/api/table">
            Step 1: create a session table via API request
          </Link>
        </li>
        <li>
          <Link href="/session">Step 2: Add your name!</Link>
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
