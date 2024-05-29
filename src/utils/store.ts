import { nanoid } from "nanoid";
import { type PalleteInterface } from "./types";

export function saveToLocalStorage(key: string, value: PalleteInterface[]) {
  console.log(`saving ${key}, ${JSON.stringify(value)} to localStorage`);
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key: string) {
  console.log(`loading ${key} from localStorage`);
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    return JSON.parse(storedValue);
  }
  return null;
}
