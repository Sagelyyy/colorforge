<script setup lang="ts">
import {
  type PaletteInterface,
  type SwatchInterface,
  type ModalStateInterface,
} from "../utils/types";
import { inject, type Ref } from "vue";
import { applyColors } from "../utils/colorFunctions";
import { saveToLocalStorage } from "../utils/store";
import { Base64 } from "js-base64";
import ButtonVue from "./ButtonVue.vue";

defineProps<{
  swatches: SwatchInterface[];
  currentIndex: number;
}>();

const modalState = inject<Ref<ModalStateInterface>>("modalState");
const swatchGroup = inject<Ref<SwatchInterface[]>>("swatchGroup");
const currentPalette = inject<Ref<PaletteInterface[]>>("currentPalette");
const selectedText =
  inject<Ref<{ start: number; end: number }>>("selectedText");
const inputModel = inject<Ref<string>>("inputModel");
const outputModel = inject<Ref<string>>("outputModel");

function toggleModal(mode: "add" | "edit" | "delete", id?: string) {
  if (mode === "add" || mode === "edit") {
    modalState!.value.isOpen = !modalState!.value.isOpen;
    modalState!.value.mode = mode;
    modalState!.value.colorId = id;
  } else if (mode === "delete") {
    return;
  }
}

function setSwatchGroup(swatches: SwatchInterface[]) {
  if (swatches) {
    swatchGroup!.value = swatches;
  }
}

function handleClick(
  mode: "add" | "edit" | "delete",
  id: string | undefined,
  swatches: SwatchInterface[]
) {
  setSwatchGroup(swatches);

  if (mode === "delete") {
    deleteItem(id);
  } else if (mode === "add" || mode === "edit") {
    toggleModal(mode, id);
  }
}

function deleteItem(id: string | undefined) {
  if (!id) return;

  const isPalette = currentPalette?.value.some((Palette) => Palette.id === id);

  if (isPalette) {
    const PaletteIndex = currentPalette?.value.findIndex(
      (Palette) => Palette.id === id
    );
    if (PaletteIndex !== undefined && PaletteIndex !== -1) {
      currentPalette?.value.splice(PaletteIndex, 1);
      saveToLocalStorage("Palettes", currentPalette!.value);
    }
  } else {
    const swatchIndex = swatchGroup?.value.findIndex(
      (swatch) => swatch.id === id
    );
    if (swatchIndex !== undefined && swatchIndex !== -1) {
      swatchGroup?.value.splice(swatchIndex, 1);
      saveToLocalStorage("Palettes", currentPalette!.value);
    }
  }
}

function handleColorize(swatchIndex: number) {
  applyColors(
    currentPalette!,
    selectedText!,
    inputModel!,
    outputModel!,
    swatchIndex
  );
}

function handleStep(e: Event, PaletteId: string) {
  currentPalette?.value.forEach((Palette) => {
    if (Palette.id === PaletteId) {
      Palette.step = Number((e.target as HTMLInputElement).value);
      saveToLocalStorage("Palettes", currentPalette!.value);
    }
  });
}

function handleShare(PaletteId: string) {
  currentPalette?.value.forEach((Palette) => {
    if (Palette.id === PaletteId) {
      const encodedPalette = Base64.encode(JSON.stringify(Palette));
      navigator.clipboard.writeText(encodedPalette);
    }
  });
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-center">
    <div class="flex gap-2 justify-center">
      <ButtonVue
        :click="() => handleClick('add', undefined, swatches)"
        :bg-color="'bg-green-500'"
        :hover-color="'hover:bg-green-600'"
        :material-icon="`add`"
        :hover-text="'Add color'"
      />
      <ButtonVue
        :click="() => handleColorize(currentIndex)"
        :bg-color="'bg-yellow-500'"
        :hover-color="'hover:bg-yellow-600'"
        :material-icon="`format_paint`"
        :hover-text="'Color text'"
      />
      <ButtonVue
        :click="() => handleClick('delete', currentPalette![currentIndex].id, swatches)"
        :bg-color="'bg-red-500'"
        :hover-color="'hover:bg-red-600'"
        :material-icon="`delete`"
        :hover-text="'Delete swatch'"
      />
      <ButtonVue
        :click="() => handleShare(currentPalette![currentIndex].id)"
        :bg-color="'bg-blue-500'"
        :hover-color="'hover:bg-blue-600'"
        :material-icon="`share`"
        :hover-text="'Share swatch'"
      />
    </div>
    <span class="self-center text-center flex gap-2 justify-center"
      >Color every
      <input
        class="text-black self-center text-center w-16"
        type="number"
        min="1"
        v-model="currentPalette![currentIndex].step"
        @change="handleStep($event, currentPalette![currentIndex].id)"
      />
      letters
    </span>
  </div>
  <div
    class="flex gap-2 justify-center flex-wrap border-b-2 border-b-slate-700 pb-2"
  >
    <div
      v-for="swatch in swatches"
      :key="swatch.id"
      class="w-12 h-12 border border-black transition-all cursor-pointer hover:scale-125 flex justify-end group"
      :style="`background-color: ${swatch.color}`"
      @click.self="handleClick('edit', swatch.id, swatches)"
    >
      <span
        class="material-symbols-outlined pt-3 text-[1.3rem] bg-red-400 group-hover:visible invisible"
        @click.self="handleClick('delete', swatch.id, swatches)"
      >
        delete
      </span>
    </div>
  </div>
</template>
