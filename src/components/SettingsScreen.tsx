import { useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
import { BiArrowBack } from "react-icons/bi";
import { MdOutlineFemale, MdOutlineMale } from "react-icons/md";
import { Button } from "./Button";
import { pageAtom, Pages } from "./pages";
import { ageAtom, Gender, genderAtom } from "./userOptions";

export function SettingsScreen() {
  const [page, setPage] = useAtom(pageAtom);
  const [gender, setGender] = useAtom(genderAtom);
  const [age, setAge] = useAtom(ageAtom);
  const session = useSession();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex w-full items-center p-4">
        <button onClick={() => setPage(Pages.DASHBOARD)}>
          <BiArrowBack className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="flex flex-col gap-8 p-8 text-xl">
        <div className="flex w-full flex-col items-center rounded-lg bg-zinc-900 p-12 text-center">
          <img src={session.data?.user!.image!} className="w-20 rounded-full" />
          <div className="mt-8 mb-2 text-center text-2xl">
            {session.data?.user!.name}
          </div>
          <div className="text-center text-base text-zinc-400">
            {session.data?.user!.email}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-zinc-900 p-6 text-xl">
          Gender
          <div className="flex items-center gap-4 text-3xl">
            <button onClick={() => setGender(Gender.WOMAN)}>
              <MdOutlineFemale
                className={
                  gender == Gender.WOMAN ? "text-pink-500" : "text-zinc-600"
                }
              />
            </button>
            <button onClick={() => setGender(Gender.MAN)}>
              <MdOutlineMale
                className={
                  gender == Gender.MAN ? "text-blue-500" : "text-zinc-600"
                }
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-zinc-900 p-6 text-xl">
          Age
          <input
            className="w-12 border-b-2 border-zinc-500 bg-transparent text-right focus:border-white focus:outline-0"
            value={age || ""}
            onChange={(e) => setAge(parseInt(e.target.value) || null)}
          />
        </div>
        <button
          className="w-fit self-center rounded-full bg-zinc-900 px-8 py-4"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
      <div className="mx-auto mt-auto pb-2 text-zinc-500">© Pixel.AI 2023</div>
    </div>
  );
}
