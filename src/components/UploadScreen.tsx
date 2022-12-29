import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { pageAtom, Pages } from "./pages";
import { ageAtom, Gender, genderAtom } from "./userOptions";
import { userPhotosAtom } from "./userPhotos";

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

export function UploadScreen() {
  const [page, setPage] = useAtom(pageAtom);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [photos, setPhotos] = useAtom(userPhotosAtom);
  const [gender, setGender] = useAtom(genderAtom);
  const [age, setAge] = useAtom(ageAtom);

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

      setPage(Pages.DASHBOARD);
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
