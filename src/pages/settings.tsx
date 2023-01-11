import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { BiLogOut, BiTrash } from "react-icons/bi";
import { DemandLogin } from "../components/DemandLogin";
import { TopBar } from "../components/TopBar";
import { trpc } from "../utils/trpc";

export default function Settings() {
  const session = useSession();
  const [showDelete, setShowDelete] = useState(false);

  const deleteAccount = trpc.account.delete.useMutation();

  if (!session.data) return <DemandLogin />;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopBar />
      <div className="flex flex-col gap-8 p-8 text-xl">
        <div className="flex w-full flex-col items-center rounded-lg bg-zinc-900 p-12 text-center">
          <img
            src={session.data?.user?.image || "/blank-profile-picture.webp"}
            className="w-20 rounded-full"
          />
          <div className="mt-8 mb-2 text-center text-2xl">
            {session.data?.user?.name}
          </div>
          <div className="text-center text-base text-zinc-400">
            {session.data?.user?.email}
          </div>
        </div>
        <div className="flex flex-col items-center gap-x-8 gap-y-4 self-center">
          <button
            className="flex w-fit shrink-0 items-center gap-3 rounded-full bg-zinc-900 px-8 py-4"
            onClick={() => signOut()}
          >
            <BiLogOut />
            Sign out
          </button>
          <button
            className="flex w-fit shrink-0 items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm"
            onClick={() => setShowDelete(true)}
          >
            <BiTrash />
            Delete account
          </button>
        </div>
      </div>
      <div className="mx-auto mt-auto pb-2 text-zinc-500">© Pixel.AI 2023</div>
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDelete(false)}
          />
          <div className="relative flex flex-col items-center gap-2 rounded-xl bg-zinc-900 p-8">
            <div className="mb-4 text-xl">Are you sure?</div>
            <div className="flex gap-4">
              <button
                className="flex w-fit shrink-0 items-center gap-3 rounded-full bg-zinc-800 px-5 py-2"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button
                className="flex w-fit shrink-0 items-center gap-2 rounded-full bg-red-500 bg-opacity-50 px-5 py-2"
                onClick={async () => {
                  setShowDelete(false);
                  await deleteAccount.mutateAsync();
                  signOut();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
