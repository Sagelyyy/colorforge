<script setup lang="ts">
defineProps<{
  handleSwatchModal: () => boolean;
  swatchModalState: boolean;
  handleHelp: () => boolean;
}>();
</script>

<template>
  <div
    class="__swatch-modal flex flex-col gap-4 absolute bg-slate-500 bottom-8 h-8 p-2 w-dvw lg:h-dvh lg:left-0 lg:top-0 lg:w-8 border-r-2 border-zinc-800 z-[4] overflow-hidden"
  >
    <span
      class="material-symbols-outlined self-center lg:top-5 cursor-pointer select-none hover:bg-slate-200 hover:text-slate-500 hover:scale-105 transition-all border border-slate-500"
      :class="swatchModalState ? 'rotate-180' : 'rotate-0'"
      @click="handleSwatchModal"
    >
      left_panel_open
    </span>
    <span
      class="material-symbols-outlined self-center cursor-pointer select-none hover:bg-slate-200 hover:text-slate-500 hover:scale-105 transition-all border border-slate-500"
      @click="handleHelp"
      >help</span
    >
  </div>
</template>
