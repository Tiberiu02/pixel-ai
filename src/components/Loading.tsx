import BeatLoader from "react-spinners/BeatLoader";

export function Loading() {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center">
      <div className="dark:hidden">
        <BeatLoader color="#000" />
      </div>
      <div className="hidden dark:block">
        <BeatLoader color="#fff" />
      </div>
    </div>
  );
}
