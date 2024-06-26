<script setup lang="ts">
import { colorTable } from "../utils/colors";
import {
  ref,
  provide,
  type Ref,
  onMounted,
  watch,
  watchEffect,
  type CSSProperties,
  reactive,
} from "vue";
import SwatchModal from "./SwatchModal.vue";
import ColorPickerModal from "../components/ColorPickerModal.vue";
import MiniSwatchModal from "../components/MiniSwatchModal.vue";
import HelpPanel from "../components/HelpPanel.vue";
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
const bufferWidth: Ref<number> = ref(
  loadFromLocalStorage("bufferWidth") || 900
);
const resizeVisibility: Ref<boolean> = ref(false);
const inputModel: Ref = ref("");
const outputModel: Ref = ref("");
const selectedText: Ref = ref({ start: 0, end: 0 });
const swatchGroup: Ref<SwatchInterface[]> = ref([]);
const currentPalette: Ref = ref(loadFromLocalStorage("palettes"));
const helpPanelState: Ref<boolean> = ref(false);
provide("currentPalette", currentPalette);
provide("modalState", modalState);
provide("swatchGroup", swatchGroup);
provide("selectedText", selectedText);
provide("inputModel", inputModel);
provide("outputModel", outputModel);
provide("bufferWidth", bufferWidth);

onMounted(() => {
  currentPalette.value = loadFromLocalStorage("palettes") || [
    {
      id: nanoid(),
      step: 5,
      swatches: [
        {
          id: nanoid(),
          name: "",
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
          name: "",
          color: "rgb(0, 255, 135)",
          tag: "&048",
        },
      ],
    },
  ];
});

watch(bufferWidth, () => saveToLocalStorage("bufferWidth", bufferWidth.value));

watch(currentPalette, () => {
  saveToLocalStorage("palettes", currentPalette.value);
});

watch(inputModel, () => {
  findColor(inputModel, colorTable, outputModel);
});

function handleResize(e: Event) {
  bufferWidth.value = parseInt((e.target as HTMLInputElement).value, 10);
}

function handleResizeVisibility() {
  resizeVisibility.value = !resizeVisibility.value;
  return resizeVisibility.value;
}

function handleMouse(e: Event) {
  setUserSelection(e, selectedText);
  `handleMouse ${JSON.stringify(selectedText.value)}`;
}

function handleSwatchModal() {
  swatchModalState.value = !swatchModalState.value;
  return swatchModalState.value;
}

function handleHelp() {
  helpPanelState.value = !helpPanelState.value;
  return helpPanelState.value;
}

function handleRemove() {
  removeColors(inputModel, outputModel);
}

function handleIpsum() {
  inputModel.value =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
}

function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const json = JSON.parse(event.target.result as string);
        currentPalette.value = json;
        saveToLocalStorage("palettes", currentPalette.value);
      }
    };
    reader.readAsText(file);
  }
}

const boxStyle: CSSProperties = reactive({
  width: `${bufferWidth.value}px`,
});

const boxClass =
  "bg-black p-4 self-center border border-gray-600 resize-none h-2/6";

watchEffect(() => {
  boxStyle.width = `${bufferWidth.value}px`;
});
</script>

<template>
  <div>
    <ColorPickerModal />
    <MiniSwatchModal
      :handleSwatchModal="handleSwatchModal"
      :swatchModalState="swatchModalState"
      :handleHelp="handleHelp"
    />
    <Transition name="slide">
      <SwatchModal
        v-show="swatchModalState"
        :handleImport="handleImport"
        :handleSwatchModal="handleSwatchModal"
        :handleRemove="handleRemove"
        :handleResizeVisibility="handleResizeVisibility"
        :handleResize="handleResize"
        :resizeVisibility="resizeVisibility"
        :handleIpsum="handleIpsum"
      />
    </Transition>
    <Transition name="fade">
      <HelpPanel v-show="helpPanelState" />
    </Transition>
  </div>
  <div class="flex flex-col justify-center gap-6 m-auto h-dvh -mt-10 relative">
    <input
      v-if="resizeVisibility"
      class="bg-slate-700 self-center absolute top-1/2"
      type="range"
      min="100"
      max="950"
      v-model="bufferWidth"
      @input="handleResize"
    />
    <div class="flex gap-2 justify-center"></div>
    <textarea
      :class="boxClass"
      :style="boxStyle"
      v-model="inputModel"
      @mouseup="handleMouse"
      spellcheck="false"
      placeholder="Enter text and colors here..."
    ></textarea>
    <div
      :class="boxClass"
      :style="boxStyle"
      class="overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words"
    >
      <span v-html="outputModel"></span>
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

.fade-enter-active {
  animation: fade 0.2s linear forwards;
}

.fade-leave-active {
  animation: fade 0.2s linear reverse;
}

@keyframes slide {
  0% {
    transform: translateX(-90%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
