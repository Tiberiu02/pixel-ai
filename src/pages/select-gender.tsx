import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MdOutlineFemale, MdOutlineMale } from "react-icons/md";
import { Button } from "../components/Button";
import { DemandLogin } from "../components/DemandLogin";
import { Routes } from "../non-components/routes";
import { TopBar } from "../components/TopBar";
import { Gender, genderAtom } from "../non-components/userOptions";

export default function GenderSelectScreen() {
  const session = useSession();
  const router = useRouter();
  const [gender, setGender] = useAtom(genderAtom);

  if (!session) return <DemandLogin />;

  const selectGender = (gender: Gender) => {
    console.log("Selected", gender);
    setGender(gender);
    router.push(Routes.AGE_SELECT);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <TopBar />

      <div className="my-auto flex flex-col items-center justify-center gap-12 p-16">
        <div className="text-center text-xl">Please select your gender</div>
        <div className="my-auto flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => selectGender(Gender.MAN)}
            className="w-full gap-4"
          >
            <MdOutlineMale className="scale-150 text-blue-500" />
            <div className="mx-auto">Man</div>
          </Button>
          <Button onClick={() => selectGender(Gender.WOMAN)} className="gap-4">
            <MdOutlineFemale className="scale-150 text-pink-500" />
            Woman
          </Button>
        </div>
      </div>
      <div className="p-4 text-center text-sm text-zinc-400">
        Non-binary genders coming soon
        <br />
        If you&lsquo;re non-binary, please select either one
      </div>
    </div>
  );
}
