import { BeatLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";

export function Loader({ className }: { className?: string }) {
  return (
    <>
      <BeatLoader color="#000" className={twMerge("dark:hidden", className)} />
      <BeatLoader
        color="#fff"
        className={twMerge("hidden dark:block", className)}
      />
    </>
  );
}
