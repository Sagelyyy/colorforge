<script setup lang="ts"></script>

<template>
  <footer
    class="w-dvw h-8 absolute left-0 right-0 bottom-0 bg-zinc-800 z-10 flex justify-center select-none"
  >
    <p>
      Made with <span class="cursor-pointer love" @click="">💖</span> by Chris
    </p>
  </footer>
</template>

<style>
.love {
  display: inline-block;
  transform-origin: center;
  animation: pulse 5s ease-in-out infinite alternate;
  cursor: pointer;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.4);
  }

  100% {
    transform: scale(1);
  }
}
</style>
