<script>
  import { colorTable as colors } from "../utils/colors";
  import { createEventDispatcher } from "svelte";

  export let swatch;
  export let group;

  const dispatch = createEventDispatcher();
</script>

<div class="swatch-box">
  <div
    class="swatch"
    style="background-color: {colors[swatch.colorKey]}"
    on:click|stopPropagation={() => {
      dispatch("openColorPicker", {
        groupId: group.id,
        swatchId: swatch.id,
        colorKey: swatch.colorKey,
      });
    }}
  />
  <span
    class="material-symbols-outlined delete-swatch"
    on:click|stopPropagation={() =>
      dispatch("deleteSwatch", { groupId: group.id, swatchId: swatch.id })}
    >delete</span
  >
</div>

<style>
  .swatch-box {
    position: relative;
    flex: 1 0 20%;
    max-width: 50px;
    height: 40px;
    background-color: #1e90ff;
    border: 1px solid var(--background-accent);
    transition: transform 0.5s;
    border: 1px solid white;
  }

  .swatch-box:hover {
    transform: scale(1.1);
    cursor: pointer;
  }

  .swatch {
    width: 100%;
    height: 100%;
    content: " ";
    background-color: #1e90ff;
    transition: all 0.5s;
    border: 1px solid var(--background-accent);
  }

  .delete-swatch {
    position: absolute;
    right: 0;
    top: 0;
    width: 33.33%;
    height: 100%;
    background: red;
    border: none;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s, transform 0.5s;
    box-sizing: border-box;
  }

  .swatch-box:hover .delete-swatch {
    opacity: 0.7;
    transform: scale(1.1);
  }
</style>
