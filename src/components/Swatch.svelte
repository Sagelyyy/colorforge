<script>
  import { nanoid } from "nanoid";
  import { colorTable as colors } from "../utils/colors.js";
  import { getRandColor } from "../utils/colors.js";
  import {
    saveToLocalStorage,
    loadFromLocalStorage,
  } from "../utils/localStorage.js";
  import SwatchGroup from "./SwatchGroup.svelte";
  import ColorPickerModal from "./ColorPickerModal.svelte";
  import { swatchGroups } from "../swatchStore.js";
  import { fly } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { selectedGroupStore } from "../selectedGroupStore.js";

  const pullTabPosition = tweened(0, {
    duration: 500,
    easing: cubicOut,
  });
  let dataStr;
  let selectedSwatch = null;
  let displaySwatchModal = true;
  let sgX = 400;

  export let colorKeys = Object.keys(colors);

  $swatchGroups = loadFromLocalStorage("swatchGroups") || [
    {
      id: nanoid(),
      step: 1,
      swatches: [{ id: nanoid(), colorKey: getRandColor() }],
    },
  ];

  $: {
    saveToLocalStorage("swatchGroups", $swatchGroups);
    dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify($swatchGroups));
  }

  function showSwatchModal() {
    displaySwatchModal = !displaySwatchModal;
    pullTabPosition.set(displaySwatchModal ? 0 : sgX);
  }

  function deleteAllPalettes() {
    $swatchGroups = [];
  }

  function importFromJson(e) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      $swatchGroups = JSON.parse(event.target.result);
    };
    fileReader.readAsText(e.target.files[0]);
  }

  function addSwatchGroup() {
    const newId = nanoid();
    $swatchGroups = [
      ...$swatchGroups,
      {
        id: newId,
        step: 1,
        swatches: [{ id: nanoid(), colorKey: getRandColor() }],
      },
    ];
  }

  function openColorPicker(event, groupId) {
    selectedSwatch = event.detail;
    selectedGroupStore.set(groupId);
  }

  function deleteSwatch(event) {
    const { groupId, swatchId } = event.detail;
    $swatchGroups = $swatchGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            swatches: group.swatches.filter((swatch) => swatch.id !== swatchId),
          }
        : group
    );
  }

  function updateColor(colorKey) {
    $swatchGroups = $swatchGroups.map((group) =>
      group.id === selectedSwatch.groupId
        ? {
            ...group,
            swatches: group.swatches.map((swatch) =>
              swatch.id === selectedSwatch.swatchId
                ? { ...swatch, colorKey }
                : swatch
            ),
          }
        : group
    );
    selectedSwatch = null;
  }

  function deleteSwatchGroup(event) {
    const groupId = event.detail;
    $swatchGroups = $swatchGroups.filter((group) => group.id !== groupId);
  }
</script>

<div
  on:click={showSwatchModal}
  class="slideOutTab"
  style="transform: translate3d({$pullTabPosition}px, 0, 0); right:{sgX}px;"
>
  <div>
    {#if displaySwatchModal}
      <p>Hide Palettes</p>
    {:else}
      <p>Show Palettes</p>
    {/if}
  </div>
</div>

{#if displaySwatchModal}
  <div
    class="swatch-content"
    bind:clientWidth={sgX}
    transition:fly={{ y: 0, x: 400, duration: 500 }}
  >
    <a href={dataStr} download="swatch_groups.json" class="sw-button"
      >Export your colors</a
    >
    <p>Import your colors</p>
    <input
      class="swatch-import"
      type="file"
      accept=".json"
      on:change={importFromJson}
    />
    <button class="sw-button" on:click={addSwatchGroup}>Add Palette</button>
    <button class="sw-button delete" on:click={deleteAllPalettes}
      >Clear Palettes</button
    >

    {#each $swatchGroups as group (group.id)}
      <SwatchGroup
        bind:group
        on:openColorPicker={(e) => {
          openColorPicker(e, group.id);
        }}
        on:deleteSwatch={deleteSwatch}
        on:deleteSwatchGroup={deleteSwatchGroup}
      />
    {/each}
  </div>
{/if}

{#if selectedSwatch}
  <ColorPickerModal
    {colorKeys}
    colorKey={selectedSwatch.colorKey}
    on:selectColor={(event) => updateColor(event.detail)}
  />
{/if}

<style>
  .slideOutTab {
    z-index: 2;
    margin-top: 50px;
    position: absolute;
    top: 30%;
    height: 200px;
    width: 40px;
    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    background: var(--lotj-yellow);
    border-radius: 15px 0px 0px 15px;
    cursor: pointer;
    font-family: "Montserrat", "Courier New", Courier, monospace;
  }

  .slideOutTab div {
    text-align: center;
    position: relative;
    right: 70px;
    top: 90px;
    background: var(--lotj-yellow);
    width: 180px;
    -webkit-transform: rotate(270deg);
    -moz-transform: rotate(270deg);
    -o-transform: rotate(270deg);
    writing-mode: lr-tb;
    font-family: "Montserrat", "Courier New", Courier, monospace;
  }

  .swatch-content {
    z-index: 1;
    padding-top: 1rem;
    background-color: var(--background-accent);
    position: absolute;
    overflow-y: scroll;
    width: 400px;
    height: 92vh;
    right: 0;
    top: 0;
    color: white;
    box-shadow: -5px 10px 30px black;
  }

  .swatch-import {
    height: 50px;
    width: 90%;
  }
</style>
