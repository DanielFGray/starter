import { CrownOutlined, DownOutlined } from "@ant-design/icons";
import { QueryResult } from "@apollo/react-common";
import { useApolloClient } from "@apollo/react-hooks";
import { companyName, projectName } from "@app/config";
import {
  SharedLayout_QueryFragment,
  SharedLayout_UserFragment,
  useCurrentUserUpdatedSubscription,
  useLogoutMutation,
} from "@app/graphql";
import { Listbox, Transition } from "@headlessui/react";
import { Avatar, Col, Dropdown, Layout, Menu, Row, Typography } from "antd";
import { ApolloError } from "apollo-client";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import * as React from "react";

import { ErrorAlert, H3, StandardWidth, Warn } from ".";
import { Redirect } from "./Redirect";

const { useCallback, useState } = React;
const { Header, Content, Footer } = Layout;
const { Text } = Typography;
/*
 * For some reason, possibly related to the interaction between
 * `babel-plugin-import` and https://github.com/babel/babel/pull/9766, we can't
 * directly export these values, but if we reference them and re-export then we
 * can.
 *
 * TODO: change back to `export { Row, Col, Link }` when this issue is fixed.
 */
const _babelHackRow = Row;
const _babelHackCol = Col;
export { _babelHackCol as Col, Link, _babelHackRow as Row };

export const contentMinHeight = "calc(100vh - 64px - 70px)";

export interface SharedLayoutChildProps {
  error?: ApolloError | Error;
  loading: boolean;
  currentUser?: SharedLayout_UserFragment | null;
}

export enum AuthRestrict {
  NEVER = 0,
  LOGGED_OUT = 1 << 0,
  LOGGED_IN = 1 << 1,
  NOT_ADMIN = 1 << 2,
}

export interface SharedLayoutProps {
  /*
   * We're expecting lots of different queries to be passed through here, and
   * for them to have this common required data we need. Methods like
   * `subscribeToMore` are too specific (and we don't need them) so we're going
   * to drop them from the data requirements.
   *
   * NOTE: we're not fetching this query internally because we want the entire
   * page to be fetchable via a single GraphQL query, rather than multiple
   * chained queries.
   */
  query: Pick<
    QueryResult<SharedLayout_QueryFragment>,
    "data" | "loading" | "error" | "networkStatus" | "client" | "refetch"
  >;

  title: string;
  titleHref?: string;
  titleHrefAs?: string;
  children:
    | React.ReactNode
    | ((props: SharedLayoutChildProps) => React.ReactNode);
  noPad?: boolean;
  noHandleErrors?: boolean;
  forbidWhen?: AuthRestrict;
}

/* The Apollo `useSubscription` hook doesn't currently allow skipping the
 * subscription; we only want it when the user is logged in, so we conditionally
 * call this stub component.
 */
function CurrentUserUpdatedSubscription() {
  /*
   * This will set up a GraphQL subscription monitoring for changes to the
   * current user. Interestingly we don't need to actually _do_ anything - no
   * rendering or similar - because the payload of this mutation will
   * automatically update Apollo's cache which will cause the data to be
   * re-rendered wherever appropriate.
   */
  useCurrentUserUpdatedSubscription();
  return null;
}

