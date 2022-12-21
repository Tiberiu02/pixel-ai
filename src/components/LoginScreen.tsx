import { useEffect, useState } from "react";
import Image from "next/image";

import { getProviders, signIn } from "next-auth/react";

import { FaDiscord } from "react-icons/fa";
import { Button } from "./Button";

function useAsync<T>(get: () => Promise<T>): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    get().then((data) => setData(data));
  }, []);

  return data;
}

const AuthIcons: { [id: string]: JSX.Element } = {
  discord: <FaDiscord />,
};

export function LoginScreen() {
  const providers = useAsync(() => getProviders());

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16 ">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-4">
          <Image
            className="mt-1 h-8 w-8 opacity-90"
            src="/logo.png"
            width={256}
            height={256}
            alt="logo"
          />
          <h1 className="text-4xl font-extrabold tracking-tight">
            Pixel<span className="text-[hsl(0,0%,50%)]">.</span>AI
          </h1>
        </div>
        <h1 className=" text-xl font-light tracking-tight">
          Let&lsquo;s get you some great new photos!
        </h1>
        <div className="my-8 h-1 w-32 rounded-full bg-white opacity-30"></div>
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button onClick={() => signIn(provider.id)}>
                {AuthIcons[provider.id]} Sign in with {provider.name}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
