<script setup lang="ts">
import { colorTable } from "../utils/colors";
import { type Ref, inject } from "vue";

const modalState = inject<Ref<boolean>>("modalState");

function toggleModal() {
  if (!modalState) {
    throw new Error("modalState not provided");
  }
  modalState.value = !modalState.value;
}
</script>

<template>
  <div
    v-show="modalState"
    class="flex flex-wrap gap-2 justify-center z-10 absolute top-0 left-0"
  >
    <div
      v-for="(value, name, index) in colorTable"
      class="w-10 h-10 border border-black transition-all cursor-pointer hover:scale-125"
      :name="name"
      :style="`background-color: ${value}`"
      @click="toggleModal()"
    ></div>
  </div>
</template>
