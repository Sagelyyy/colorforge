<script setup lang="ts">
import type { Ref } from "vue";
import { inject } from "vue";
import type { PalleteInterface } from "../utils/types";
import SwatchColor from "./SwatchColor.vue";
import { nanoid } from "nanoid";

const palletes = inject<Ref<PalleteInterface[]>>("currentPallete");
</script>

<template>
  <div
    class="__swatch-modal flex flex-col gap-4 absolute right-0 top-0 bg-slate-500 p-2 w-96"
  >
    <div class="__swatch-controls flex justify-center">
      <button
        @click="palletes?.push({ id: nanoid(), step: 1, swatches: [] })"
        class="bg-slate-700 p-2"
      >
        Add New Pallete
      </button>
    </div>
    <SwatchColor
      v-for="(pallet, index) in palletes"
      :key="pallet.id"
      :swatches="pallet.swatches"
      :currentIndex="index"
    />
  </div>
</template>
