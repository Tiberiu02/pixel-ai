import { useAtom } from "jotai";
import { BiArrowBack, BiRightArrowAlt } from "react-icons/bi";
import { MdOutlineFemale, MdOutlineMale } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import { pageAtom, Pages } from "./pages";
import { ageAtom, Gender, genderAtom } from "./userOptions";

export function AgeSelectScreen() {
  const [page, setPage] = useAtom(pageAtom);
  const [age, setAge] = useAtom(ageAtom);

  const selectAge = (age: number) => {
    console.log("Selected", age);
    setAge(age);
    setPage(Pages.TUTORIAL);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="flex w-full items-center justify-between p-4">
        <BiArrowBack
          className="h-6 w-6 text-white"
          onClick={() => setPage(Pages.GENDER_SELECT)}
        />
      </div>
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
            onClick={() => setPage(Pages.TUTORIAL)}
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
