<script setup lang="ts">
import { colorTable } from "../utils/colors";
import { ref, provide, type Ref, onMounted, watch } from "vue";
import SwatchModal from "./SwatchModal.vue";
import ColorPickerModal from "../components/ColorPickerModal.vue";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/store";
import type { SwatchInterface, modalState } from "../utils/types";
import {
  findColor,
  setUserSelection,
  removeColors,
} from "../utils/colorFunctions";
import { nanoid } from "nanoid";

const modalState: Ref<modalState> = ref({ isOpen: false, mode: "add" });
const swatchModalState: Ref<boolean> = ref(true);
const inputModel: Ref = ref("");
const outputModel: Ref = ref("");
const selectedText: Ref = ref({ start: 0, end: 0 });
const swatchGroup: Ref<SwatchInterface[]> = ref([]);
const currentPallete: Ref = ref(loadFromLocalStorage("palletes"));
provide("currentPallete", currentPallete);
provide("modalState", modalState);
provide("swatchGroup", swatchGroup);
provide("selectedText", selectedText);
provide("inputModel", inputModel);
provide("outputModel", outputModel);

onMounted(() => {
  currentPallete.value = loadFromLocalStorage("palletes") || [
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

watch(currentPallete, () => {
  saveToLocalStorage("palletes", currentPallete.value);
});

watch(inputModel, () => {
  findColor(inputModel, colorTable, outputModel);
});

watch(swatchGroup, () => {
  console.log(`swatchGroup ${JSON.stringify(swatchGroup.value)}`);
});

function handleMouse(e: Event) {
  setUserSelection(e, selectedText);
  console.log(`handleMouse ${JSON.stringify(selectedText.value)}`);
}

function handleSwatchModal() {
  swatchModalState.value = !swatchModalState.value;
}

function handleRemove() {
  removeColors(inputModel, outputModel);
}
const boxStyle = `bg-black p-4 self-center border border-gray-600 
  resize-none h-2/6 w-full lg:w-1/2`;
</script>

<template>
  <div>
    <ColorPickerModal />
    <Transition name="slide">
      <SwatchModal v-show="swatchModalState" />
    </Transition>
    <div class="flex flex-col justify-center gap-6 m-auto h-dvh">
      <button @click="handleSwatchModal" class="self-center bg-slate-700 p-2">
        Show Swatches
      </button>
      <button @click="handleRemove" class="self-center bg-slate-700 p-2">
        Remove Colors
      </button>
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
  animation: slide 0.35s linear forwards;
}

.slide-leave-active {
  animation: slide 0.35s linear reverse;
}

@keyframes slide {
  0% {
    transform: translateX(100%);
    transform: translateY(-200%);
    rotate: 90deg;
  }
  100% {
    transform: translateX(0);
    transform: translateY(0);
    rotate: 0deg;
  }
}
</style>
