<script>
  import { fly, fade } from "svelte/transition";
  import { onMount, createEventDispatcher } from "svelte";

  let dispatch = createEventDispatcher();
  let leftPos = Math.random() * 30 - 10;

  onMount(() => {
    setTimeout(() => {
      dispatch("end");
    }, 500);
  });
</script>

<div
  class="heart-container"
  in:fly={{ y: 100, duration: 1500 }}
  out:fade
  on:outroend={() => dispatch("end")}
>
  <p class="love-class" style="--leftPos: {leftPos}px">❤️</p>
</div>

<style>
  .heart-container {
    position: absolute;
    left: 50%;
  }

  .love-class {
    position: relative;
    display: inline-block;
    animation: float 0.8s infinite alternate;
  }

  @keyframes float {
    0% {
      left: var(--leftPos);
    }
    100% {
      left: calc(-1 * var(--leftPos));
    }
  }
</style>
