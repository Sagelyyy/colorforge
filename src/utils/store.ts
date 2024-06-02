import { nanoid } from "nanoid";
import { type PalleteInterface } from "./types";

export function saveToLocalStorage(key: string, value: PalleteInterface[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key: string) {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    return JSON.parse(storedValue);
  }
  return null;
}
