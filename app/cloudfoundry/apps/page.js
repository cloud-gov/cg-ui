import Link from 'next/link';
import { getCFApps } from '../../../api/cloudfoundry';

export default async function CloudFoundryAppsPage() {
  try {
    const apps = await getCFApps();
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
  } catch (error) {
    return <div role="alert">{error.message}</div>;
  }
}
