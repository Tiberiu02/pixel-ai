import { signOut } from "next-auth/react";
import { Button } from "./Button";
import { Session } from "next-auth";
import autoAnimate from "@formkit/auto-animate";
import Cropper from "react-easy-crop";

import {
  BiLogOut,
  BiCog,
  BiArrowBack,
  BiRightArrowAlt,
  BiCheckCircle,
  BiXCircle,
  BiImageAdd,
  BiX,
} from "react-icons/bi";
import { useCallback, useEffect, useRef, useState } from "react";
import { DashboardScreen } from "./DashboardScreen";
import { useAtom } from "jotai";
import { pageAtom, Pages } from "./pages";
import { ImgData, MIN_PHOTOS } from "./userPhotos";
import { TutorialScreen } from "./TutorialScreen";
import { UserPhotosScreen } from "./UserPhotosScreen";
import { CropPhotoScreen } from "./CropPhotoScreen";

export function MainScreen({ user }: { user: NonNullable<Session["user"]> }) {
  const [page, setPage] = useAtom(pageAtom);
  const [photos, setPhotos] = useState<ImgData[]>([]);

  const numPhotos = photos.length;

  const container = useRef(null);

  useEffect(() => {
    container.current && autoAnimate(container.current);
  }, [container]);

  if (page == Pages.DASHBOARD) {
    return <DashboardScreen />;
  } else if (page == Pages.TUTORIAL) {
    return <TutorialScreen />;
  } else if (page == Pages.UPLOAD_PHOTOS) {
    return <UserPhotosScreen />;
  } else if (page == Pages.CROP_PHOTO) {
    return <CropPhotoScreen />;
  } else {
    return <div>404</div>;
  }
}
