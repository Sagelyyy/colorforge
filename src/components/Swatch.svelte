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

  let dataStr;
  let selectedSwatch = null;

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

  function deleteAllPalettes() {
    $swatchGroups = [
      {
        id: nanoid(),
        step: 1,
        swatches: [{ id: nanoid(), colorKey: getRandColor() }],
      },
    ];
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

  function openColorPicker(event) {
    selectedSwatch = event.detail;
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

<div class="swatch-content">
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
      on:openColorPicker={openColorPicker}
      on:deleteSwatch={deleteSwatch}
      on:deleteSwatchGroup={deleteSwatchGroup}
    />
  {/each}
</div>

{#if selectedSwatch}
  <ColorPickerModal
    {colorKeys}
    colorKey={selectedSwatch.colorKey}
    on:selectColor={(event) => updateColor(event.detail)}
  />
{/if}

<style>
  .swatch-content {
    padding-top: 1rem;
    background-color: var(--background-accent);
    position: absolute;
    overflow-y: scroll;
    width: 400px;
    height: 88vh;
    right: 0;
    top: 0;
    color: white;
    box-shadow: -5px 10px 30px black;
  }

  .swatch-import {
    height: 50px;
    width: 90%;
  }

  .delete {
    background-color: rgb(82, 22, 22);
  }
</style>
