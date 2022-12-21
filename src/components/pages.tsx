import { atom } from "jotai";

export enum Pages {
  DASHBOARD,
  TUTORIAL,
  UPLOAD_PHOTOS,
  CROP_PHOTO,
  REVIEW_PHOTOS,
}

export const pageAtom = atom(Pages.DASHBOARD);
