<script setup lang="ts">
import type { Ref } from "vue";
import { inject } from "vue";
import type { PaletteInterface } from "../utils/types";
import SwatchColor from "./SwatchColor.vue";
import { nanoid } from "nanoid";
import { saveToLocalStorage } from "../utils/store";
import ButtonVue from "./ButtonVue.vue";
import { Base64 } from "js-base64";
import { copyRawColors } from "../utils/colorFunctions";

const palettes = inject<Ref<PaletteInterface[]>>("currentPalette");

defineProps<{
  handleImport: (e: Event) => void;
  handleSwatchModal: () => void;
  handleRemove: () => void;
  handleResizeVisibility: () => boolean;
  handleResize: (e: Event) => void;
  resizeVisibility: boolean;
  handleIpsum: () => void;
  inputModel: string;
}>();

function addNewPalette() {
  if (palettes) {
    palettes.value.push({
      id: nanoid(),
      name: "",
      step: 1,
      swatches: [],
    });
    saveToLocalStorage("palettes", palettes!.value);
  } else {
    return;
  }
}

function clearPalettes() {
  palettes!.value = [];
  saveToLocalStorage("palettes", palettes!.value);
}

function isPalette(palette: PaletteInterface) {
  return (
    typeof palette === "object" &&
    "id" in palette &&
    "step" in palette &&
    "name" in palette &&
    "swatches" in palette &&
    typeof palette.id === "string" &&
    typeof palette.step === "number" &&
    Array.isArray(palette.swatches)
  );
}

function importPalette() {
  navigator.clipboard.readText().then((text) => {
    try {
      if (Base64.isValid(text)) {
        const decodedText = Base64.decode(text);
        const parsedPalette = JSON.parse(decodedText);

        if (isPalette(parsedPalette)) {
          parsedPalette.id = nanoid();
          palettes?.value.push(parsedPalette);
          saveToLocalStorage("palettes", palettes!.value);
        } else {
          alert("Malformed palette data");
        }
      } else {
        alert("Malformed palette data");
      }
    } catch (error) {
      console.error("Error importing palette:", error);
      alert("Malformed palette data");
    }
  });
}
</script>

<template>
  <div
    class="__swatch-modal flex flex-col gap-4 absolute bg-slate-500 bottom-16 top-2/4 p-2 w-dvw overflow-y-auto lg:[height:calc(100dvh-2rem)] lg:left-8 lg:top-0 lg:w-1/5 z-[2]"
  >
    <div class="__swatch-controls flex flex-col items-stretch gap-4">
      <div class="flex flex-col gap-2 justify-evenly">
        <a
          :href="`data:text/json;charset=utf-8,` + JSON.stringify(palettes)"
          download="colors.json"
          class="self-center w-full bg-slate-700 p-2 text-center hover:bg-slate-900"
          >Export palette</a
        >
        <div
          class="flex flex-col gap-2 justify-center bg-slate-700 text-center border border-black p-2"
        >
          <p>Import palette</p>
          <input
            class="bg-slate-800 p-1"
            type="file"
            accept=".json"
            @change="(e) => handleImport(e)"
          />
        </div>
      </div>
      <div
        class="flex gap-2 justify-center border-b-2 border-b-slate-700 p-2 items-center flex-auto flex-wrap z-10"
      >
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
          :hoverText="'Import palette from clipboard'"
        />
        <ButtonVue
          :click="() => clearPalettes()"
          :bgColor="'bg-red-500'"
          :hoverColor="'hover:bg-red-600'"
          :materialIcon="'delete_sweep'"
          :hoverText="`Delete all palettes`"
        />
        <ButtonVue
          :click="() => handleRemove()"
          :bgColor="'bg-slate-700'"
          :hoverColor="'hover:bg-slate-800'"
          :materialIcon="`invert_colors_off`"
          :hoverText="`Remove all colors from text`"
        />
        <ButtonVue
          :click="() => copyRawColors(inputModel)"
          :bgColor="'bg-slate-700'"
          :hoverColor="'hover:bg-slate-800'"
          :materialIcon="`content_copy`"
          :hoverText="`Copy raw colors`"
        />
        <ButtonVue
          :click="() => handleIpsum()"
          :bg-color="`bg-slate-700`"
          :hover-color="`hover:bg-slate-800`"
          :material-icon="`summarize`"
          :hover-text="`Generate ipsum`"
        />
        <ButtonVue
          :click="() => handleResizeVisibility()"
          :bg-color="`bg-slate-700`"
          :hover-color="`hover:bg-slate-800`"
          :material-icon="`sliders`"
          :hover-text="`Adjust buffer width`"
        />
      </div>
    </div>
    <SwatchColor
      v-for="(pallet, index) in palettes"
      :key="pallet.id"
      :swatches="pallet.swatches"
      :currentIndex="index"
    />
  </div>
</template>
