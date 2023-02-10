import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";

export function TopBar() {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between p-4">
      <button>
        <BiArrowBack className="h-6 w-6" onClick={() => router.back()} />
      </button>
    </div>
  );
}
