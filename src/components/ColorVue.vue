<script setup lang="ts">
import { colorTable } from "../utils/colors";
import {
  type ColorTableInterface,
  type PalleteInterface,
  type SwatchInterface,
} from "../utils/types";
import { ref } from "vue";
import { nanoid } from "nanoid";
import { getRandTag, getRandColor } from "../utils/colors";
import SwatchModal from "./SwatchModal.vue";

let inputModel = ref("");
let outputModel = ref("");
let selectedText = ref({ start: 0, end: 0 });
let testPallete = ref<PalleteInterface[]>([
  {
    id: nanoid(),
    step: 6,
    swatches: [
      {
        id: nanoid(),
        color: getRandColor(),
        tag: getRandTag(),
      },
      {
        id: nanoid(),
        color: getRandColor(),
        tag: getRandTag(),
      },
      {
        id: nanoid(),
        color: getRandColor(),
        tag: getRandTag(),
      },
    ],
  },
  {
    id: nanoid(),
    step: 6,
    swatches: [
      {
        id: nanoid(),
        color: getRandColor(),
        tag: getRandTag(),
      },
      {
        id: nanoid(),
        color: getRandColor(),
        tag: getRandTag(),
      },
      {
        id: nanoid(),
        color: getRandColor(),
        tag: getRandTag(),
      },
    ],
  },
]);

const boxStyle =
  "bg-black p-4 self-center border border-gray-600 resize-none w-full h-2/6";

function findColor(input: string, colors: ColorTableInterface) {
  const regex = /&[0-9]{3}|&[a-zA-Z]/g;
  outputModel.value = input.replace(regex, (match) => {
    const color = colors[match];
    return color ? `</span><span style="color: ${color}">` : match;
  });
}

function setUserSelection(e: Event) {
  const target = e.target as HTMLInputElement;
  const selectionStart = target.selectionStart ?? 0;
  const selectionEnd = target.selectionEnd ?? 0;
  selectedText.value = { start: selectionStart, end: selectionEnd };
}

function applyColors() {
  const { start, end } = selectedText.value;
  const textSelection = inputModel.value.slice(start, end);

  const step = testPallete.value[0].step;
  const swatches = testPallete.value[0].swatches;
  const colorizedText = colorizeText(textSelection, step, swatches);

  inputModel.value =
    inputModel.value.slice(0, start) +
    colorizedText +
    inputModel.value.slice(end);
  findColor(inputModel.value, colorTable);
}

function colorizeText(
  text: string,
  step: number,
  swatches: SwatchInterface[]
): string {
  let result = swatches[0].tag;
  let nonSpaceCount = 0;
  let swatchIndex = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] !== " ") {
      nonSpaceCount++;
    }
    if (nonSpaceCount > 0 && nonSpaceCount % step === 0) {
      swatchIndex = (swatchIndex + 1) % swatches.length;
      result += swatches[swatchIndex].tag;
      nonSpaceCount = 0;
    }
    result += text[i];
  }
  return result;
}
</script>

<template>
  <SwatchModal :palletes="testPallete" client:load />
  <div class="flex flex-col justify-center gap-6 lg:w-3/5 m-auto h-dvh">
    <button @click="applyColors()">Apply</button>
    <textarea
      :class="boxStyle"
      v-model="inputModel"
      @mouseup="(e) => setUserSelection(e)"
      @input="findColor(inputModel, colorTable)"
    ></textarea>
    <div :class="boxStyle">
      <span v-html="outputModel"></span>
    </div>
  </div>
</template>
