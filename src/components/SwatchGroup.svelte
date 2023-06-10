<script>
  import { nanoid } from "nanoid";
  import SwatchColor from "./SwatchColor.svelte";
  import { createEventDispatcher } from "svelte";
  import {
    selectedColors,
    textInputStore,
    textSelectionStore,
    prevTextStore,
  } from "../store.js";
  import { selectedGroupStore } from "../selectedGroupStore.js";
  import { swatchGroups } from "../swatchStore.js";
  import { getRandColor } from "../utils/colors.js";

  export let group;

  const dispatch = createEventDispatcher();

  function deleteGroup() {
    dispatch("deleteSwatchGroup", group.id);
  }

  function deleteSwatch(event) {
    const { groupId, swatchId } = event.detail;
    dispatch("deleteSwatch", { groupId, swatchId });
  }

  function addSwatch() {
    group.swatches = [
      ...group.swatches,
      { id: nanoid(), colorKey: getRandColor() },
    ];
  }

  function colorize(groupId) {
    selectedGroupStore.set(groupId);
    prevTextStore.set($textInputStore);
    applyPalette();

    const group = $swatchGroups.find(
      (group) => group.id === $selectedGroupStore
    );
    if (group) {
      selectedColors.set(group.swatches.map((swatch) => swatch.colorKey));
    }
  }

  function applyPalette() {
    let textInput;
    textInputStore.update((value) => {
      textInput = value;
      let selection;
      textSelectionStore.subscribe((value) => {
        selection = value;
      });

      const group = $swatchGroups.find(
        (group) => group.id === $selectedGroupStore
      );
      if (group) {
        const selectedText = textInput.slice(selection.start, selection.end);

        let colorizedText = "";
        let colorIndex = 0;
        let nonSpaceCount = 0;
        for (let i = 0; i < selectedText.length; i++) {
          if (selectedText[i] !== " ") {
            const colorKey =
              group.swatches[colorIndex % group.swatches.length].colorKey;

            if (nonSpaceCount % group.step === 0) {
              colorizedText += colorKey;
              colorIndex++;
            }

            nonSpaceCount++;
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

  $: group.step = Number(group.step);
</script>

<div class="swatch-group">
  <div class="swatch-button-container">
    <button class="sw-button" on:click={addSwatch}>Add Color</button>
    <button class="sw-button" on:click={() => colorize(group.id)}
      >Colorize</button
    >
    <button class="sw-button delete" on:click={deleteGroup}>Delete</button>
    <div class="swatch-step-container">
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
  </div>
  <div class="swatch-container">
    {#each group.swatches as swatch (swatch.id)}
      <SwatchColor
        {swatch}
        {group}
        on:delete={deleteSwatch}
        on:openColorPicker
      />
    {/each}
  </div>
</div>

<style>
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

  .swatch-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
    padding-bottom: 10px;
  }

  .swatch-step-container {
    margin-right: 20px;
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
