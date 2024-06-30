:handleClose="() => null"
<script setup lang="ts">
const props = defineProps<{
  handleClose: () => void;
}>();
</script>

<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-10">
    <button
      class="material-symbols-outlined self-end"
      @click="props.handleClose"
    >
      close
    </button>
    <slot name="title"></slot>
    <slot name="content"></slot>
  </div>
</template>
