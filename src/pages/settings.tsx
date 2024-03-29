import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiArrowBack, BiHelpCircle, BiLogOut, BiTrash } from "react-icons/bi";
import { MdOutlineFeedback } from "react-icons/md";
import { DemandLogin } from "../components/DemandLogin";
import { trpc } from "../utils/trpc";

export default function Settings() {
  const session = useSession();
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  const deleteAccount = trpc.account.delete.useMutation();

  if (!session.data) return <DemandLogin />;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex w-full items-center justify-between p-4">
        <button>
          <BiArrowBack className="h-6 w-6" onClick={() => router.back()} />
        </button>
        <Link href="/help">
          <BiHelpCircle className="h-6 w-6" />
        </Link>
      </div>
      <div className="flex flex-col gap-8 p-8 text-xl">
        <div className="flex w-full flex-col items-center rounded-lg  border-zinc-200  p-12 text-center dark:border-gray-700">
          <img
            src={session.data?.user?.image || "/blank-profile-picture.webp"}
            className="w-20 rounded-full"
          />
          <div className="mt-8 mb-2 text-center text-2xl">
            {session.data?.user?.name}
          </div>
          <div className="text-center text-base opacity-60">
            {session.data?.user?.email}
          </div>
        </div>
        <div className="flex flex-col items-center gap-x-8 gap-y-4 self-center">
          <Link
            href="https://forms.gle/VDqK2Hfwhve12qgP7"
            target="_blank"
            className="flex w-fit shrink-0 items-center gap-3 rounded-full border-2 border-zinc-200 bg-zinc-100 px-6 py-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <MdOutlineFeedback />
            Feedback
          </Link>
          <button
            className="flex w-fit shrink-0 items-center gap-3 rounded-full border-2 border-zinc-200 bg-zinc-100 px-8 py-4 dark:border-gray-700 dark:bg-gray-800"
            onClick={() => signOut()}
          >
            <BiLogOut />
            Sign out
          </button>
          <button
            className="flex w-fit shrink-0 items-center gap-2 rounded-full border-2 border-zinc-200 bg-zinc-100 px-6 py-3 text-sm dark:border-gray-700 dark:bg-gray-800"
            onClick={() => setShowDelete(true)}
          >
            <BiTrash />
            Delete account
          </button>
        </div>
      </div>
      <div className="mx-auto mt-auto pb-2 text-gray-500">© Pixel AI 2023</div>
      {showDelete && (
        <div className="fixed inset-0 flex h-screen w-screen items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowDelete(false)}
          />
          <div className="relative flex flex-col items-center gap-2 rounded-xl bg-gray-100 p-8 dark:bg-gray-900">
            <div className="mb-4 text-xl">Are you sure?</div>
            <div className="flex gap-4">
              <button
                className="flex w-fit shrink-0 items-center gap-3 rounded-full bg-gray-300 px-5 py-2 dark:bg-gray-800"
                onClick={() => setShowDelete(false)}
              >
                Cancel
              </button>
              <button
                className="flex w-fit shrink-0 items-center gap-2 rounded-full bg-red-500 bg-opacity-60 px-5 py-2"
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
