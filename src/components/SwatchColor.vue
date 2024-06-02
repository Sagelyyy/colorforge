<script setup lang="ts">
import { type PalleteInterface, type SwatchInterface } from "../utils/types";
import { inject, type Ref } from "vue";

defineProps<{
  swatches: SwatchInterface[];
}>();

const modalState = inject<Ref<boolean>>("modalState");
const swatchGroup = inject<Ref<SwatchInterface[]>>("swatchGroup");

function toggleModal() {
  if (!modalState) {
    throw new Error("modalState not provided");
  }
  modalState.value = !modalState.value;
}

function setSwatchGroup(swatches: SwatchInterface[]) {
  if (swatches) {
    swatchGroup!.value = swatches;
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-center">
    <div class="flex gap-2 justify-center">
      <button
        class="self-center bg-slate-700 p-2"
        @click="[toggleModal(), setSwatchGroup(swatches)]"
      >
        Add Color
      </button>
      <button class="self-center bg-slate-700 p-2">Colorize</button>
      <button class="self-center bg-slate-700 p-2">Delete</button>
    </div>
    <span
      >Color every <input class="self-center" type="number" /> letters
    </span>
  </div>
  <div class="flex gap-2 justify-center">
    <div
      v-for="swatch in swatches"
      class="w-10 h-10 border border-black transition-all cursor-pointer hover:scale-125"
      :style="`background-color: ${swatch.color}`"
      @click="[toggleModal(), setSwatchGroup(swatches)]"
    ></div>
  </div>
</template>
