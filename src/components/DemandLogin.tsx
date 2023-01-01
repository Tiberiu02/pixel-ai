import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loading } from "./Loading";
import { Routes } from "../non-components/routes";

export function DemandLogin() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") router.push(Routes.LOGIN);
  }, [session, router]);

  return <Loading />;
}
