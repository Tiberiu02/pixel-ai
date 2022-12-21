import { useAtom } from "jotai";
import {
  BiArrowBack,
  BiCrop,
  BiImageAdd,
  BiRightArrowAlt,
  BiX,
} from "react-icons/bi";
import { Button } from "./Button";
import { pageAtom, Pages } from "./pages";
import { ImgData, imgFromBlob, MIN_PHOTOS, userPhotosAtom } from "./userPhotos";

export function UserPhotosScreen() {
  const [page, setPage] = useAtom(pageAtom);
  const [photos, setPhotos] = useAtom(userPhotosAtom);

  const fileHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setPhotos([
        ...(await Promise.all(
          files.map(async (f) => new ImgData(await imgFromBlob(f)))
        )),
        ...photos,
      ]);
      setPage(Pages.CROP_PHOTO);
    }
  };

  return (
    <div className="realtive flex h-screen w-full flex-col items-center justify-between p-4">
      <div className="flex h-full w-full flex-col gap-16">
        <div className="flex w-full items-center justify-between">
          <BiArrowBack
            className="h-6 w-6 text-white"
            onClick={() => setPage(Pages.TUTORIAL)}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <label htmlFor="image-upload">
            <Button>
              <BiImageAdd className="text-4xl" />{" "}
              <div className="text-base">Add photos</div>
            </Button>
          </label>
        </div>

        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={fileHandler}
          className="hidden"
        />

        <div className="flex w-full flex-col items-center gap-16 overflow-scroll">
          <div className="grid w-full grid-cols-3 gap-6 p-4">
            {photos.map((imageData, i) => (
              <div
                key={imageData.id}
                className="relative aspect-square w-full rounded-md"
                style={{
                  backgroundImage: `url('${
                    (imageData.cropped || imageData.img).src
                  }')`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div
                  className="absolute flex h-8 w-8 translate-x-[-15%] -translate-y-1/3 items-center justify-center  rounded-full bg-red-500 text-3xl shadow-md"
                  onClick={() => {
                    setPhotos(photos.filter((img) => img.id !== imageData.id));
                  }}
                >
                  <BiX />
                </div>
                <div
                  className="absolute right-0 flex h-8 w-8 translate-x-[15%] -translate-y-1/3 items-center justify-center  rounded-full bg-blue-500 p-1 text-xl shadow-md"
                  onClick={() => {
                    setPhotos((photos) =>
                      photos.map((img) =>
                        img.id === imageData.id
                          ? { ...img, cropped: undefined }
                          : img
                      )
                    );
                    setPage(Pages.CROP_PHOTO);
                  }}
                >
                  <BiCrop />
                </div>
              </div>
            ))}
            <div key="blank-1" className="aspect-square w-full"></div>
            <div key="blank-2" className="aspect-square w-full"></div>
            <div key="blank-3" className="aspect-square w-full"></div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full flex-col items-end p-4">
        <div className="pointer-events-none absolute inset-0 z-0 -translate-y-[100%] scale-y-[3] bg-gradient-to-t from-black to-transparent"></div>
        {photos.length >= MIN_PHOTOS && (
          <Button
            onClick={() => setPage(Pages.CROP_PHOTO)}
            className="z-10"
            special
          >
            Start <BiRightArrowAlt />
          </Button>
        )}
        {photos.length > 0 && photos.length < MIN_PHOTOS && (
          <div className="z-10 flex items-center gap-2 self-center rounded-full bg-red-500 px-4 py-2 font-semibold text-white no-underline shadow-lg transition">
            Please add at least {MIN_PHOTOS} photos
          </div>
        )}
      </div>
    </div>
  );
}
