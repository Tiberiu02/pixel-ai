import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BiRightArrowAlt } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import { DemandLogin } from "../components/DemandLogin";
import { Routes } from "../non-components/routes";
import { TopBar } from "../components/TopBar";
import { ageAtom } from "../non-components/userOptions";

export default function AgeSelect() {
  const session = useSession();
  const [age, setAge] = useAtom(ageAtom);
  const router = useRouter();

  if (!session) return <DemandLogin />;

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <TopBar />

      <div className="my-auto flex flex-col items-center justify-center gap-12 p-16">
        <div className="text-center text-xl">Please type your age</div>
        <div className="group flex items-center rounded-full border-2 border-zinc-500 py-2 px-2 text-3xl focus-within:border-white">
          <input
            className="web w-full bg-transparent px-2 outline-none"
            type="number"
            value={(age || "").toString()}
            onChange={(e) => setAge(parseInt(e.target.value) || null)}
          />
          <button
            className={twMerge(
              "text-5xl",
              age && age > 0 && age < 150 ? "" : "invisible"
            )}
            onClick={() => router.push(Routes.TUTORIAL)}
          >
            <BiRightArrowAlt />
          </button>
        </div>
        <div className="my-auto flex flex-col items-center justify-center gap-4 sm:flex-row"></div>
      </div>
      <div className="p-4 text-center text-sm text-zinc-400"></div>
    </div>
  );
}
