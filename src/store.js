import { writable } from "svelte/store";

export const textInputStore = writable("");
export const textSelectionStore = writable({ start: 0, end: 0 });
export const selectedColors = writable([]);
