import Link from 'next/link';
import { getCFApps } from '../../../api/cloudfoundry/cloudfoundry';

export default async function CloudFoundryAppsPage() {
  try {
    const res = await getCFApps();
    if (res.body) {
      const apps = res.body.resources;
      return (
        <>
          <h1>Your CF Apps</h1>
          <Link href="/cloudfoundry">Back to Cloud Foundry home</Link>
          <ul>
            {apps.map((app) => (
              <li key={app.guid}>{app.name}</li>
            ))}
          </ul>
        </>
      );
    } else {
      return <div role="alert">{res.errors.join(', ')}</div>;
    }
  } catch (error) {
    return <div role="alert">{error.message}</div>;
  }
}
