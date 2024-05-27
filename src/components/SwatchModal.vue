<script setup lang="ts">
import type { PalleteInterface } from "../utils/types";
import SwatchColor from "./SwatchColor.vue";

defineProps<{
  palletes: PalleteInterface[];
}>();
</script>

<template>
  <div
    class="__swatch-modal flex flex-col gap-4 absolute right-0 top-0 bg-slate-500 p-2"
  >
    <SwatchColor
      v-for="pallet in palletes"
      :key="pallet.id"
      :swatches="pallet.swatches"
      client:load
    />
  </div>
</template>
