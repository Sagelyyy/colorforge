<script setup lang="ts">
import {
  type PalleteInterface,
  type SwatchInterface,
  type modalState,
} from "../utils/types";
import { inject, type Ref } from "vue";
import { applyColors } from "../utils/colorFunctions";
import { saveToLocalStorage } from "../utils/store";

defineProps<{
  swatches: SwatchInterface[];
  currentIndex: number;
}>();

const modalState = inject<Ref<modalState>>("modalState");
const swatchGroup = inject<Ref<SwatchInterface[]>>("swatchGroup");
const currentPallete = inject<Ref<PalleteInterface[]>>("currentPallete");
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
  if (mode === "delete") {
    console.log(`delete ${id}`);
    let isPallete;
    currentPallete?.value.forEach((pallete) => {
      if (pallete.id === id) {
        isPallete = true;
      } else {
        isPallete = false;
      }
    });
    if (isPallete) {
      currentPallete?.value.filter((pallete) => {
        if (pallete.id === id) {
          currentPallete?.value.splice(
            currentPallete?.value.indexOf(pallete),
            1
          );
          saveToLocalStorage("palletes", currentPallete!.value);
          return;
        }
      });
    } else {
      swatchGroup?.value.filter((swatch) => {
        if (swatch.id === id) {
          swatchGroup?.value.splice(swatchGroup?.value.indexOf(swatch), 1);
          saveToLocalStorage("palletes", currentPallete!.value);
          return;
        }
      });
    }
  } else if (mode === "add" || mode === "edit") {
    toggleModal(mode, id);
    setSwatchGroup(swatches);
  }
}

function handleColorize(swatchIndex: number) {
  applyColors(
    currentPallete!,
    selectedText!,
    inputModel!,
    outputModel!,
    swatchIndex
  );
}

function handleStep(e: Event, palleteId: string) {
  currentPallete?.value.forEach((pallete) => {
    if (pallete.id === palleteId) {
      pallete.step = Number((e.target as HTMLInputElement).value);
      saveToLocalStorage("palletes", currentPallete!.value);
    }
  });
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-center">
    <div class="flex gap-2 justify-center">
      <button
        class="self-center bg-slate-700 p-2"
        @click="handleClick('add', undefined, swatches)"
      >
        Add Color
      </button>
      <button
        @click="handleColorize(currentIndex)"
        class="self-center bg-slate-700 p-2"
      >
        Colorize
      </button>
      <button
        class="self-center bg-slate-700 p-2"
        @click="
          handleClick('delete', currentPallete![currentIndex].id, swatches)
        "
      >
        Delete
      </button>
    </div>
    <span class="self-center text-center flex gap-2 justify-center"
      >Color every
      <input
        class="text-black self-center text-center w-16"
        type="number"
        min="1"
        v-model="currentPallete![currentIndex].step"
        @change="handleStep($event, currentPallete![currentIndex].id)"
      />
      letters
    </span>
  </div>
  <div class="flex gap-2 justify-center flex-wrap">
    <div
      v-for="swatch in swatches"
      :key="swatch.id"
      class="w-10 h-10 border border-black transition-all cursor-pointer hover:scale-125 flex justify-end"
      :style="`background-color: ${swatch.color}`"
      @click.self="handleClick('edit', swatch.id, swatches)"
    >
      <span
        class="material-symbols-outlined pt-2 text-md hover:bg-red-400"
        @click.self="handleClick('delete', swatch.id, swatches)"
      >
        delete
      </span>
    </div>
  </div>
</template>
