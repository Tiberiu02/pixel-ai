import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { LoginScreen } from "../components/LoginScreen";
import { MainScreen } from "../components/MainScreen";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

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
      <main className="min-h-screen w-screen bg-gradient-to-b from-zinc-900 to-black text-white">
        {status == "loading" ? (
          <></>
        ) : status == "unauthenticated" || !session?.user ? (
          <LoginScreen />
        ) : (
          <MainScreen user={session?.user} />
        )}
      </main>
    </>
  );
};

export default Home;
