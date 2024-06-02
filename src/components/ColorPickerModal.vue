<script setup lang="ts">
import { colorTable } from "../utils/colors";
import { type Ref, inject, onMounted } from "vue";
import type { SwatchInterface, PalleteInterface } from "../utils/types";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "../utils/store";

const modalState = inject<Ref<boolean>>("modalState");
const swatchGroup = inject<Ref<SwatchInterface[]>>("swatchGroup");
const currentPallete = inject<Ref<PalleteInterface[]>>("currentPallete");

function toggleModal() {
  if (!modalState) {
    throw new Error("modalState not provided");
  }
  modalState.value = !modalState.value;
}

function updateSwatches(color: string, tag: string) {
  const newSwatch: SwatchInterface = {
    id: nanoid(),
    color,
    tag,
  };

  swatchGroup!.value.push(newSwatch);
  updatePallete();
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
    v-show="modalState"
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
