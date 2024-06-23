<script setup lang="ts">
import { colorTable } from "../utils/colors";
import { ref, provide, type Ref, onMounted, watch } from "vue";
import SwatchModal from "./SwatchModal.vue";
import ColorPickerModal from "../components/ColorPickerModal.vue";
import MiniSwatchModal from "../components/MiniSwatchModal.vue";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/store";
import type { SwatchInterface, ModalStateInterface } from "../utils/types";
import {
  findColor,
  setUserSelection,
  removeColors,
} from "../utils/colorFunctions";
import { nanoid } from "nanoid";

const modalState: Ref<ModalStateInterface> = ref({
  isOpen: false,
  mode: "add",
});
const swatchModalState: Ref<boolean> = ref(true);
const inputModel: Ref = ref("");
const outputModel: Ref = ref("");
const selectedText: Ref = ref({ start: 0, end: 0 });
const swatchGroup: Ref<SwatchInterface[]> = ref([]);
const currentPalette: Ref = ref(loadFromLocalStorage("Palettes"));
provide("currentPalette", currentPalette);
provide("modalState", modalState);
provide("swatchGroup", swatchGroup);
provide("selectedText", selectedText);
provide("inputModel", inputModel);
provide("outputModel", outputModel);

onMounted(() => {
  currentPalette.value = loadFromLocalStorage("Palettes") || [
    {
      id: nanoid(),
      step: 5,
      swatches: [
        {
          id: nanoid(),
          color: "rgb(215, 215, 0)",
          tag: "&184",
        },
      ],
    },
    {
      id: nanoid(),
      step: 2,
      swatches: [
        {
          id: nanoid(),
          color: "rgb(0, 255, 135)",
          tag: "&048",
        },
      ],
    },
  ];
});

watch(currentPalette, () => {
  saveToLocalStorage("Palettes", currentPalette.value);
});

watch(inputModel, () => {
  findColor(inputModel, colorTable, outputModel);
});

function handleMouse(e: Event) {
  // Capture user selection in textarea
  setUserSelection(e, selectedText);
  `handleMouse ${JSON.stringify(selectedText.value)}`;
}

function handleSwatchModal() {
  swatchModalState.value = !swatchModalState.value;
  return swatchModalState.value;
}

function handleRemove() {
  removeColors(inputModel, outputModel);
}

function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const json = JSON.parse(event.target.result as string);
        currentPalette.value = json;
        saveToLocalStorage("Palettes", currentPalette.value);
      }
    };
    reader.readAsText(file);
  }
}

const boxStyle = `bg-black p-4 self-center border border-gray-600
  resize-none h-2/6 w-full lg:w-1/2`;
</script>

<template>
  <div>
    <ColorPickerModal />
    <MiniSwatchModal
      :handleSwatchModal="handleSwatchModal"
      :swatchModalState="swatchModalState"
    />
    <Transition name="slide">
      <SwatchModal
        v-show="swatchModalState"
        :handleImport="handleImport"
        :handleSwatchModal="handleSwatchModal"
        :handleRemove="handleRemove"
      />
    </Transition>
    <div class="flex flex-col justify-center gap-6 m-auto h-dvh -mt-10">
      <div class="flex gap-2 justify-center"></div>
      <textarea
        :class="boxStyle"
        v-model="inputModel"
        @mouseup="handleMouse"
        spellcheck="false"
      ></textarea>
      <div :class="boxStyle">
        <span v-html="outputModel"></span>
      </div>
    </div>
  </div>
</template>

<style>
.slide-enter-active {
  animation: slide 0.2s linear forwards;
}

.slide-leave-active {
  animation: slide 0.2s linear reverse;
}

@keyframes slide {
  0% {
    transform: translateX(-90%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
