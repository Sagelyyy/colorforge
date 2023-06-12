<script>
  import { colorTable as colors } from "../utils/colors.js";
  import { createEventDispatcher } from "svelte";
  import { swatchGroups } from "../swatchStore.js";
  import { selectedGroupStore } from "../selectedGroupStore.js";

  const dispatch = createEventDispatcher();

  export let colorKeys = Object.keys(colors);
  export let colorKey = null;
  let isOpen = false;

  let selectedColorKeys = [];

  $: {
    const selectedGroup = $swatchGroups.find(
      (group) => group.id === $selectedGroupStore
    );
    selectedColorKeys = selectedGroup
      ? selectedGroup.swatches.map((swatch) => swatch.colorKey)
      : [];
  }

  function selectColor(colorKey) {
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
        class="color-option {selectedColorKeys.includes(key)
          ? 'highlight'
          : ''}"
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
    background-color: rgba(0, 0, 0, 0.8);
    flex-wrap: wrap;
  }

  .color-option {
    display: inline-block;
    width: 50px;
    height: 50px;
    margin: 5px;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.5s;
  }

  .color-option:hover {
    scale: 1.2;
  }

  .color-option.highlight {
    animation: rainbow 1s linear infinite;
    border: 3px solid;
    box-sizing: border-box;
  }

  @keyframes rainbow {
    0% {
      border-color: red;
    }
    14% {
      border-color: orange;
    }
    28% {
      border-color: yellow;
    }
    42% {
      border-color: lime;
    }
    57% {
      border-color: aqua;
    }
    71% {
      border-color: blue;
    }
    85% {
      border-color: purple;
    }
    100% {
      border-color: red;
    }
  }
</style>
