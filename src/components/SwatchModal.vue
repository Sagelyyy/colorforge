<script setup lang="ts">
import type { Ref } from "vue";
import { inject } from "vue";
import type { PaletteInterface } from "../utils/types";
import SwatchColor from "./SwatchColor.vue";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "../utils/store";
import ButtonVue from "./ButtonVue.vue";
import { Base64 } from "js-base64";
const Palettes = inject<Ref<PaletteInterface[]>>("currentPalette");

defineProps<{
  handleImport: (e: Event) => void;
  handleSwatchModal: () => void;
  handleRemove: () => void;
}>();

function addNewPalette() {
  Palettes?.value.push({ id: nanoid(), step: 1, swatches: [] });
  saveToLocalStorage("Palettes", Palettes!.value);
}

function clearPalettes() {
  Palettes!.value = [];
  saveToLocalStorage("Palettes", Palettes!.value);
}

function importPalette() {
  navigator.clipboard.readText().then((text) => {
    if (Base64.isValid(text)) {
      const newPalette = JSON.parse(Base64.decode(text));
      newPalette.id = nanoid();
      Palettes?.value.push(newPalette);
      saveToLocalStorage("Palettes", Palettes!.value);
    } else {
      alert("Invalid palette string");
    }
  });
}
</script>

<template>
  <div
    class="__swatch-modal flex flex-col gap-4 absolute bg-slate-500 bottom-16 top-2/4 p-2 w-dvw overflow-x-visible overflow-y-auto lg:[height:calc(100dvh-2rem)] lg:left-8 lg:top-0 lg:w-1/5 z-0"
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
      <div class="flex gap-2 justify-center border-b-2 border-b-slate-700 p-2">
        <ButtonVue
          :click="() => addNewPalette()"
          :bgColor="'bg-green-500'"
          :hoverColor="'hover:bg-green-600'"
          :materialIcon="'add_circle'"
          :hoverText="'Add new palette'"
        />
        <ButtonVue
          :click="() => importPalette()"
          :bgColor="'bg-blue-500'"
          :hoverColor="'hover:bg-blue-600'"
          :materialIcon="'file_upload'"
          :hoverText="'Import swatch from clipboard'"
        />
        <ButtonVue
          :click="() => handleRemove()"
          :bgColor="'bg-slate-700'"
          :hoverColor="'hover:bg-slate-800'"
          :materialIcon="`invert_colors_off`"
          :hoverText="`Remove all colors from text`"
        />
        <ButtonVue
          :click="() => clearPalettes()"
          :bgColor="'bg-red-500'"
          :hoverColor="'hover:bg-red-600'"
          :materialIcon="'delete_sweep'"
          :hoverText="`Delete all palettes`"
        />
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
