import { useAtom } from "jotai";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { BiRightArrowAlt } from "react-icons/bi";
import { Button } from "./Button";
import getCroppedImg from "./getCroppedImage";
import { pageAtom, Pages } from "./pages";
import { userPhotosAtom } from "./userPhotos";

function getBox(width: number, height: number) {
  return {
    string: "+",
    style:
      "font-size: 1px; padding: " +
      Math.floor(height / 2) +
      "px " +
      Math.floor(width / 2) +
      "px; line-height: " +
      height +
      "px;",
  };
}

export function CropPhotoScreen() {
  const [page, setPage] = useAtom(pageAtom);
  const [photos, setPhotos] = useAtom(userPhotosAtom);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // console.log(photos);

  const uncroppedPhotos = photos.filter((img) => !img.cropped);

  const imgData = uncroppedPhotos[0];

  // console.log(imgData);

  const cropImage = useCallback(async () => {
    try {
      if (imgData && imgData.img && croppedAreaPixels) {
        const croppedImgData = await getCroppedImg(
          imgData.img.src,
          croppedAreaPixels
        );

        if (croppedImgData) {
          setPhotos((photos) =>
            photos.map((photo) => {
              return photo.id === imgData.id
                ? { ...photo, cropped: croppedImgData }
                : photo;
            })
          );

          if (uncroppedPhotos.length === 1) {
            setPage(Pages.UPLOAD_PHOTOS);
          } else {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  return (
    <div className="realtive flex h-screen w-full flex-col items-center justify-between gap-8 bg-black p-4">
      <div className="h-full w-full p-4">
        <div className="relative h-full w-full">
          <Cropper
            image={imgData?.img.src}
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
