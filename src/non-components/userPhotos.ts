import { atom } from "jotai";

export const MIN_PHOTOS = 15;
export const MAX_PHOTOS = 50;

export class ImgData {
  id: string;
  cropped?: string;
  uploadPromise?: Promise<void>;

  constructor(public img: string) {
    this.id = Math.random().toString(36).slice(2, 9);
  }
}

export function imgFromBlob(file: Blob) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
  });
}

export const userPhotosAtom = atom<ImgData[]>([]);
