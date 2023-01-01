import { useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
import { BiCog, BiLogOut } from "react-icons/bi";
import { trpc } from "../utils/trpc";
import { Button } from "../components/Button";
import { BsCameraFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { Routes } from "../non-components/routes";
import { DemandLogin } from "../components/DemandLogin";
import { Loading } from "../components/Loading";

export default function DashboardScreen() {
  const router = useRouter();
  const { data: session } = useSession();
  const working = trpc.tasks.working.useQuery(undefined, {
    refetchInterval: 10000,
  });

  if (!session) return <DemandLogin />;

  if (!working.isFetched) return <Loading />;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between">
      <div className="flex w-full items-center justify-between p-4">
        <button onClick={() => signOut()}>
          <BiLogOut className="h-6 w-6 text-white" />
        </button>
        <button onClick={() => router.push(Routes.SETTINGS)}>
          <BiCog className="h-6 w-6 text-white" />
        </button>
      </div>
      {working.data ? (
        <>
          <div className="mx-4 flex w-fit flex-col items-center gap-4 rounded-lg p-4">
            <BsCameraFill className="shrink-0 animate-pulse text-6xl" />
            <div className="mr-2 text-center text-xl">
              Generating
              <br />
              photos
            </div>
          </div>
          <div className="p-4 text-center text-sm text-zinc-400">
            You will be notified when your photos are ready
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-8">
            <div className="text-3xl">Let&lsquo;s go!</div>
            <Button onClick={() => router.push(Routes.GENDER_SELECT)} special>
              Generate Photos
            </Button>
          </div>
          <div></div>
        </>
      )}
    </div>
  );
}
