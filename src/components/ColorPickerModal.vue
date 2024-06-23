<script setup lang="ts">
import { colorTable } from "../utils/colors";
import { type Ref, inject } from "vue";
import type {
  SwatchInterface,
  PaletteInterface,
  ModalStateInterface,
} from "../utils/types";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "../utils/store";

const modalState = inject<Ref<ModalStateInterface>>("modalState");
const swatchGroup = inject<Ref<SwatchInterface[]>>("swatchGroup");
const currentPalette = inject<Ref<PaletteInterface[]>>("currentPalette");

function toggleModal() {
  modalState!.value.isOpen = !modalState!.value.isOpen;
}

function isInSwatchGroup(tag: string) {
  return swatchGroup?.value.some((swatch) => swatch.tag === tag);
}

function updateSwatches(color: string, tag: string) {
  `updateSwatches ${color} ${tag}`;
  modalState?.value;
  if (modalState?.value.mode === "add") {
    const newSwatch: SwatchInterface = {
      id: nanoid(),
      color,
      tag,
    };

    swatchGroup!.value.push(newSwatch);
    updatePalette();
  } else if (modalState?.value.mode === "edit") {
    ("edit mode");
    swatchGroup?.value.forEach((swatch) => {
      if (swatch.id === modalState?.value.colorId) {
        swatch.color = color;
        swatch.tag = tag;
      }
    });
    updatePalette();
  } else if (modalState?.value.mode === "delete") {
    ("delete mode");
    swatchGroup?.value.forEach((swatch, index) => {
      if (swatch.id === modalState?.value.colorId) {
        swatchGroup?.value.splice(index, 1);
      }
    });
    updatePalette();
  }
}

function updatePalette() {
  currentPalette?.value.forEach((Palette) => {
    if (Palette.id === swatchGroup?.value[0].id) {
      Palette.swatches = swatchGroup?.value;
    }
  });

  saveToLocalStorage("Palettes", currentPalette!.value);
}
</script>

<template>
  <div
    v-show="modalState?.isOpen"
    class="flex flex-wrap gap-4 justify-center z-20 absolute top-0 left-0 h-dvh backdrop-blur-md overflow-x-auto"
  >
    <div
      v-for="(value, name, index) in colorTable"
      :key="index"
      class="z-10 w-10 h-10 border border-black transition-all cursor-pointer hover:scale-125"
      :class="isInSwatchGroup(name) ? 'highlight border-2' : ''"
      :name="name"
      :style="`background-color: ${value}`"
      @click="[toggleModal(), updateSwatches(value, name)]"
    ></div>
  </div>
</template>

<style>
.highlight {
  animation: rainbow 3s linear infinite;
  border: 3px solid;
  box-sizing: border-box;
}

@keyframes rainbow {
  0% {
    border-color: red;
  }
  14% {
    border-color: orange;
  }
  28% {
    border-color: yellow;
  }
  42% {
    border-color: lime;
  }
  57% {
    border-color: aqua;
  }
  71% {
    border-color: blue;
  }
  85% {
    border-color: purple;
  }
  100% {
    border-color: red;
  }
}
</style>
