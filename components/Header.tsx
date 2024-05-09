import { cookies } from 'next/headers';
import { LoginButton } from './auth/LoginButton';
import { LogoutButton } from './auth/LogoutButton';

export function Header() {
  const cookieStore = cookies();
  const authSession = cookieStore.get('authsession');

  return (
    <header className="usa-header usa-header--basic">
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <div className="usa-logo">
            <em className="usa-logo__text">
              <a href="/" title="cloud.gov">
                cloud.gov
              </a>
            </em>
          </div>
        </div>
        <nav aria-label="Primary navigation" className="usa-nav">
          <ul className="usa-nav__primary usa-accordion">
            <li className="usa-nav__primary-item">
              {authSession ? <LogoutButton /> : <LoginButton />}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
