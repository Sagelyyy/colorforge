<script setup lang="ts">
import { type SwatchInterface } from "../utils/types";
import { inject, type Ref } from "vue";

const modalState = inject<Ref<boolean>>("modalState");

function toggleModal() {
  if (!modalState) {
    throw new Error("modalState not provided");
  }
  modalState.value = !modalState.value;
}

const props = defineProps<{
  swatches: SwatchInterface[];
}>();
</script>

<template>
  <div class="flex flex-col gap-2 justify-center">
    <div class="flex gap-2 justify-center">
      <button class="self-center bg-slate-700 p-2" @click="toggleModal()">
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
      class="w-10 h-10 border border-black transition-all hover:scale-125 cursor-pointer"
      :style="`background-color: ${swatch.color}`"
      v-for="swatch in props.swatches"
      :key="swatch.id"
    ></div>
  </div>
</template>
