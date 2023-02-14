import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

declare global {
  interface Window {
    hj: { q: any[] } & (() => void);
    _hjSettings: { hjid: number; hjsv: number };
  }
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    if (typeof navigator.serviceWorker !== "undefined") {
      navigator.serviceWorker.register("sw.js");
    }
  }, []);

  useEffect(() => {
    // <!-- Hotjar Tracking Code for https://pixelai.app -->
    (function (h, o, t, j) {
      h.hj =
        h.hj ||
        function (...args: any[]) {
          (h.hj.q = h.hj.q || []).push(args);
        };
      h._hjSettings = { hjid: 3366955, hjsv: 6 };
      const a = o.getElementsByTagName("head")[0]!;
      const r = o.createElement("script");
      r.async = true;
      // t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      r.src = `${t}${h._hjSettings.hjid}${j}${h._hjSettings.hjsv}`;
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
  }, []);

  return (
    <>
      <Head>
        <title>Pixel AI</title>
        <link rel="icon" href="/logo.png" />
        <link rel="manifest" href="/app.webmanifest" />
        <link rel="apple-touch-icon" href="/logo.png"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="theme-color"
          content="#000"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Coiny&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="bg-polka-dots relative min-h-screen w-full select-none overflow-x-hidden bg-[#fff] font-inter dark:bg-gray-900 dark:text-white">
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </main>
    </>
  );
};

export default trpc.withTRPC(MyApp);
