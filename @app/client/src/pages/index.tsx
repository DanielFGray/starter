import { DashLayout } from "@app/components";
import { useSharedQuery } from "@app/graphql";
import { NextPage } from "next";
import Link from "next/link";
import * as React from "react";

const Home: NextPage = () => {
  const query = useSharedQuery();
  const currentUser = query.data?.currentUser;
  if (currentUser)
    return (
      <DashLayout title="Welcome to PostGraphile" query={query}>
        <div className="flex flex-row justify-between p-3">
          <div className="items-start grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Left column */}
            <div className="grid grid-cols-1 gap-4 lg:col-span-2">
              <section aria-labelledby="section-1-title">
                <h2 className="sr-only" id="section-1-title">
                  Welcome to PostGraphile
                </h2>
                <div className="overflow-hidden bg-white rounded-lg shadow">
                  <div className="p-6">
                    <article className="prose prose-xl">
                      <p>
                        This project can serve as a basis for your own project.
                        We've added many features that most projects require,
                        but you're free to remove them or replace them with
                        whatever you need.
                      </p>

                      <p>
                        <em>
                          Please read the next few sections before continuing.
                        </em>
                      </p>

                      <h4>Next.js and page load delays: dev only</h4>
                      <p>
                        We use Next.js to serve the React app. This gives us
                        server-side rendering, routing, bundle splitting, hot
                        reloading, and much more. However, in development when
                        you visit a page it must first be loaded from the file
                        system and transpiled and bundled by the server, served
                        to the client, and then executed. This means there can
                        be a small delay when loading a web page for the first
                        time in development. In production, this delay should be
                        vastly smaller, and can be eliminated with pre-fetching.
                        You can read more about this in the{" "}
                        <a href="https://nextjs.org/docs#prefetching-pages">
                          Next.js docs
                        </a>
                      </p>

                      <h4>Page hangs: development only</h4>
                      <p>
                        If the page hangs this is likely because the Next server
                        was restarted. Please reload the page.
                      </p>

                      <h4>Emails</h4>
                      <p>
                        <strong>
                          In development we don't send any emails to real email
                          addresses
                        </strong>
                        , instead all emails are sent to{" "}
                        <a href="http://ethereal.email">ethereal.email</a> where
                        you can browse them. Keep an eye on the terminal; when
                        an email is triggered the server will log a URL to view
                        the email.
                      </p>

                      <h4>
                        <a href="/graphiql">
                          Graph<em>i</em>QL
                        </a>
                      </h4>
                      <p>
                        You can browse the GraphQL API and even issue GraphQL
                        queries using the built in Graph<em>i</em>QL interface
                        located at{" "}
                        <a href="/graphiql">
                          <code>/graphiql</code>
                        </a>
                        .
                      </p>

                      <h4>
                        This page:{" "}
                        <a href="https://github.com/graphile/starter/blob/main/@app/client/src/pages/index.tsx">
                          <code>@app/client/src/pages/index.tsx</code>
                        </a>
                      </h4>
                      <p>
                        If you edit this file and save, the page in the browser
                        should automatically update.
                      </p>

                      <h4>
                        The server:{" "}
                        <a href="https://github.com/graphile/starter/blob/main/@app/server/src/index.ts">
                          <code>@app/server/src/index.ts</code>
                        </a>
                      </h4>
                      <p>
                        This entry point creates an Express.js server and
                        installs a number of middlewares, including
                        PostGraphile.
                      </p>

                      <h4>Initial migration</h4>
                      <p>
                        We use <code>graphile-migrate</code> in this project to
                        manage database migrations; this allows you to change
                        the database very rapidly by just editing the current
                        migration file: <code>migrations/current.sql</code>.
                        This file should be written in an idempotent manner so
                        that it can be ran repeatedly without causing issues.
                      </p>
                      <p>
                        We've committed the first migration for you (which
                        builds the user system), but should you wish to
                        customize this user system the easiest way is to run{" "}
                        <code>yarn db uncommit</code> which will undo this
                        initial migration and move its content back to
                        current.sql for you to modify. Please see{" "}
                        <a href="https://github.com/graphile/migrate/blob/main/README.md">
                          the graphile-migrate documentation
                        </a>
                        .
                      </p>
                      <p>
                        <strong>WARNING</strong>: <code>graphile-migrate</code>{" "}
                        is experimental, you may want to find a different
                        migration solution before putting it into production
                        (your sponsorship will help make this project stable
                        faster).
                      </p>

                      <h4>isAdmin</h4>
                      <p>
                        The <code>isAdmin</code> flag doesn't do anything in
                        this starter, but you can use it in your own
                        applications should you need it.
                      </p>

                      <h4>What now?</h4>
                      <p>
                        To get started, click "Sign in" at the top right, then
                        choose "Create One" to create a new account.
                      </p>
                      <p>
                        When you're happy, you can add database changes to{" "}
                        <code>current.sql</code> and see them reflected in the
                        GraphiQL interface a <a href="/graphiql">/graphiql</a>.
                      </p>

                      <hr />

                      <h3>Further notes</h3>

                      <p>
                        <em>You can read this later.</em> The important things
                        were above; below is additional information worth a read
                        when you're done experimenting.
                      </p>

                      <h4>Making it yours</h4>
                      <p>
                        This project isn't intended to be <code>git clone</code>
                        'd; instead you should start a new git repository with
                        the code from the latest release:
                      </p>
                      <ol>
                        <li>
                          Download and extract a zip of the{" "}
                          <a href="https://github.com/graphile/starter/releases">
                            latest release from GitHub
                          </a>
                        </li>
                        <li>
                          In that folder run:
                          <ul>
                            <li>
                              <code>git init</code>
                            </li>
                            <li>
                              <code>git add .</code>
                            </li>
                            <li>
                              <code>
                                git commit -m "PostGraphile starter base"
                              </code>
                            </li>
                          </ul>
                        </li>
                        <li>
                          Change the project name in <code>package.json</code>
                        </li>
                        <li>
                          Change the project settings in{" "}
                          <code>@app/config/src/index.ts</code>
                        </li>
                        <li>Replace the README.md file</li>
                        <li>Commit as you usually would</li>
                      </ol>
                      <p>
                        We also advise addressing the <code>TODO</code> items in
                        the codebase, particularly the one in{" "}
                        <code>@app/db/scripts/wipe-if-demo</code>
                      </p>

                      <h4>Production readiness</h4>
                      <p>
                        Remember that disabling GraphiQL does not prevent people
                        from issuing arbitrary GraphQL queries against your API.
                        Before you ship, be sure to{" "}
                        <a href="https://www.graphile.org/postgraphile/production/">
                          read the Production Considerations
                        </a>{" "}
                        in the PostGraphile docs. You may consider{" "}
                        <a href="https://www.graphile.org/postgraphile/pricing/">
                          going Pro
                        </a>{" "}
                        as one option for protecting your PostGraphile API;
                        another is to use "stored operations" (a.k.a. "persisted
                        queries").
                      </p>

                      <h4>Realtime</h4>
                      <p>
                        We've configured PostGraphile with{" "}
                        <code>@graphile/pg-pubsub</code> to enable realtime
                        events from the DB; and Apollo is configured to consume
                        them. For example, if you register with email/password
                        you may notice the red dot at the top right indicating
                        that you need to verify your email. If you verify your
                        email in another tab (or even another browser) you
                        should notice that this dot disappears. Realtime ✨🌈
                      </p>

                      <h4>Server-side rendering (SSR)</h4>
                      <p>
                        If you disable JS and reload the page you should see the
                        content is still displayed (this "server-side rendering"
                        is important to ensuring that your users have the best
                        low-latency experience of your website, and that the
                        majority of search engines can index its content).
                      </p>

                      <h4>Duplicate emails</h4>
                      <p>
                        To prevent people blocking legitimate users from
                        registering, we only prevent the same email address
                        being used multiple times when it has been verified by
                        someone. It's up to your application to turn features
                        off/etc when the user does not have any verified email
                        addresses (should you desire this).
                      </p>

                      <h4>Email in production</h4>
                      <p>
                        We've configured the project to use Amazon SES to send
                        emails in production (you will need to create the
                        relevant resources and provide the relevant secrets to
                        use this); however it can easily be reconfigured to use
                        your email transport service of choice.
                      </p>

                      <h4>Validation</h4>
                      <p>
                        We use{" "}
                        <a href="https://ant.design/components/form/">
                          AntD's forms
                        </a>
                        , so validation is provided via these. We've shown how
                        to connect server-side errors into the form validation,
                        for example try registering a new account using the
                        email address of an account{" "}
                        <strong>that has already been verified</strong>.
                      </p>

                      <h4>One-time clone: no such thing as breaking changes</h4>
                      <p>
                        It's expected that you'll do a one-time clone of this
                        project to base your project off, and that you will not
                        keep your project up to date with this one. As such, we
                        can make any changes we like to this project without
                        breaking your project.
                      </p>
                    </article>
                  </div>
                </div>
              </section>
            </div>
            {/* Right column */}
            <div className="grid grid-cols-1 gap-4">
              <section aria-labelledby="section-2-title">
                <h2 className="sr-only" id="section-2-title">
                  Section title
                </h2>
                <div className="overflow-hidden bg-white rounded-lg shadow">
                  <div className="p-6">
                    <h4>PostGraphile relies on your support</h4>
                    <p>A message from Benjie</p>
                    <p>
                      I really hope that this project wows you 😍 and saves you
                      huge amounts of time. I've certainly poured a lot of time
                      into it!
                    </p>
                    <p>
                      Without support from the community Jem and I could not
                      keep building and advancing these open source projects
                      under the hugely flexible MIT license. Please{" "}
                      <a href="https://graphile.org/sponsor">
                        join these amazing people in sponsoring PostGraphile
                      </a>{" "}
                      and related projects.
                    </p>
                    <p>
                      Every contribution helps us to spend more time on open
                      source.
                    </p>
                    <p>Thank you! 🙏</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </DashLayout>
    );
  return (
    <div>
      <div className="relative min-h-screen overflow-hidden bg-gray-800">
        <div
          className="hidden sm:block sm:absolute sm:inset-0"
          aria-hidden="true"
        >
          <svg
            className="absolute bottom-0 right-0 mb-48 text-gray-700 transform translate-x-1/2 lg:top-0 lg:mt-28 lg:mb-0 xl:transform-none xl:translate-x-0"
            width={364}
            height={384}
            viewBox="0 0 364 384"
            fill="none"
          >
            <defs>
              <pattern
                id="eab71dd9-9d7a-47bd-8044-256344ee00d0"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} fill="currentColor" />
              </pattern>
            </defs>
            <rect
              width={364}
              height={384}
              fill="url(#eab71dd9-9d7a-47bd-8044-256344ee00d0)"
            />
          </svg>
        </div>
        <div className="relative pt-6 pb-16 sm:pb-24">
          <nav
            className="relative flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6"
            aria-label="Global"
          >
            <div className="flex items-center flex-1">
              <div className="flex items-center justify-between w-full md:w-auto">
                <a href="#">
                  <span className="sr-only">Workflow</span>
                  <img
                    className="w-auto h-8 sm:h-10"
                    src="https://tailwindui.com/img/logos/workflow-mark-pink-500.svg"
                    alt=""
                  />
                </a>
                <div className="flex items-center -mr-2 md:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white"
                    id="main-menu"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open main menu</span>
                    {/* Heroicon name: outline/menu */}
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="hidden space-x-10 md:flex md:ml-10">
                <a
                  href="#"
                  className="font-medium text-white hover:text-gray-300"
                >
                  Product
                </a>
                <a
                  href="#"
                  className="font-medium text-white hover:text-gray-300"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="font-medium text-white hover:text-gray-300"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="font-medium text-white hover:text-gray-300"
                >
                  Company
                </a>
              </div>
            </div>
            <div className="hidden md:flex">
              <Link href="/login">
                <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700">
                  Log in
                </a>
              </Link>
            </div>
          </nav>
          {/*
              Mobile menu, show/hide based on menu open state.

Entering: "duration-150 ease-out"
From: "opacity-0 scale-95"
To: "opacity-100 scale-100"
Leaving: "duration-100 ease-in"
From: "opacity-100 scale-100"
To: "opacity-0 scale-95"
      */}
          <div className="absolute inset-x-0 top-0 p-2 transition transform origin-top-right md:hidden">
            <div className="overflow-hidden bg-white rounded-lg shadow-md ring-1 ring-black ring-opacity-5">
              <div className="flex items-center justify-between px-5 pt-4">
                <div>
                  <img
                    className="w-auto h-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-pink-600.svg"
                    alt=""
                  />
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
                  >
                    <span className="sr-only">Close menu</span>
                    {/* Heroicon name: outline/x */}
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="main-menu"
              >
                <div className="px-2 pt-2 pb-3 space-y-1" role="none">
                  <a
                    href="#"
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    role="menuitem"
                  >
                    Product
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    role="menuitem"
                  >
                    Features
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    role="menuitem"
                  >
                    Marketplace
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                    role="menuitem"
                  >
                    Company
                  </a>
                </div>
                <div role="none">
                  <a
                    href="#"
                    className="block w-full px-5 py-3 font-medium text-center text-pink-600 bg-gray-50 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </div>
          <main className="mt-16 sm:mt-24">
            <div className="mx-auto max-w-7xl">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                  <div>
                    <a
                      href="#"
                      className="inline-flex items-center p-1 pr-2 text-white bg-gray-900 rounded-full sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
                    >
                      <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-pink-500 rounded-full">
                        We're hiring
                      </span>
                      <span className="ml-4 text-sm">
                        Visit our careers page
                      </span>
                      {/* Heroicon name: solid/chevron-right */}
                      <svg
                        className="w-5 h-5 ml-2 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                      <span className="md:block">Data to enrich your</span>
                      <span className="text-pink-400 md:block">
                        online business
                      </span>
                    </h1>
                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      Anim aute id magna aliqua ad ad non deserunt sunt. Qui
                      irure qui lorem cupidatat commodo. Elit sunt amet fugiat
                      veniam occaecat fugiat aliqua ad ad non deserunt sunt.
                    </p>
                    <p className="mt-8 text-sm font-semibold tracking-wide text-white uppercase sm:mt-10">
                      Used by
                    </p>
                    <div className="w-full mt-5 sm:mx-auto sm:max-w-lg lg:ml-0">
                      <div className="flex flex-wrap items-start justify-between">
                        <div className="flex justify-center px-1">
                          <img
                            className="h-9 sm:h-10"
                            src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
                            alt="Tuple"
                          />
                        </div>
                        <div className="flex justify-center px-1">
                          <img
                            className="h-9 sm:h-10"
                            src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"
                            alt="Workcation"
                          />
                        </div>
                        <div className="flex justify-center px-1">
                          <img
                            className="h-9 sm:h-10"
                            src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
                            alt="StaticKit"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
                  <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
                    <div className="px-4 py-8 sm:px-10">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Sign in with
                        </p>
                        <div className="mt-1 grid grid-cols-3 gap-3">
                          <div>
                            <a
                              href="#"
                              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                            >
                              <span className="sr-only">
                                Sign in with Facebook
                              </span>
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                          </div>
                          <div>
                            <a
                              href="#"
                              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                            >
                              <span className="sr-only">
                                Sign in with Twitter
                              </span>
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            </a>
                          </div>
                          <div>
                            <Link href={`/auth/github?next=${encodeURIComponent('/')}`}>
                            <a
                              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                            >
                              <span className="sr-only">
                              Sign in with GitHub
                              </span>
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                  clipRule="evenodd"
                                />
                                </svg>
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6">
                        <div
                          className="absolute inset-0 flex items-center"
                          aria-hidden="true"
                        >
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 text-gray-500 bg-white">
                            Or
                          </span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <form action="#" method="POST" className="space-y-6">
                          <div>
                            <label htmlFor="name" className="sr-only">
                              Full name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              autoComplete="name"
                              placeholder="Full name"
                              required
                              className="block w-full border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="mobile-or-email"
                              className="sr-only"
                            >
                              Mobile number or email
                            </label>
                            <input
                              type="text"
                              name="mobile-or-email"
                              id="mobile-or-email"
                              autoComplete="email"
                              placeholder="Mobile number or email"
                              required
                              className="block w-full border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="password" className="sr-only">
                              Password
                            </label>
                            <input
                              id="password"
                              name="password"
                              type="password"
                              placeholder="Password"
                              autoComplete="current-password"
                              required
                              className="block w-full border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                            />
                          </div>
                          <div>
                            <button
                              type="submit"
                              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                              Create your account
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="px-4 py-6 border-t-2 border-gray-200 bg-gray-50 sm:px-10">
                      <p className="text-xs text-gray-500 leading-5">
                        {"By signing up, you agree to our "}
                        <a
                          href="#"
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Terms
                        </a>
                        {", "}
                        <a
                          href="#"
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Data Policy
                        </a>
                        {" and "}
                        <a
                          href="#"
                          className="font-medium text-gray-900 hover:underline"
                        >
                          Cookies Policy
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
