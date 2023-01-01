import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loading } from "./Loading";
import { Routes } from "../non-components/routes";

export function DemandLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push(Routes.LOGIN);
  }, [status]);

  return <Loading />;
}
