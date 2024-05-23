<script setup lang="ts">
import { colorTable, type ColorTableInterface } from "../utils/colors";
import { ref } from "vue";

let inputModel = "";
let outputModel = ref("");

const boxStyle =
  "bg-black p-4 self-center border border-gray-600 resize-none w-full h-2/6";

function findColor(input: string, colors: ColorTableInterface) {
  const regex = /&[0-9]{3}|&[a-zA-Z]/g;
  outputModel.value = input.replace(regex, (match) => {
    const color = colors[match];
    return color ? `</span><span style="color: ${color}">` : match;
  });
}
</script>

<template>
  <div class="flex flex-col justify-center gap-6 lg:w-3/5 m-auto h-dvh">
    <textarea
      :class="boxStyle"
      v-model="inputModel"
      @input="findColor(inputModel, colorTable)"
    ></textarea>
    <div :class="boxStyle">
      <span v-html="outputModel"></span>
    </div>
  </div>
</template>
