import Link from "next/link";
import { Metadata } from "next";
import { Form } from "./form";

export const metadata = {
  title: "iron-session example",
};

export default function AppRouterSWR() {
  return (
    <main className="p-10 space-y-5">
      <h1>Iron session example</h1>

      <p className="italic max-w-xl">
        <u>How to test</u>: Login and refresh the page to see iron-session in
        action. Bonus: open multiple tabs to see the state being reflected by
        SWR automatically.
      </p>

      <div className="grid grid-cols-1 gap-4 p-10 border border-slate-500 rounded-md max-w-xl">
        <Form />
        <div className="space-y-2">
          <hr />
          <p>
            The following pages are protected and will redirect back here if
            you&apos;re not logged in:
          </p>
          {/* convert the following paragraphs into a ul li */}
          <ul className="list-disc list-inside">
            <li>
              <Link
                href="/protected-pages/protected-client"
              >
                Protected page via client component →
              </Link>
            </li>
            <li>
              <Link
                href="/protected-pages/protected-server"
                // required to avoid caching issues when navigating between tabs/windows
                prefetch={false}
              >
                Protected page via server component →
              </Link>{" "}
            </li>
            <li>
              <Link
                href="/protected-pages/protected-middleware"
              >
                Protected page via middleware →
              </Link>{" "}
            </li>
          </ul>
        </div>
      </div>

      <p>Get the code at <a href="https://github.com/vvo/iron-session/tree/main/examples/next/src/app/app-router-client-component-route-handler-swr">iron-session/examples</a></p>
      <HowItWorks />
    </main>
  );
}

function HowItWorks() {
  return (
    <details className="max-w-2xl space-y-4">
      <summary className="cursor-pointer">How it works</summary>

      <ol className="list-decimal list-inside">
        <li>
          During login, the form is submitted with SWR&apos;s{" "}
          <a
            href="https://swr.vercel.app/docs/mutation#useswrmutation"
          >
            useSWRMutation
          </a>
          . This makes a POST /session request using fetch.
        </li>
        <li>
          {" "}
          During logout, the form is submitted with SWR&apos;s{" "}
          <a
            href="https://swr.vercel.app/docs/mutation#useswrmutation"
          >
            useSWRMutation
          </a>
          . This makes a DELETE /session request using fetch.
        </li>
        <li>
          In all other places, the content of the session is optimistally
          rendered using the most recent value, and never gets outdated. This is
          automatically handled by SWR using mutations and revalidation.
        </li>
      </ol>
    </details>
  );
}
