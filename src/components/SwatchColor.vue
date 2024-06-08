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
  setSwatchGroup(swatches);

  if (mode === "delete") {
    deleteItem(id);
  } else if (mode === "add" || mode === "edit") {
    toggleModal(mode, id);
  }
}

function deleteItem(id: string | undefined) {
  if (!id) return;

  const isPallete = currentPallete?.value.some((pallete) => pallete.id === id);

  if (isPallete) {
    console.log(`delete pallete ${id}`);
    const palleteIndex = currentPallete?.value.findIndex(
      (pallete) => pallete.id === id
    );
    if (palleteIndex !== undefined && palleteIndex !== -1) {
      currentPallete?.value.splice(palleteIndex, 1);
      saveToLocalStorage("palletes", currentPallete!.value);
    }
  } else {
    console.log(`delete swatch ${id}`);
    const swatchIndex = swatchGroup?.value.findIndex(
      (swatch) => swatch.id === id
    );
    if (swatchIndex !== undefined && swatchIndex !== -1) {
      swatchGroup?.value.splice(swatchIndex, 1);
      saveToLocalStorage("palletes", currentPallete!.value);
    }
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
