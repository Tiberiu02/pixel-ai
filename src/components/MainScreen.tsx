import { Session } from "next-auth";
import autoAnimate from "@formkit/auto-animate";

import { useEffect, useRef } from "react";
import { DashboardScreen } from "./DashboardScreen";
import { useAtom } from "jotai";
import { pageAtom, Pages } from "./pages";
import { TutorialScreen } from "./TutorialScreen";
import { UserPhotosScreen } from "./UserPhotosScreen";
import { CropPhotoScreen } from "./CropPhotoScreen";
import { GenderSelectScreen } from "./GenderSelectScreen";
import { AgeSelectScreen } from "./AgeSelectScreen";
import { UploadScreen } from "./UploadScreen";

export function MainScreen({ user }: { user: NonNullable<Session["user"]> }) {
  const [page, setPage] = useAtom(pageAtom);

  const container = useRef(null);

  useEffect(() => {
    container.current && autoAnimate(container.current);
  }, [container]);

  if (page == Pages.DASHBOARD) {
    return <DashboardScreen />;
  } else if (page == Pages.GENDER_SELECT) {
    return <GenderSelectScreen />;
  } else if (page == Pages.AGE_SELECT) {
    return <AgeSelectScreen />;
  } else if (page == Pages.TUTORIAL) {
    return <TutorialScreen />;
  } else if (page == Pages.SELECT_PHOTOS) {
    return <UserPhotosScreen />;
  } else if (page == Pages.CROP_PHOTO) {
    return <CropPhotoScreen />;
  } else if (page == Pages.UPLOAD_PHOTOS) {
    return <UploadScreen />;
  } else {
    return <div>404</div>;
  }
}
