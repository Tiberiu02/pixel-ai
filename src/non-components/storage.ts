import { atom } from "jotai";

function createLocalStorageAtom<T>(key: string) {
  const storageAtom = atom<T | null>(
    JSON.parse(
      (typeof localStorage !== "undefined" && localStorage.getItem(key)) ||
        "null"
    ) as T | null
  );

  return atom<T | null, T | null>(
    (get) => get(storageAtom),
    (get, set, newValue) => {
      set(storageAtom, newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  );
}

export const notifyStartAtom = atom(false);
