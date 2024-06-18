<script setup lang="ts">
import type { Ref } from "vue";
import { nextTick, onMounted, ref } from "vue";
import { inject } from "vue";
import type { PaletteInterface } from "../utils/types";
import SwatchColor from "./SwatchColor.vue";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "../utils/store";

const Palettes = inject<Ref<PaletteInterface[]>>("currentPalette");
const div = ref<HTMLDivElement | null>(null);

defineProps<{
  handleImport: (e: Event) => void;
  handleSwatchModal: () => void;
}>();

onMounted(async () => {
  await nextTick();
  div.value = document.querySelector(".__swatch-modal");
  console.log("div --------------- ", div.value);
  const rect = div.value?.getBoundingClientRect();
  console.log("rect --------------- ", rect);
});
function addNewPalette() {
  console.log("addNewPalette");
  Palettes?.value.push({ id: nanoid(), step: 1, swatches: [] });
  saveToLocalStorage("Palettes", Palettes!.value);
}

function clearPalettes() {
  console.log("clearPalettes");
  Palettes!.value = [];
  saveToLocalStorage("Palettes", Palettes!.value);
}
</script>

<template>
  <div
    class="__swatch-modal flex flex-col gap-4 absolute bg-slate-500 bottom-0 top-2/4 p-2 w-dvw overflow-x-visible overflow-y-auto lg:h-dvh lg:left-8 lg:top-0 lg:w-1/5 z-0"
  >
    <div class="__swatch-controls flex flex-col items-stretch gap-4">
      <div class="flex flex-col gap-2 justify-evenly">
        <a
          :href="`data:text/json;charset=utf-8,` + JSON.stringify(Palettes)"
          download="colors.json"
          class="self-center w-full bg-slate-700 p-2 text-center hover:bg-slate-900"
          >Export</a
        >
        <div
          class="flex flex-col gap-2 justify-center bg-slate-700 text-center border border-black p-2"
        >
          <p>Import colors</p>
          <input
            class="bg-slate-800 p-1"
            type="file"
            accept=".json"
            @change="(e) => handleImport(e)"
          />
        </div>
      </div>
      <div
        class="flex flex-col gap-2 justify-center border-b-2 border-b-slate-700 p-2"
      >
        <div
          @click="addNewPalette"
          class="flex gap-2 bg-green-500 self-center rounded-full cursor-pointer hover:bg-green-600 transition-colors px-[2.5rem] py-2"
        >
          <span class="material-symbols-outlined"> add_circle </span>
          <p>New Palette</p>
        </div>
        <div
          @click="clearPalettes"
          class="flex gap-2 bg-red-500 self-center rounded-full cursor-pointer hover:bg-red-600 transition-colors px-8 py-2"
        >
          <span class="material-symbols-outlined"> delete_sweep </span>
          <p>Delete Palettes</p>
        </div>
      </div>
    </div>
    <SwatchColor
      v-for="(pallet, index) in Palettes"
      :key="pallet.id"
      :swatches="pallet.swatches"
      :currentIndex="index"
    />
  </div>
</template>
