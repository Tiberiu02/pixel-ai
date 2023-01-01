import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Pixel.AI</title>
        <link rel="icon" href="/logo.png" />
        <link rel="manifest" href="/app.webmanifest" />
        <link rel="apple-touch-icon" href="/logo.png"></link>
        <meta
          name="theme-color"
          content="#000"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <main className="h-screen w-screen select-none overflow-auto bg-gradient-to-b from-zinc-900 to-black text-white">
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </main>
    </>
  );
};

export default trpc.withTRPC(MyApp);
