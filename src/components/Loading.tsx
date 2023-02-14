import { Loader } from "./Loader";

export function Loading() {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center">
      <Loader />
    </div>
  );
}
