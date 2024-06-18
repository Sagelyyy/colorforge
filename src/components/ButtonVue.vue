<script setup lang="ts">
const props = defineProps<{
  click: () => void;
  bgColor: string;
  hoverColor: string;
}>();
</script>

<template>
  <div
    @click="props.click"
    :class="`${props.bgColor} ${props.hoverColor}`"
    class="flex gap-2 bg-green-500 self-center rounded-full cursor-pointer hover:bg-green-600 transition-colors px-[2.5rem] py-2"
  >
    <span class="material-symbols-outlined"> add_circle </span>
    <p>New Palette</p>
  </div>
</template>
