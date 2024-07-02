<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps<{
  click?: () => void;
  bgColor: string;
  hoverColor: string;
  text?: string;
  hoverText?: string;
  materialIcon?: string;
}>();

const isClicked = ref(false);

function clickWrapper() {
  if (props.click) {
    props.click();
    fly();
  } else {
    console.error("No click function provided");
  }
}

function fly() {
  if (
    props.hoverText == "Share palette" ||
    props.hoverText == "Copy raw colors"
  ) {
    isClicked.value = true;
  }
}

watch(isClicked, () => {
  setTimeout(() => {
    isClicked.value = false;
  }, 600);
});
</script>

<template>
  <div
    @click="clickWrapper()"
    :class="`${props.bgColor} ${props.hoverColor} ${isClicked ? 'z-50' : ''}`"
    class="group flex gap-2 border border-black p-2 cursor-pointer justify-center text-center rounded-md relative select-none hover:scale-105 transition-all z-10"
  >
    <slot></slot>
    <span class="material-symbols-outlined self-center">
      {{ props.materialIcon }}
    </span>
    <p v-show="props.text">{{ props.text }}</p>
    <p
      v-if="isClicked"
      class="absolute left-1/2 -translate-x-1/2 -translate-y-10 fly bg-gray-800 text-sm text-gray-100 rounded-md opacity-0 w-max px-2 py-1 pointer-events-none z-20"
    >
      Copied!!!
    </p>
    <p
      v-if="props.hoverText"
      class="group-hover:opacity-100 transition-opacity bg-gray-800 text-sm text-gray-100 rounded-md absolute left-1/2 -translate-x-1/2 -translate-y-10 opacity-0 w-max px-2 py-1 pointer-events-none z-30"
    >
      {{ props.hoverText }}
    </p>
  </div>
</template>

<style scoped>
.fly {
  animation-fill-mode: initial;
  animation: fly 0.6s linear forwards;
}

@keyframes fly {
  0% {
    opacity: 0;
    transform: translateX(0%);
  }

  60% {
    opacity: 1;
    transform: translateY(-60%);
  }

  80% {
    opacity: 0.5;
    transform: translateY(-80%);
  }

  100% {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
