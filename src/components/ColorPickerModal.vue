<script setup lang="ts">
import { colorTable } from "../utils/colors";
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center z-10 absolute top-0 left-0">
    <div
      v-for="(value, name, index) in colorTable"
      class="w-10 h-10 border border-black transition-all cursor-pointer hover:scale-125"
      :name="name"
      :style="`background-color: ${value}`"
    ></div>
  </div>
</template>
