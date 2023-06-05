// store.js
import { writable } from "svelte/store";

export const textSelectionStore = writable({
  start: 0,
  end: 0,
});

export const textInputStore = writable("");
