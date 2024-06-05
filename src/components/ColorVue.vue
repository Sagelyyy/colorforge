<script setup lang="ts">
import { colorTable } from "../utils/colors";
import { ref, provide, type Ref, onMounted, watch } from "vue";
import SwatchModal from "./SwatchModal.vue";
import ColorPickerModal from "../components/ColorPickerModal.vue";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/store";
import type {
  SwatchInterface,
  PalleteInterface,
  modalState,
} from "../utils/types";
import { findColor, setUserSelection } from "../utils/colorFunctions";
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

const boxStyle =
  "bg-black p-4 self-center border border-gray-600 resize-none w-full h-2/6";
</script>

<template>
  <div>
    <ColorPickerModal />
    <SwatchModal v-if="swatchModalState" />
    <div class="flex flex-col justify-center gap-6 lg:w-3/5 m-auto h-dvh">
      <button @click="handleSwatchModal" class="self-center bg-slate-700 p-2">
        Show Swatches
      </button>
      <textarea
        :class="boxStyle"
        v-model="inputModel"
        @mouseup="handleMouse"
      ></textarea>
      <div :class="boxStyle">
        <span v-html="outputModel"></span>
      </div>
    </div>
  </div>
</template>
