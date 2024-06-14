import Link from 'next/link';
import { cookies } from 'next/headers';
import { LoginButton } from '@/components/auth/LoginButton';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default function Home() {
  const cookieStore = cookies();
  const authSession = cookieStore.get('authsession');
  return (
    <div className="margin-x-3">
      <h1>Welcome to the cloud.gov dashboard prototype</h1>

      <div
        className="usa-summary-box"
        role="region"
        aria-labelledby="summary-box-key-information"
      >
        <div className="usa-summary-box__body">
          <h4
            className="usa-summary-box__heading"
            id="summary-box-key-information"
          >
            Usability testing
          </h4>
          <div className="usa-summary-box__text">
            {authSession ? <LogoutButton /> : <LoginButton />}
            <p>
              <Link href="/orgs/470bd8ff-ed0e-4d11-95c4-cf765202cebd">
                18f-stratos-rebuild org page
              </Link>
            </p>
            <p>
              To view a different org page, go to <strong>/orgs/[orgId]</strong>
            </p>
          </div>
        </div>
      </div>

      <h2>Test routes</h2>
      <ul>
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
