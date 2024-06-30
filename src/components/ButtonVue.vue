<script setup lang="ts">
const props = defineProps<{
  click?: () => void;
  bgColor: string;
  hoverColor: string;
  text?: string;
  hoverText?: string;
  materialIcon?: string;
}>();
</script>

<template>
  <div
    @click="props.click"
    :class="`${props.bgColor} ${props.hoverColor}`"
    class="group flex gap-2 border border-black p-2 cursor-pointer justify-center text-center rounded-md relative select-none hover:scale-105 transition-all z-50"
  >
    <slot></slot>
    <span class="material-symbols-outlined self-center">
      {{ props.materialIcon }}
    </span>
    <p v-show="props.text">{{ props.text }}</p>
    <p
      v-if="props.hoverText"
      class="group-hover:opacity-100 transition-opacity bg-gray-800 text-sm text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 -translate-y-10 opacity-0 w-max px-2 py-1 pointer-events-none"
    >
      {{ props.hoverText }}
    </p>
  </div>
</template>
