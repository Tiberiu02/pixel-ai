import { useAtom } from "jotai";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { BiCog, BiLogOut } from "react-icons/bi";
import { Button } from "./Button";
import { pageAtom, Pages } from "./pages";

export function DashboardScreen() {
  const [page, setPage] = useAtom(pageAtom);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex w-full items-center justify-between p-4">
        <BiLogOut className="h-6 w-6 text-white" onClick={() => signOut()} />
        <BiCog className="h-6 w-6 text-white" />
      </div>
      <div className="flex flex-col items-center gap-8">
        <div className="text-3xl">Let&lsquo;s go!</div>
        <Button onClick={() => setPage(Pages.TUTORIAL)} special>
          Generate Photos
        </Button>
      </div>
      <div></div>
    </div>
  );
}
