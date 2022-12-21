import { atom } from "jotai";

export const MIN_PHOTOS = 15;
export const MAX_PHOTOS = 50;

export class ImgData {
  id: string;
  cropped?: HTMLImageElement;

  constructor(public img: HTMLImageElement) {
    this.id = Math.random().toString(36).slice(2, 9);
  }
}

export function imgFromBlob(file: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      let img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.src = e.target?.result as string;
    };
  });
}

export const userPhotosAtom = atom<ImgData[]>([]);
