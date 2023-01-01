import BeatLoader from "react-spinners/BeatLoader";

export function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <BeatLoader color="#fff" />
    </div>
  );
}
