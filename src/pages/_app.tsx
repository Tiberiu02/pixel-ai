import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    if (typeof navigator.serviceWorker !== "undefined") {
      navigator.serviceWorker.register("sw.js");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Pixel.ai</title>
        <link rel="icon" href="/logo.png" />
        <link rel="manifest" href="/app.webmanifest" />
        <link rel="apple-touch-icon" href="/logo.png"></link>
        <meta
          name="theme-color"
          content="#000"
          media="(prefers-color-scheme: dark)"
        />
      </Head>
      <main className="relative h-screen w-screen select-none overflow-auto bg-gradient-to-b from-zinc-900 to-black text-white">
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </main>
    </>
  );
};

export default trpc.withTRPC(MyApp);
