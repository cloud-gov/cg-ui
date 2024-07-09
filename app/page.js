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
              <Link href="/orgs">View all of your organizations</Link>
            </p>
          </div>
        </div>
      </div>

      <h2>Experiments</h2>
      <p>
        Pages in this portion of the app are proof-of-concepts and are not
        guaranteed to persist.
      </p>
      <ul>
        <li>
          <Link href="/prototype/authenticated/example">
            Example of an authenticated page (you can&apos;t get to it unless
            you&apos;re logged in).
          </Link>
        </li>
        <li>
          <Link href="/prototype/clientside">
            Example of clientside rendering
          </Link>
        </li>
        <li>
          <Link href="/prototype/serverside">
            Example of serverside rendering
          </Link>
        </li>
        <li>
          <Link href="/prototype/users">
            Example of dynamic rendering (server-side)
          </Link>
        </li>
        <li>
          <Link href="/prototype/cloudfoundry">Cloudfoundry home</Link>
        </li>
        <li>
          <Link href="/prototype/design-guide">Design guide</Link>
        </li>
      </ul>

      <h3>Database experiment</h3>
      <ul>
        <li>
          <Link href="/prototype/api/table">
            Step 1: create a session table via API request
          </Link>
        </li>
        <li>
          <Link href="/prototype/session">Step 2: Add your name!</Link>
        </li>
      </ul>

      <h4>Database API endpoints</h4>
      <p>You can also interact with the database via API.</p>

      <ul>
        <li>View sessions: curl http://localhost:3000/prototype/api/session</li>
        <li>
          Add session: curl -X POST -d &apos;&#123;&quot;username&quot;:
          &quot;Your name&quot; &#125;&apos;
          http://localhost:3000/prototype/api/session
        </li>
        <li>
          Create session table: curl http://localhost:3000/prototype/api/table
        </li>
        <li>
          Delete session table: curl -X DELETE
          http://localhost:3000/prototype/api/table
        </li>
      </ul>
    </div>
  );
}