export function SharedLayout({
  title,
  titleHref,
  titleHrefAs,
  noPad = false,
  noHandleErrors = false,
  query,
  forbidWhen = AuthRestrict.NEVER,
  children,
}: SharedLayoutProps) {
  const router = useRouter();
  const currentUrl = router.asPath;
  const client = useApolloClient();
  const [logout] = useLogoutMutation();
  const handleLogout = useCallback(() => {
    const reset = async () => {
      Router.events.off("routeChangeComplete", reset);
      try {
        await logout();
        client.resetStore();
      } catch (e) {
        console.error(e);
        // Something went wrong; redirect to /logout to force logout.
        window.location.href = "/logout";
      }
    };
    Router.events.on("routeChangeComplete", reset);
    Router.push("/");
  }, [client, logout]);
  const forbidsLoggedIn = forbidWhen & AuthRestrict.LOGGED_IN;
  const forbidsLoggedOut = forbidWhen & AuthRestrict.LOGGED_OUT;
  const forbidsNotAdmin = forbidWhen & AuthRestrict.NOT_ADMIN;
  const renderChildren = (props: SharedLayoutChildProps) => {
    const inner =
      props.error && !props.loading && !noHandleErrors ? (
        <>
          {process.env.NODE_ENV === "development" ? (
            <ErrorAlert error={props.error} />
          ) : null}
        </>
      ) : typeof children === "function" ? (
        children(props)
      ) : (
        children
      );
    if (
      data &&
      data.currentUser &&
      (forbidsLoggedIn || (forbidsNotAdmin && !data.currentUser.isAdmin))
    ) {
      return (
        <StandardWidth>
          <Redirect href={"/"} />
        </StandardWidth>
      );
    } else if (
      data &&
      data.currentUser === null &&
      !loading &&
      !error &&
      forbidsLoggedOut
    ) {
      return (
        <Redirect href={`/login?next=${encodeURIComponent(router.asPath)}`} />
      );
    }

    return noPad ? inner : <StandardWidth>{inner}</StandardWidth>;
  };
  const { data, loading, error } = query;

  return (
    <Layout>
      {data && data.currentUser ? <CurrentUserUpdatedSubscription /> : null}
      <Header
        style={{
          boxShadow: "0 2px 8px #f0f1f2",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <Head>
          <title>{title ? `${title} — ${projectName}` : projectName}</title>
        </Head>
        <Row justify="space-between">
          <Col span={6}>
            <Link href="/">
              <a>{projectName}</a>
            </Link>
          </Col>
          <Col span={12}>
            <H3
              style={{
                margin: 0,
                padding: 0,
                textAlign: "center",
                lineHeight: "64px",
              }}
              data-cy="layout-header-title"
            >
              {titleHref ? (
                <Link href={titleHref} as={titleHrefAs}>
                  <a data-cy="layout-header-titlelink">{title}</a>
                </Link>
              ) : (
                title
              )}
            </H3>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            {data && data.currentUser ? (
              <Dropdown
                overlay={
                  <Menu>
                    {data.currentUser.organizationMemberships.nodes.map(
                      ({ organization, isOwner }) => (
                        <Menu.Item key={organization?.id}>
                          <Link
                            href={`/o/[slug]`}
                            as={`/o/${organization?.slug}`}
                          >
                            <a>
                              {organization?.name}
                              {isOwner ? (
                                <span>
                                  {" "}
                                  <CrownOutlined />
                                </span>
                              ) : (
                                ""
                              )}
                            </a>
                          </Link>
                        </Menu.Item>
                      )
                    )}
                    <Menu.Item>
                      <Link href="/create-organization">
                        <a data-cy="layout-link-create-organization">
                          Create organization
                        </a>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link href="/settings">
                        <a data-cy="layout-link-settings">
                          <Warn okay={data.currentUser.isVerified}>
                            Settings
                          </Warn>
                        </a>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <a onClick={handleLogout}>Logout</a>
                    </Menu.Item>
                  </Menu>
                }
              >
                <span
                  data-cy="layout-dropdown-user"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <Avatar>
                    {(data.currentUser.name && data.currentUser.name[0]) || "?"}
                  </Avatar>
                  <Warn okay={data.currentUser.isVerified}>
                    <span style={{ marginLeft: 8, marginRight: 8 }}>
                      {data.currentUser.name}
                    </span>
                    <DownOutlined />
                  </Warn>
                </span>
              </Dropdown>
            ) : forbidsLoggedIn ? null : (
              <Link href={`/login?next=${encodeURIComponent(currentUrl)}`}>
                <a data-cy="header-login-button">Sign in</a>
              </Link>
            )}
          </Col>
        </Row>
      </Header>
      <Content style={{ minHeight: contentMinHeight }}>
        {renderChildren({
          error,
          loading,
          currentUser: data?.currentUser,
        })}
      </Content>
      <Footer>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Text>
            Copyright &copy; {new Date().getFullYear()} {companyName}. All
            rights reserved.
            {process.env.T_AND_C_URL ? (
              <span>
                {" "}
                <a
                  style={{ textDecoration: "underline" }}
                  href={process.env.T_AND_C_URL}
                >
                  Terms and conditions
                </a>
              </span>
            ) : null}
          </Text>
          <Text>
            Powered by{" "}
            <a
              style={{ textDecoration: "underline" }}
              href="https://graphile.org/postgraphile"
            >
              PostGraphile
            </a>
          </Text>
        </div>
      </Footer>
    </Layout>
  );
}

export function DashLayout({
  title = "",
  titleHref,
  titleHrefAs,
  noPad = false,
  noHandleErrors = false,
  query,
  forbidWhen = AuthRestrict.NEVER,
  children,
}: SharedLayoutProps) {
  const [menuVisible, _menuVisible$] = useState(false);
  const toggleMenu = useCallback(() => _menuVisible$((s) => !s), []);
  const router = useRouter();
  const currentUrl = router.asPath;
  const client = useApolloClient();
  const [logout] = useLogoutMutation();
  const handleLogout = useCallback(() => {
    const reset = async () => {
      Router.events.off("routeChangeComplete", reset);
      try {
        await logout();
        client.resetStore();
      } catch (e) {
        console.error(e);
        // Something went wrong; redirect to /logout to force logout.
        window.location.href = "/logout";
      }
    };
    Router.events.on("routeChangeComplete", reset);
    Router.push("/");
  }, [client, logout]);
  const forbidsLoggedIn = forbidWhen & AuthRestrict.LOGGED_IN;
  const forbidsLoggedOut = forbidWhen & AuthRestrict.LOGGED_OUT;
  const forbidsNotAdmin = forbidWhen & AuthRestrict.NOT_ADMIN;
  const renderChildren = (props: SharedLayoutChildProps) => {
    const inner =
      props.error && !props.loading && !noHandleErrors ? (
        <>
          {process.env.NODE_ENV === "development" ? (
            <ErrorAlert error={props.error} />
          ) : null}
        </>
      ) : typeof children === "function" ? (
        children(props)
      ) : (
        children
      );
    if (
      data?.currentUser &&
      (forbidsLoggedIn || (forbidsNotAdmin && data.currentUser.role !== "ADMIN"))
    ) {
      return (
        <StandardWidth>
          <Redirect href={"/"} />
        </StandardWidth>
      );
    } else if (
      data?.currentUser === null &&
      !loading &&
      !error &&
      forbidsLoggedOut
    ) {
      return (
        <Redirect href={`/login?next=${encodeURIComponent(router.asPath)}`} />
      );
    }

    return inner;
  };
  const { data, loading, error } = query;

  return (
    <div>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
        {/* Top nav*/}
        <header className="relative flex items-center flex-shrink-0 h-16 bg-white">
          {/* Logo area */}
          <div className="absolute inset-y-0 left-0 md:static md:flex-shrink-0">
            <a
              href="#"
              className="flex items-center justify-center w-16 h-16 bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:w-20"
            >
              <img
                className="w-auto h-8"
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                alt="Workflow"
              />
            </a>
          </div>

          {/* Menu button area */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 md:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 -mr-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              aria-expanded="false"
              onClick={() => toggleMenu()}
            >
              <span className="sr-only">Open main menu</span>
              {/* Heroicon name: outline/menu */}
              <svg
                className="block w-6 h-6"
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
          {/* Desktop nav area */}
          <div className="hidden md:min-w-0 md:flex-1 md:flex md:items-center md:justify-between">
            <div className="flex items-center flex-shrink-0 pr-4 ml-10 space-x-10">
              <nav aria-label="Global" className="flex space-x-10">
                <Link href="#">
                  <a className="text-sm font-medium text-gray-900">Inboxes</a>
                </Link>
                <Link href="#">
                  <a className="text-sm font-medium text-gray-900">Reporting</a>
                </Link>
                <Link href="/settings">
                  <a className="text-sm font-medium text-gray-900">Settings</a>
                </Link>
              </nav>
              <div className="flex items-center space-x-8">
                <span className="inline-flex">
                  <a
                    href="#"
                    className="p-1 -mx-1 text-gray-400 bg-white rounded-full hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    {/* Heroicon name: outline/bell */}
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </a>
                </span>
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                    id="menu-1"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => toggleMenu()}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                  {/* Dropdown menu, show/hide based on menu state.  */}
                  <Transition
                    show={menuVisible}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div
                      className="absolute right-0 z-30 w-56 mt-2 bg-white shadow-lg origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-1"
                    >
                      <div className="py-1">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                          role="menuitem"
                        >
                          Your Profile
                        </a>
                        <Link href="/logout">
                          <a
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                            role="menuitem"
                          >
                            Sign Out
                          </a>
                        </Link>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile menu, show/hide this `div` based on menu open/closed state */}
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Off-canvas menu overlay, show/hide based on off-canvas menu state. */}
            <Transition
              show={menuVisible}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="hidden sm:block sm:fixed sm:inset-0 md:hidden"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-600 opacity-75" />
              </div>
            </Transition>
            {/* Mobile menu, toggle classes based on menu state. */}
            <Transition
              show={menuVisible}
              enter="transition ease-out duration-150 sm:ease-in-out sm:duration-300"
              enterFrom="transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100"
              enterTo="transform opacity-100 scale-100  sm:translate-x-0 sm:scale-100 sm:opacity-100"
              leave="transition ease-in duration-150 sm:ease-in-out sm:duration-300"
              leaveFrom="transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100"
              leaveTo="transform opacity-0 scale-110  sm:translate-x-full sm:scale-100 sm:opacity-100"
            >
              <nav
                className="fixed inset-0 z-40 w-full h-full bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:max-w-sm sm:w-full sm:shadow-lg md:hidden"
                aria-label="Global"
              >
                <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                  <a href="#">
                    <img
                      className="block w-auto h-8"
                      src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500"
                      alt="Workflow"
                    />
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 -mr-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    aria-expanded="false"
                    onClick={() => toggleMenu()}
                  >
                    <span className="sr-only">Open main menu</span>
                    {/* Heroicon name: outline/x */}
                    <svg
                      className="block w-6 h-6"
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
                <div className="px-2 py-3 mx-auto max-w-8xl sm:px-4">
                  <Link href="#">
                    <a className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                      Inboxes
                    </a>
                  </Link>
                  <Link href="#">
                    <a className="block py-2 pl-5 pr-3 text-base font-medium text-gray-500 rounded-md hover:bg-gray-100">
                      Technical Support
                    </a>
                  </Link>
                  <Link href="#">
                    <a className="block py-2 pl-5 pr-3 text-base font-medium text-gray-500 rounded-md hover:bg-gray-100">
                      Sales
                    </a>
                  </Link>
                  <Link href="#">
                    <a className="block py-2 pl-5 pr-3 text-base font-medium text-gray-500 rounded-md hover:bg-gray-100">
                      General
                    </a>
                  </Link>
                  <Link href="#">
                    <a className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100">
                      Reporting
                    </a>
                  </Link>
                  <Link href="/settings">
                    <a
                      href="/settings"
                      className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-100"
                    >
                      Settings
                    </a>
                  </Link>
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4 mx-auto max-w-8xl sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        className="w-10 h-10 rounded-full"
                        src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0 ml-3">
                      <div className="text-base font-medium text-gray-800 truncate">
                        Whitney Francis
                      </div>
                      <div className="text-sm font-medium text-gray-500 truncate">
                        whitneyfrancis@example.com
                      </div>
                    </div>
                    <Link href="#">
                      <a className="flex-shrink-0 p-2 ml-auto text-gray-400 bg-white hover:text-gray-500">
                        <span className="sr-only">View notifications</span>
                        {/* Heroicon name: outline/bell */}
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
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </a>
                    </Link>
                  </div>
                  <div className="px-2 mx-auto mt-3 max-w-8xl space-y-1 sm:px-4">
                    <Link href="#">
                      <a className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50">
                        Your Profile
                      </a>
                    </Link>
                    <Link href="/logout">
                      <a className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50">
                        Sign out
                      </a>
                    </Link>
                  </div>
                </div>
              </nav>
            </Transition>
          </div>
        </header>
        {/* Bottom section */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Narrow sidebar*/}
          <nav
            aria-label="Sidebar"
            className="hidden md:block md:flex-shrink-0 md:bg-gray-800 md:overflow-y-auto"
          >
            <div className="relative flex flex-col w-20 p-3 space-y-3">
              <Link href="#">
                <a className="inline-flex items-center justify-center flex-shrink-0 text-white bg-gray-900 rounded-lg h-14 w-14">
                  <span className="sr-only">Open</span>
                  {/* Heroicon name: outline/inbox */}
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </a>
              </Link>
              <Link href="#">
                <a className="inline-flex items-center justify-center flex-shrink-0 text-gray-400 rounded-lg hover:bg-gray-700 h-14 w-14">
                  <span className="sr-only">Archive</span>
                  {/* Heroicon name: outline/archive */}
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
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </a>
              </Link>
              <Link href="#">
                <a className="inline-flex items-center justify-center flex-shrink-0 text-gray-400 rounded-lg hover:bg-gray-700 h-14 w-14">
                  <span className="sr-only">Customers</span>
                  {/* Heroicon name: outline/user-circle */}
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
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </a>
              </Link>
              <Link href="#">
                <a className="inline-flex items-center justify-center flex-shrink-0 text-gray-400 rounded-lg hover:bg-gray-700 h-14 w-14">
                  <span className="sr-only">Flagged</span>
                  {/* Heroicon name: outline/flag */}
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
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                </a>
              </Link>
              <Link href="#">
                <a className="inline-flex items-center justify-center flex-shrink-0 text-gray-400 rounded-lg hover:bg-gray-700 h-14 w-14">
                  <span className="sr-only">Spam</span>
                  {/* Heroicon name: outline/ban */}
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
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </a>
              </Link>
              <Link href="#">
                <a className="inline-flex items-center justify-center flex-shrink-0 text-gray-400 rounded-lg hover:bg-gray-700 h-14 w-14">
                  <span className="sr-only">Drafts</span>
                  {/* Heroicon name: outline/pencil-alt */}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </nav>
          {/* Main area */}
          <main className="flex-1 min-w-0 overflow-auto border-t border-gray-200 lg:flex">
            {renderChildren({
              error,
              loading,
              currentUser: data && data.currentUser,
            })}
          </main>
        </div>
      </div>
    </div>
  );
}
