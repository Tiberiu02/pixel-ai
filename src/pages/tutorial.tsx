import { useRouter } from "next/router";
import { BiCheckCircle, BiRightArrowAlt, BiXCircle } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import { Button } from "../components/Button";
import { Routes } from "../non-components/routes";
import { TopBar } from "../components/TopBar";

const dos = [
  "Upload at least 20 photos of you",
  "Diferent poses, angles, and environments",
  "Have both full body & close-up photos",
  "Clearly visible face",
  "Looking at the camera",
  "Good lighting",
];
const donts = [
  "Filters",
  "Sunglasses",
  "Hats",
  "Group photos, other people",
  "Unusual accesories or equipment",
  "Turned away from the camera",
];

export default function Tutorial() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center justify-between">
      <div className="flex w-full flex-col gap-8">
        <TopBar />

        <div className="flex w-full flex-col gap-8 p-4">
          <IoWarningOutline className="mx-auto shrink-0 text-8xl text-red-500" />
          <div className="text-center text-2xl">Read this very carefully</div>
          <div className="mx-auto flex max-w-lg flex-col gap-4">
            <div>
              Our AI will need some photos of you. The better the photos you
              provide, the better the results will be.
            </div>
            <div>Please follow the rules below as closely as possible.</div>
            <div className="text-lg font-bold">DOs</div>
            <div className="wrap flex flex-col gap-2">
              {dos.map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <BiCheckCircle className="shrink-0 text-green-500" /> {text}{" "}
                </div>
              ))}
            </div>
            <div className="text-lg font-bold">DON&lsquo;Ts</div>
            <div className="wrap flex flex-col gap-2">
              {donts.map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <BiXCircle className="shrink-0 text-red-500" /> {text}{" "}
                </div>
              ))}
            </div>
          </div>

          <div className="self-end">
            <Button onClick={() => router.push(Routes.UPLOAD_PHOTOS)}>
              Select photos <BiRightArrowAlt />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
