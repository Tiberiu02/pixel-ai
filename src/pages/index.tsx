import { signOut, useSession } from "next-auth/react";
import { BiCog, BiLogOut } from "react-icons/bi";
import { trpc } from "../utils/trpc";
import { Button } from "../components/Button";
import { BsCameraFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { Routes } from "../non-components/routes";
import { DemandLogin } from "../components/DemandLogin";
import { Loading } from "../components/Loading";
import { useEffect, useState } from "react";
import { FiDownload, FiShare2 } from "react-icons/fi";
import { DataURIToBlob } from "../non-components/dataUri";
import { useAtom } from "jotai";
import { notifyStartAtom } from "../non-components/storage";

function downloadJpg(dataUri: string) {
  const a = document.createElement("a");
  a.href = dataUri;
  a.download = "PixelAI.jpg";
  a.click();
}

async function urlContentToDataUri(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
}

async function shareJpg(dataUri: string) {
  const blob = DataURIToBlob(dataUri);

  const file = new File([blob], "picture.jpg", { type: "image/jpeg" });
  const filesArray = [file];

  if (navigator.canShare && navigator.canShare({ files: filesArray })) {
    navigator.share({
      text: "Check out this image I generated using Pixel AI! 🤖✨\nTry it yourself: bit.ly/3XdaoWE",
      files: filesArray,
      title: "Pixel.ai",
    });
  } else {
    alert("Your browser doesn't support sharing files :(");
  }
}

export default function DashboardScreen() {
  const router = useRouter();
  const { data: session } = useSession();
  const [maximizedPicture, setMaximizedPicture] = useState<string>("");
  const status = trpc.tasks.status.useQuery(undefined, {
    refetchInterval: 10000,
  });
  const imageUrls = trpc.images.getGeneratedImages.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 5,
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (status.data == "DONE" && !imageUrls.data) {
      imageUrls.refetch();
    }
  }, [status.data]);

  useEffect(() => {
    if (imageUrls.data && !images.length) {
      imageUrls.data.forEach((url) => {
        urlContentToDataUri(url).then((dataUri) => {
          setImages((images) => [...images, dataUri]);
        });
      });
    }
  }, [imageUrls.data]);

  if (!session) return <DemandLogin />;

  if (!status.isFetched) return <Loading />;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between gap-8">
      <div className="flex w-full items-center justify-between p-4">
        <button onClick={() => signOut()}>
          <BiLogOut className="h-6 w-6 text-white" />
        </button>
        <button onClick={() => router.push(Routes.SETTINGS)}>
          <BiCog className="h-6 w-6 text-white" />
        </button>
      </div>
      {status.data == "WAITING" ? (
        <>
          <div className="mx-4 flex w-fit flex-col items-center gap-4 rounded-lg p-4">
            <BsCameraFill className="shrink-0 animate-pulse text-6xl" />
            <div className="mr-2 text-center text-xl">
              Generating
              <br />
              photos
            </div>
          </div>
          <div className="p-4 text-center text-sm text-zinc-400">
            Please check again in a few hours
          </div>
        </>
      ) : status.data == "NONE" ? (
        <>
          <div className="flex flex-col items-center gap-8">
            <div className="text-3xl">Let&rsquo;s go!</div>
            <Button onClick={() => router.push(Routes.TUTORIAL)} special>
              Generate Photos
            </Button>
          </div>
          <div></div>
        </>
      ) : (
        <>
          <div className="flex h-full flex-col items-center gap-16 p-4 text-2xl font-semibold">
            <div className="animate-pulse">Your photos are ready!</div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((dataUri, i) => (
                <button key={i} onClick={() => setMaximizedPicture(dataUri)}>
                  <img src={dataUri} className="rounded-md"></img>
                </button>
              ))}
            </div>
          </div>
          <div></div>
        </>
      )}
      {maximizedPicture && (
        <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center p-8">
          <div
            className="absolute inset-0 bg-black opacity-90"
            onClick={() => setMaximizedPicture("")}
          ></div>
          <div className="relative flex flex-col overflow-hidden rounded-md">
            <img src={maximizedPicture} className="" />
            <div className="grid grid-cols-2">
              <button
                className="flex items-center justify-center gap-2 bg-red-800 p-4"
                onClick={() => downloadJpg(maximizedPicture)}
              >
                <FiDownload className="text-xl" /> Download
              </button>
              <button
                className="flex items-center justify-center gap-2 bg-red-600 p-4"
                onClick={() => shareJpg(maximizedPicture)}
              >
                <FiShare2 className="text-xl" /> Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
