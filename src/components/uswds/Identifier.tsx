import Image from 'next/image';

export function Identifier() {
  const links = [
    {
      name: 'About GSA',
      url: 'https://www.gsa.gov/about-us',
    },
    {
      name: 'Accessibility statement',
      url: 'https://www.gsa.gov/website-information/accessibility-statement',
    },
    {
      name: 'FOIA requests',
      url: 'https://www.gsa.gov/reference/freedom-of-information-act-foia',
    },
    {
      name: 'No FEAR Act data',
      url: 'https://www.gsa.gov/reference/civil-rights-programs/the-no-fear-act',
    },
    {
      name: 'Office of the Inspector General',
      url: 'https://www.gsaig.gov/',
    },
    {
      name: 'Performance reports',
      url: 'https://www.gsa.gov/reference/reports/budget-performance',
    },
    {
      name: 'Privacy policy',
      url: 'https://www.gsa.gov/website-information/website-policies',
    },
  ];

  return (
    <div className="usa-identifier">
      <section
        className="usa-identifier__section usa-identifier__section--masthead"
        aria-label="Agency identifier,"
      >
        <div className="usa-identifier__container">
          <div className="usa-identifier__logos">
            <a href="" className="usa-identifier__logo">
              <Image
                className="usa-identifier__logo-img"
                src="/img/logos/gsa-logo.png"
                role="img"
                alt="GSA logo"
                height="48"
                width="48"
              />
            </a>
          </div>
          <section
            className="usa-identifier__identity"
            aria-label="Agency description,"
          >
            <p className="usa-identifier__identity-domain">cloud.gov</p>
            <p className="usa-identifier__identity-disclaimer">
              An official website of the{' '}
              <a href="https://www.gsa.gov">
                U.S. General Services Administration
              </a>
            </p>
          </section>
        </div>
      </section>
      <nav
        className="usa-identifier__section usa-identifier__section--required-links"
        aria-label="Important links,"
      >
        <div className="usa-identifier__container">
          <ul className="usa-identifier__required-links-list">
            {links.map((link) => (
              <li
                className="usa-identifier__required-links-item"
                key={link.url}
              >
                <a
                  href={link.url}
                  className="usa-identifier__required-link usa-link"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <section
        className="usa-identifier__section usa-identifier__section--usagov"
        aria-label="U.S. government information and services,"
      >
        <div className="usa-identifier__container">
          <div className="usa-identifier__usagov-description">
            Looking for U.S. government information and services?
          </div>{' '}
          <a href="https://www.usa.gov/" className="usa-link">
            Visit USA.gov
          </a>
        </div>
      </section>
    </div>
  );
}
