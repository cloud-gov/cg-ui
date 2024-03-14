import { Suspense } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "../lib";
import Link from "next/link";

async function getSession() {
  const session = await getIronSession(cookies(), sessionOptions);

  return session;
}

export default function ProtectedServer() {
  return (
    <main className="p-10 space-y-5">
      <h1>Protected server page</h1>
      <Suspense fallback={<p className="text-lg">Loading...</p>}>
        <Content />
      </Suspense>
      <p>
        <Link
          href="/protected-pages"
        >
          ← Back
        </Link>
      </p>
    </main>
  );
}

async function Content() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect("/protected-pages");
  }

  return (
    <div className="max-w-xl space-y-2">
      <p>
        Hello <strong>{session.username}!</strong>
      </p>
      <p>
        This page is protected and can only be accessed if you are logged in.
        Otherwise you will be redirected to the login page.
      </p>
      <p>The check is done via a server component.</p>
    </div>
  );
}
