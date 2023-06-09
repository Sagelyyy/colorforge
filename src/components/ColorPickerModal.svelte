<script>
  import { colorTable as colors } from "../utils/colors.js";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let colorKeys = Object.keys(colors);
  export let colorKey = null;
  let isOpen = false;

  function selectColor(colorKey) {
    console.log("select color: " + colorKey);
    dispatch("selectColor", colorKey);
    isOpen = false;
  }

  $: if (colorKey) {
    isOpen = true;
  }
</script>

{#if isOpen}
  <div class="modal">
    {#each colorKeys as key}
      <div
        class="color-option"
        style="background-color: {colors[key]}"
        on:click={() => selectColor(key)}
      />
    {/each}
  </div>
{/if}

<style>
  .modal {
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    flex-wrap: wrap;
  }

  .color-option {
    display: inline-block;
    width: 50px;
    height: 50px;
    margin: 5px;
    flex-shrink: 0;
  }
</style>
