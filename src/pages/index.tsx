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

function downloadJpg(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "PixelAI.jpg";
  a.click();
  window.URL.revokeObjectURL(url);
}

async function shareJpg(url: string) {
  const response = await fetch(url, {
    mode: "no-cors",
  });

  const blob = await response.blob();

  let file = new File([blob], "picture.jpg", { type: "image/jpeg" });
  let filesArray = [file];

  if (navigator.canShare && navigator.canShare({ files: filesArray })) {
    navigator.share({
      text: "Check out this image I generated entirely using the AI from Pixel.ai! ✨🤖",
      files: filesArray,
      title: "Pixel.ai",
      url: "https://app.pixelaibeta.com",
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
  const generatedImages = trpc.images.getGeneratedImages.useQuery(undefined, {
    refetchInterval: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (status.data == "DONE" && !generatedImages.data) {
      generatedImages.refetch();
    }
  }, [status.data]);

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
            You will be notified when your photos are ready
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
        generatedImages.data && (
          <>
            <div className="flex h-full flex-col items-center gap-16 p-4 text-2xl font-semibold">
              Your photos are ready!
              <div className="grid grid-cols-3 gap-4">
                {generatedImages.data.map((url) => (
                  <button key={url} onClick={() => setMaximizedPicture(url)}>
                    <img src={url} className="rounded-md"></img>
                  </button>
                ))}
              </div>
            </div>
            {/* <Button onClick={() => generatedImages.data.forEach(downloadJpg)}>
              Download all
            </Button> */}
            <div></div>
          </>
        )
      )}
      {maximizedPicture && (
        <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center p-8">
          <div
            className="absolute inset-0 bg-black opacity-80"
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
