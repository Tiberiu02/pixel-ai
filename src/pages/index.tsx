import { signOut, useSession } from "next-auth/react";
import { BiCog, BiLogOut } from "react-icons/bi";
import { trpc } from "../utils/trpc";
import { Button } from "../components/Button";
import { BsCameraFill } from "react-icons/bs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { useRouter } from "next/router";
import { Routes } from "../non-components/routes";
import { DemandLogin } from "../components/DemandLogin";
import { Loading } from "../components/Loading";
import { useEffect, useState } from "react";
import { FiDownload, FiShare2 } from "react-icons/fi";
import { DataURIToBlob } from "../non-components/dataUri";
import { useAtom } from "jotai";
import { notifyStartAtom } from "../non-components/storage";
import { twMerge } from "tailwind-merge";

function downloadJpg(dataUri: string) {
  const a = document.createElement("a");
  a.href = dataUri;
  const randStr = Math.random().toString(36).substring(7);
  a.download = `PixelAI-${randStr}.jpg`;
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
  console.log("shareJpg", dataUri);

  const blob = DataURIToBlob(dataUri);

  const file = new File([blob], "picture.jpg", { type: "image/jpeg" });
  const filesArray = [file];

  if (navigator.canShare && navigator.canShare({ files: filesArray })) {
    navigator.share({
      text: "Check out this image I generated using pixelai.app! 🤖✨",
      files: filesArray,
      title: "Pixel AI",
    });
  } else {
    alert("Your browser doesn't support sharing files :(");
  }
}

export default function DashboardScreen() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loadedImages, setLoadedImages] = useState(false);
  const status = trpc.tasks.status.useQuery(undefined, {
    refetchInterval: 10000,
  });
  const [showBest, setShowBest] = useState(false);
  const imageUrls = trpc.images.getGeneratedImages.useQuery(undefined);
  const trpcBookmark = trpc.images.bookmark.useMutation();
  const [images, setImages] = useState(
    new Map<string, { dataUri: string; bookmarked: boolean }>()
  );

  useEffect(() => {
    console.log(Date.now() / 1000, loadedImages, status.data);
    if (status.data == "DONE" && !loadedImages) {
      imageUrls.refetch();
      setLoadedImages(true);
    }
  }, [status.data]);

  useEffect(() => {
    let canceled = false;

    if (imageUrls.data && !images.size) {
      setImages(new Map());
      imageUrls.data.forEach((image) => {
        urlContentToDataUri(image.url).then((dataUri) => {
          // if (canceled) return;
          setImages((images) =>
            new Map(images).set(image.id, {
              dataUri,
              bookmarked: image.bookmarked,
            })
          );
        });
      });
    }

    return () => {
      canceled = true;
    };
  }, [imageUrls.data]);

  if (!session) return <DemandLogin />;

  if (!status.isFetched) return <Loading />;

  const bookmark = (id: string, bookmarked: boolean) => {
    trpcBookmark.mutate({ id, bookmarked });
    setImages((images) => {
      const image = images.get(id);
      if (!image) return images;
      return new Map(images).set(id, { ...image, bookmarked });
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between gap-0">
      <div className="flex w-full items-center justify-between p-4">
        <button onClick={() => signOut()}>
          <BiLogOut className="h-6 w-6" />
        </button>
        <button onClick={() => router.push(Routes.SETTINGS)}>
          <BiCog className="h-6 w-6" />
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
          <div></div>
          <div className="fixed bottom-0 p-4 text-center text-sm opacity-60">
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
          <div className="flex h-full flex-col gap-1 pb-16">
            <div className="animate-pulse self-center py-8 text-2xl">
              Your photos are ready!
            </div>
            {Array.from(images.entries()).map(([imgId, image]) => (
              <div
                className={twMerge(
                  "relative overflow-hidden",
                  showBest && !image.bookmarked && "hidden"
                )}
                key={imgId}
              >
                <img src={image.dataUri} className="w-full"></img>
                <div className="absolute bottom-0 right-0 flex items-center text-white">
                  <div className="absolute inset-0 translate-x-1/2 translate-y-1/2 scale-[2] rounded-tl-xl bg-black opacity-30 blur-md"></div>
                  <button onClick={() => downloadJpg(image.dataUri)}>
                    <FiDownload className="relative p-2 text-5xl drop-shadow-lg" />
                  </button>
                  <button onClick={() => shareJpg(image.dataUri)}>
                    <FiShare2 className="relative p-2 text-[2.8rem] drop-shadow-lg" />
                  </button>
                  <button onClick={() => bookmark(imgId, !image.bookmarked)}>
                    {image.bookmarked ? (
                      <AiFillStar className="relative p-2 text-5xl drop-shadow-lg" />
                    ) : (
                      <AiOutlineStar className="relative p-2 text-5xl drop-shadow-lg" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div></div>
          <div className="fixed bottom-0 flex w-full max-w-md justify-around p-2 font-bold drop-shadow-md">
            <button
              onClick={() => {
                if (showBest) {
                  setShowBest(false);
                  document.getElementsByTagName("main")[0]?.scrollTo(0, 0);
                }
              }}
              className={twMerge(
                "flex items-center gap-2 rounded-full bg-zinc-200 px-6 py-2 text-gray-400 shadow-md dark:bg-gray-800",
                !showBest &&
                  "bg-white text-black  dark:bg-gray-600 dark:text-white"
              )}
            >
              <MdOutlineInsertPhoto className="text-xl" />
              All photos
            </button>
            <button
              onClick={() => {
                if (!showBest) {
                  setShowBest(true);
                  document.getElementsByTagName("main")[0]?.scrollTo(0, 0);
                }
              }}
              className={twMerge(
                "flex items-center gap-2 rounded-full bg-zinc-200 px-6 py-2 text-gray-400 shadow-md dark:bg-gray-800",
                showBest &&
                  "bg-white text-black  dark:bg-gray-600 dark:text-white"
              )}
            >
              <AiFillStar className="text-xl" />
              Best photos
            </button>
          </div>
        </>
      )}
    </div>
  );
}
