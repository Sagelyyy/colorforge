<script>
  import { nanoid } from "nanoid";
  import { colorTable as colors } from "../utils/colors.js";
  import { textInputStore, textSelectionStore } from "../store.js";
  import {
    saveToLocalStorage,
    loadFromLocalStorage,
  } from "../utils/localStorage.js";

  let selectedSwatch = null;
  let selectedGroup = null;
  let dataStr = "";

  let swatchGroups = loadFromLocalStorage("swatchGroups") || [
    {
      id: nanoid(),
      step: 1,
      swatches: [{ id: nanoid(), colorKey: getRandColor() }],
    },
  ];

  $: {
    saveToLocalStorage("swatchGroups", swatchGroups);
    dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(swatchGroups));
  }

  function deleteAllPalettes() {
    swatchGroups = [
      {
        id: nanoid(),
        step: 1,
        swatches: [{ id: nanoid(), colorKey: getRandColor() }],
      },
    ];
  }

  function getRandColor() {
    const colorKeys = Object.keys(colors);
    const randomColorKey =
      colorKeys[Math.floor(Math.random() * colorKeys.length)];
    return randomColorKey;
  }

  function importFromJson(e) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      swatchGroups = JSON.parse(event.target.result);
    };
    fileReader.readAsText(e.target.files[0]);
  }

  function addSwatch(groupId) {
    const newId = nanoid();
    swatchGroups = swatchGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            swatches: [
              ...group.swatches,
              { id: newId, colorKey: getRandColor() },
            ],
          }
        : group
    );
  }

  function colorize(groupId) {
    selectedGroup = groupId;
    applyPalette();
  }

  function applyPalette() {
    let textInput;
    textInputStore.update((value) => {
      textInput = value;
      let selection;
      textSelectionStore.subscribe((value) => {
        selection = value;
      });

      const group = swatchGroups.find((group) => group.id === selectedGroup);
      if (group) {
        const selectedText = textInput.slice(selection.start, selection.end);

        let colorizedText = "";
        let colorIndex = 0;
        for (let i = 0; i < selectedText.length; i++) {
          const colorKey =
            group.swatches[colorIndex % group.swatches.length].colorKey;

          if (i % group.step === 0) {
            colorizedText += colorKey;
            colorIndex++;
          }

          colorizedText += selectedText[i];
        }

        textInput =
          textInput.slice(0, selection.start) +
          colorizedText +
          textInput.slice(selection.end);
        return textInput;
      }
    });
  }

  function deleteSwatch(groupId, swatchId) {
    swatchGroups = swatchGroups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            swatches: group.swatches.filter((swatch) => swatch.id !== swatchId),
          }
        : group
    );
  }

  function addSwatchGroup() {
    const newId = nanoid();
    swatchGroups = [
      ...swatchGroups,
      {
        id: newId,
        step: 1,
        swatches: [{ id: nanoid(), colorKey: getRandColor() }],
      },
    ];
  }

  function deleteSwatchGroup(groupId) {
    swatchGroups = swatchGroups.filter((group) => group.id !== groupId);
  }

  function openColorPicker(groupId, swatchId) {
    selectedSwatch = { groupId, swatchId };
  }

  function updateColor(colorKey) {
    swatchGroups = swatchGroups.map((group) =>
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

  {#each swatchGroups as group (group.id)}
    <div class="swatch-group">
      <div class="swatch-button-container">
        <button class="sw-button" on:click={() => addSwatch(group.id)}
          >Add Color</button
        >
        <button class="sw-button" on:click={() => colorize(group.id)}
          >Colorize</button
        >
        <button
          class="sw-button delete"
          on:click={() => deleteSwatchGroup(group.id)}>Delete</button
        >
        <div class="swatch-step-container">
          <span>Color every </span><input
            class="swatch-step"
            type="number"
            min="1"
            bind:value={group.step}
            on:input={(e) => (group.step = Number(e.target.value))}
          /> <span>letters</span>
        </div>
      </div>
      <div class="swatch-container">
        {#each group.swatches as swatch (swatch.id)}
          <div class="swatch-box">
            <div
              class="swatch"
              style="background-color: {colors[swatch.colorKey]}"
              on:click|stopPropagation={() =>
                openColorPicker(group.id, swatch.id)}
            />
            <span
              class="material-symbols-outlined delete-swatch"
              on:click|stopPropagation={() => deleteSwatch(group.id, swatch.id)}
              >delete</span
            >
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
<!-- Color Picker Modal -->
{#if selectedSwatch !== null}
  <div class="modal">
    {#each Object.keys(colors) as colorKey}
      <div
        class="color-option"
        style="background-color: {colors[colorKey]}"
        on:click={() => updateColor(colorKey)}
      />
    {/each}
  </div>
{/if}

<style>
  .swatch-content {
    padding-top: 1rem;
    background-color: var(--background-accent);
    position: absolute;
    overflow-y: scroll;
    width: 400px;
    height: 98vh;
    right: 0;
    top: 0;
    color: white;
    box-shadow: -5px 10px 30px black;
  }

  .swatch-import {
    height: 50px;
    width: 90%;
  }

  .swatch-group {
    padding-bottom: 15px;
    border-top: 3px solid rgb(32, 32, 32) !important;
    padding: 3px;
  }

  .swatch-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .delete {
    background-color: rgb(82, 22, 22);
  }

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

  .swatch-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
    padding-bottom: 10px;
  }

  .swatch-step-container {
    margin-right: 30px;
    align-self: flex-start;
    flex-grow: 0;
  }

  .swatch-step {
    width: 4rem;
    height: 30px;
    border: none;
    border-radius: 5px;
  }
</style>
