<script setup lang="ts">
import { colorTable, type ColorTableInterface } from "../utils/colors";
import { ref } from "vue";

let inputModel = "";
let outputModel = ref("");

function findColor(input: string, colors: ColorTableInterface) {
  const regex = /&[0-9]{3}|&[a-zA-Z]/g;
  outputModel.value = input.replace(regex, (match) => {
    const color = colors[match];
    return color ? `</span><span style="color: ${color}">` : match;
  });
}
</script>

<template>
  <div class="flex flex-col justify-center gap-6 lg:w-3/5 m-auto mt-8">
    <textarea
      class="bg-black p-4 self-center border border-gray-600 resize-none w-full"
      name=""
      id=""
      cols="30"
      rows="10"
      v-model="inputModel"
      @input="findColor(inputModel, colorTable)"
    ></textarea>
    <div class="p-4 w-full border border-gray-600 h-36">
      <span v-html="outputModel"></span>
    </div>
  </div>
</template>
