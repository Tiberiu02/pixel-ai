import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import {
  BiArrowBack,
  BiCrop,
  BiImageAdd,
  BiRightArrowAlt,
  BiX,
} from "react-icons/bi";
import { trpc } from "../utils/trpc";
import { Button } from "../components/Button";
import { DemandLogin } from "../components/DemandLogin";
import getCroppedImg from "../non-components/getCroppedImage";
import { Routes } from "../non-components/routes";
import { ageAtom, Gender, genderAtom } from "../non-components/userOptions";
import {
  ImgData,
  imgFromBlob,
  MIN_PHOTOS,
  userPhotosAtom,
} from "../non-components/userPhotos";
import { RingLoader } from "react-spinners";
import { TopBar } from "../components/TopBar";

export default function UserPhotos() {
  const [photos, setPhotos] = useAtom(userPhotosAtom);
  const [uploading, setUploading] = useState(false);
  const session = useSession();

  if (!session) return <DemandLogin />;

  if (uploading) {
    return <UploadPhotos photos={photos} setPhotos={setPhotos} />;
  } else if (photos.some((p) => !p.cropped)) {
    return <CropPhotos photos={photos} setPhotos={setPhotos} />;
  } else {
    return (
      <SelectPhotos
        photos={photos}
        setPhotos={setPhotos}
        setUploading={setUploading}
      />
    );
  }
}

function SelectPhotos({
  photos,
  setPhotos,
  setUploading,
}: {
  photos: ImgData[];
  setPhotos: (photos: ImgData[]) => void;
  setUploading: (uploading: boolean) => void;
}) {
  const router = useRouter();

  const fileHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setPhotos(
        (
          await Promise.all(
            files.map(async (f) => new ImgData(await imgFromBlob(f)))
          )
        ).concat(photos)
      );
    }
  };

  return (
    <div className="realtive flex h-screen w-full flex-col items-center justify-between">
      <TopBar />

      <div className="flex h-full w-full flex-col gap-16 p-4">
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

        <div className="flex w-full flex-col items-center gap-16 overflow-auto">
          <div className="grid w-full grid-cols-3 gap-6 p-4">
            {photos.map((imageData, i) => (
              <div
                key={imageData.id}
                className="relative aspect-square w-full rounded-md"
                style={{
                  backgroundImage: `url('${
                    imageData.cropped || imageData.img
                  }')`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <button
                  className="absolute flex h-8 w-8 translate-x-[-15%] -translate-y-1/3 items-center justify-center  rounded-full bg-red-500 text-3xl shadow-md"
                  onClick={() => {
                    setPhotos(photos.filter((img) => img.id !== imageData.id));
                  }}
                >
                  <BiX />
                </button>
                <button
                  className="absolute right-0 flex h-8 w-8 translate-x-[15%] -translate-y-1/3 items-center justify-center  rounded-full bg-blue-500 p-1 text-xl shadow-md"
                  onClick={() => {
                    setPhotos(
                      photos.map((img) =>
                        img.id === imageData.id
                          ? { ...img, cropped: undefined }
                          : img
                      )
                    );
                  }}
                >
                  <BiCrop />
                </button>
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
          <Button onClick={() => setUploading(true)} className="z-10" special>
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

export function CropPhotos({
  photos,
  setPhotos,
}: {
  photos: ImgData[];
  setPhotos: (photos: ImgData[]) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const uncroppedPhotos = photos.filter((img) => !img.cropped);

  const imgData = uncroppedPhotos[0];

  const cropImage = useCallback(async () => {
    try {
      if (imgData && imgData.img && croppedAreaPixels) {
        const croppedImgData = await getCroppedImg(
          imgData.img,
          croppedAreaPixels
        );

        if (croppedImgData) {
          setPhotos(
            photos.map((photo) => {
              return photo.id === imgData.id
                ? { ...photo, cropped: croppedImgData }
                : photo;
            })
          );

          if (uncroppedPhotos.length > 1) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, photos]);

  return (
    <div className="realtive flex h-screen w-full flex-col items-center justify-between gap-8 bg-black p-4">
      <div className="h-full w-full p-4">
        <div className="relative h-full w-full">
          <Cropper
            image={imgData?.img}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      </div>

      <div className="flex w-full justify-end">
        <Button onClick={cropImage}>
          Confirm <BiRightArrowAlt />
        </Button>
      </div>
    </div>
  );
}

export function UploadPhotos({
  photos,
  setPhotos,
}: {
  photos: ImgData[];
  setPhotos: (photos: ImgData[]) => void;
}) {
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [gender] = useAtom(genderAtom);
  const [age] = useAtom(ageAtom);

  const clearUploads = trpc.images.clearUploads.useMutation();
  const addImage = trpc.images.upload.useMutation();
  const addTask = trpc.tasks.create.useMutation();

  useEffect(() => {
    let progress = 0;
    let forceExit = false;

    (async () => {
      const numTasks = photos.length * 2;
      const progressPerTask = 1 / numTasks;

      await clearUploads.mutateAsync();
      if (forceExit) return;

      for await (const photo of photos) {
        const rawName = photo.id + "_raw.jpg";
        const croppedName = photo.id + "_cropped.jpg";
        console.log(rawName, croppedName);

        setProgress((progress += progressPerTask));
        await uploadJpeg(rawName, photo.img);
        if (forceExit) return;
        setProgress((progress += progressPerTask));
        await uploadJpeg(croppedName, photo.cropped!);
        if (forceExit) return;

        await addImage.mutateAsync({
          raw: rawName,
          cropped: croppedName,
        });
        if (forceExit) return;
      }

      await addTask.mutateAsync({
        gender: gender as Gender,
        age: age as number,
      });
      if (forceExit) return;

      router.push(Routes.HOME);
    })();

    return () => {
      setProgress(0);
      forceExit = true;
    };
  }, []);

  console.log(progress);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <RingLoader color="#fff" />
        <div className="text-xl">Uploading photos</div>
        <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-zinc-500">
          <div
            className="h-full rounded-full bg-amber-400"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function DataURIToBlob(dataURI: string) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0]!.indexOf("base64") >= 0
      ? atob(splitDataURI[1]!)
      : decodeURI(splitDataURI[1]!);
  const mimeString = splitDataURI[0]!.split(":")[1]!.split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  console.log(ia.length, new Blob([ia], { type: mimeString }));

  return new Blob([ia], { type: mimeString });
}

const uploadJpeg = async (name: string, data64: string, tries = 5) => {
  try {
    const filename = encodeURIComponent(name);
    const fileType = encodeURIComponent("image/jpeg");

    const res = await fetch(
      `/api/upload?file=${filename}&fileType=${fileType}`
    );
    const { url, fields } = await res.json();

    const formData = new FormData();

    Object.entries({
      ...fields,
    }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    formData.append("file", DataURIToBlob(data64));

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!upload.ok) {
      throw new Error("Upload failed.");
    }
  } catch (e) {
    if (tries > 0) {
      await uploadJpeg(name, data64, tries - 1);
    }
  }
};
