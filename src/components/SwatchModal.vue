<script setup lang="ts">
import type { Ref } from "vue";
import { nextTick, onMounted, ref } from "vue";
import { inject } from "vue";
import type { PalleteInterface } from "../utils/types";
import SwatchColor from "./SwatchColor.vue";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "../utils/store";

const palletes = inject<Ref<PalleteInterface[]>>("currentPallete");

const div = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  await nextTick();
  div.value = document.querySelector(".__swatch-modal");
  console.log("div --------------- ", div.value);
  const rect = div.value?.getBoundingClientRect();
  console.log("rect --------------- ", rect);
});
function addNewPallete() {
  console.log("addNewPallete");
  palletes?.value.push({ id: nanoid(), step: 1, swatches: [] });
  saveToLocalStorage("palletes", palletes!.value);
}
</script>

<template>
  <div
    class="__swatch-modal flex flex-col gap-4 absolute bg-slate-500 bottom-0 top-2/4 p-2 w-dvw overflow-x-visible overflow-y-auto lg:h-dvh lg:right-0 lg:top-0 lg:w-96 z-[2]"
  >
    <div class="__swatch-controls flex justify-center">
      <button @click="addNewPallete" class="bg-slate-700 p-2">
        Add New Pallete
      </button>
    </div>
    <SwatchColor
      v-for="(pallet, index) in palletes"
      :key="pallet.id"
      :swatches="pallet.swatches"
      :currentIndex="index"
    />
  </div>
</template>

<style>
.__swatch-modal {
  border-left: 3px solid black;
  box-shadow: 0 0 25px black;
}
</style>
