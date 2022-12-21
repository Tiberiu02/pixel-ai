import { useAtom } from "jotai";
import {
  BiArrowBack,
  BiCheckCircle,
  BiRightArrowAlt,
  BiXCircle,
} from "react-icons/bi";
import { Button } from "./Button";
import { pageAtom, Pages } from "./pages";

const dos = [
  "Upload at least 15 photos of you",
  "Diferent poses, angles, and environments",
  "Have both full body & face only photos",
  "Clearly visible face",
  "Good lighting",
];
const donts = [
  "Filters",
  "Sunglasses",
  "Hats",
  "Group photos, other people",
  "Unusual accesories or equipment",
];

export function TutorialScreen() {
  const [page, setPage] = useAtom(pageAtom);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-between p-4">
      <div className="flex h-full w-full flex-col gap-8">
        <div className="flex w-full items-center">
          <BiArrowBack
            className="h-6 w-6 text-white"
            onClick={() => setPage(Pages.DASHBOARD)}
          />
        </div>
        <div className="flex w-full flex-col gap-8 overflow-auto">
          <div className="text-center text-2xl">Read this very carefully</div>
          <div className="flex flex-col gap-4">
            <div>
              Our AI will need some photos of you to learn how you look and
              generate new, professional photos of you.
            </div>
            <div>
              The better the photos you provide, the better the results will be.
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
            <div>
              Our AI works best with square images. After selecting your photos,
              you will pe asked to crop them as squares. Include as much as
              possible your own face and body. Crop out everything else.
            </div>
          </div>

          <div className="self-end">
            <Button onClick={() => setPage(Pages.UPLOAD_PHOTOS)}>
              Upload photos <BiRightArrowAlt />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
