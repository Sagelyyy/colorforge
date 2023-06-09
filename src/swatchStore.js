import { writable } from "svelte/store";
import { nanoid } from "nanoid";
import { loadFromLocalStorage, saveToLocalStorage } from "./utils/localStorage";
import { getRandColor } from "./utils/colors.js";

const initialGroups = loadFromLocalStorage("swatchGroups") || [
  {
    id: nanoid(),
    step: 1,
    swatches: [{ id: nanoid(), colorKey: getRandColor() }],
  },
];

export const swatchGroups = writable(initialGroups);

swatchGroups.subscribe((value) => {
  saveToLocalStorage("swatchGroups", value);
});
