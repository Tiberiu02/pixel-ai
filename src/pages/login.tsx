import { useEffect, useState } from "react";
import Image from "next/image";

import { getProviders, signIn, useSession } from "next-auth/react";

import { FaDiscord, FaFacebook, FaGoogle } from "react-icons/fa";
import { IoIosCamera } from "react-icons/io";
import { Button } from "../components/Button";
import { Routes } from "../non-components/routes";
import { useRouter } from "next/router";
import { Loading } from "../components/Loading";
import Link from "next/link";

function useAsync<T>(get: () => Promise<T>): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    get().then((data) => setData(data));
  }, []);

  return data;
}

const AuthIcons: { [id: string]: JSX.Element } = {
  google: <FaGoogle />,
  facebook: <FaFacebook />,
  discord: <FaDiscord />,
};

export default function Login() {
  const session = useSession();
  const router = useRouter();
  const providers = useAsync(() => getProviders());

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push(Routes.HOME);
    }
  }, [session]);

  if (session.status !== "unauthenticated") {
    return <Loading />;
  }

  return (
    <div className="bg-polka-dots flex min-h-screen w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex items-center justify-center gap-4">
        <IoIosCamera className="text-5xl opacity-50" />
        <h1 className="text-4xl font-extrabold tracking-tight">
          PIXEL <span className="font-light">AI</span>
        </h1>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl font-light tracking-tight">
          Let&rsquo;s get you some great new&nbsp;photos!
        </h1>
        <div className="my-4 h-0 w-32 rounded-full bg-white opacity-30"></div>
        <div className="mt-0 flex flex-col gap-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name} className="w-full">
                <Button
                  onClick={() => signIn(provider.id)}
                  className="flex items-center gap-4"
                  special
                >
                  {AuthIcons[provider.id]} Sign in with {provider.name}
                </Button>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-zinc-400">
        By signing up, you agree to our <br />
        <Link href="/tos.html" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy.html" className="underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
