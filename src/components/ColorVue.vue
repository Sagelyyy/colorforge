<script setup lang="ts">
import { colorTable, getRandColor, getRandTag } from "../utils/colors";
import { ref, provide, type Ref, onMounted, watch } from "vue";
import SwatchModal from "./SwatchModal.vue";
import ColorPickerModal from "../components/ColorPickerModal.vue";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/store";
import {
  findColor,
  applyColors,
  setUserSelection,
} from "../utils/colorFunctions";
import { nanoid } from "nanoid";

let modalState = ref(false);
provide("modalState", modalState);
let inputModel: Ref = ref("");
let outputModel: Ref = ref("");
let selectedText: Ref = ref({ start: 0, end: 0 });
let currentPallete: Ref = ref(loadFromLocalStorage("palletes"));

onMounted(() => {
  currentPallete.value = loadFromLocalStorage("palletes") || [
    {
      id: nanoid(),
      step: 1,
      swatches: [
        {
          id: nanoid(),
          color: getRandColor(),
          tag: getRandTag(),
        },
      ],
    },
  ];
});

watch(currentPallete, () => {
  saveToLocalStorage("palletes", currentPallete.value);
});

const boxStyle =
  "bg-black p-4 self-center border border-gray-600 resize-none w-full h-2/6";
</script>

<template>
  <ColorPickerModal client:load />
  <SwatchModal :palletes="currentPallete" client:load />
  <div class="flex flex-col justify-center gap-6 lg:w-3/5 m-auto h-dvh">
    <button
      @click="
        applyColors(currentPallete, selectedText, inputModel, outputModel)
      "
    >
      Apply
    </button>
    <textarea
      :class="boxStyle"
      v-model="inputModel"
      @mouseup="(e) => setUserSelection(e, selectedText)"
      @input="findColor(inputModel, colorTable, outputModel)"
    ></textarea>
    <div :class="boxStyle">
      <span v-html="outputModel"></span>
    </div>
  </div>
</template>
