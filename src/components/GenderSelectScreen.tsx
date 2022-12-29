import { useAtom } from "jotai";
import { BiArrowBack } from "react-icons/bi";
import { MdOutlineFemale, MdOutlineMale } from "react-icons/md";
import { Button } from "./Button";
import { pageAtom, Pages } from "./pages";
import { Gender, genderAtom } from "./userOptions";

export function GenderSelectScreen() {
  const [page, setPage] = useAtom(pageAtom);
  const [gender, setGender] = useAtom(genderAtom);

  const selectGender = (gender: Gender) => {
    console.log("Selected", gender);
    setGender(gender);
    setPage(Pages.AGE_SELECT);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="flex w-full items-center justify-between p-4">
        <BiArrowBack
          className="h-6 w-6 text-white"
          onClick={() => setPage(Pages.DASHBOARD)}
        />
      </div>
      <div className="my-auto flex flex-col items-center justify-center gap-12 p-16">
        <div className="text-center text-xl">Please select your gender</div>
        <div className="my-auto flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => selectGender(Gender.MAN)}
            className="w-full gap-3"
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
