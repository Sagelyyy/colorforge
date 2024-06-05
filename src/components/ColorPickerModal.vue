<script setup lang="ts">
import { colorTable } from "../utils/colors";
import { type Ref, inject, onMounted } from "vue";
import type {
  SwatchInterface,
  PalleteInterface,
  modalState,
} from "../utils/types";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "../utils/store";

const modalState = inject<Ref<modalState>>("modalState");
const swatchGroup = inject<Ref<SwatchInterface[]>>("swatchGroup");
const currentPallete = inject<Ref<PalleteInterface[]>>("currentPallete");

function toggleModal() {
  modalState!.value.isOpen = !modalState!.value.isOpen;
}

function updateSwatches(color: string, tag: string) {
  console.log(`updateSwatches ${color} ${tag}`);
  console.log(modalState?.value);
  if (modalState?.value.mode === "add") {
    const newSwatch: SwatchInterface = {
      id: nanoid(),
      color,
      tag,
    };

    swatchGroup!.value.push(newSwatch);
    updatePallete();
  } else if (modalState?.value.mode === "edit") {
    console.log("edit mode");
    swatchGroup?.value.forEach((swatch) => {
      if (swatch.id === modalState?.value.colorId) {
        swatch.color = color;
        swatch.tag = tag;
      }
    });
    updatePallete();
  } else if (modalState?.value.mode === "delete") {
    console.log("delete mode");
    swatchGroup?.value.forEach((swatch, index) => {
      if (swatch.id === modalState?.value.colorId) {
        swatchGroup?.value.splice(index, 1);
      }
    });
    updatePallete();
  }
}

function updatePallete() {
  currentPallete?.value.forEach((pallete) => {
    if (pallete.id === swatchGroup?.value[0].id) {
      pallete.swatches = swatchGroup?.value;
    }
  });

  saveToLocalStorage("palletes", currentPallete!.value);
}
</script>

<template>
  <div
    v-show="modalState?.isOpen"
    class="flex flex-wrap gap-2 justify-center z-10 absolute top-0 left-0"
  >
    <div
      v-for="(value, name, index) in colorTable"
      :key="index"
      class="w-10 h-10 border border-black transition-all cursor-pointer hover:scale-125"
      :name="name"
      :style="`background-color: ${value}`"
      @click="[toggleModal(), updateSwatches(value, name)]"
    ></div>
  </div>
</template>
