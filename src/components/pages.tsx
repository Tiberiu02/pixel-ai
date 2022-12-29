import { atom } from "jotai";

export enum Pages {
  DASHBOARD,
  GENDER_SELECT,
  AGE_SELECT,
  TUTORIAL,
  SELECT_PHOTOS,
  CROP_PHOTO,
  UPLOAD_PHOTOS,
  SETTINGS,
}

export const pageAtom = atom(Pages.DASHBOARD);
