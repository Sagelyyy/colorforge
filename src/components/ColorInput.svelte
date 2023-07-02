<script>
  import { onMount } from "svelte";
  import { colorTable as colors } from "../utils/colors";
  import {
    textInputStore,
    textSelectionStore,
    selectedColors,
    prevTextStore,
  } from "../store.js";
  import sanitizeHtml from "sanitize-html";
  import { fade } from "svelte/transition";
  import { swatchGroups } from "../swatchStore";
  import { selectedGroupStore } from "../selectedGroupStore.js";

  let textInput = "";
  let textOutput = "";
  let togglePreamble = false;
  let toggleHelp = false;
  let selectedGroup;
  let colorsFromSwatches = [];
  let outputSize = "650";
  let inputX;
  let inputY;

  selectedGroupStore.subscribe((value) => {
    selectedGroup = value;
  });

  $: if (selectedGroup) {
    const group = $swatchGroups.find((group) => group.id === selectedGroup);
    if (group) {
      colorsFromSwatches = group.swatches.map((swatch) => swatch.colorKey);
    }
  }

  textInputStore.subscribe((value) => {
    textInput = value;
    updateColor();
  });

  const preamble =
    "&YB&Oro&zad&Wc&wa&zst&Oin&Yg N&Oe&zt&ww&zo&Or&Yk [&wCorellia&R(&zPrivate Signal&R)&Y]&z:&w";

  function undoInput() {
    textInputStore.set($prevTextStore);
  }

  function handleHelp() {
    toggleHelp = !toggleHelp;
  }

  function handlePreamble() {
    togglePreamble = !togglePreamble;
    updateColor();
  }

  function updateSelection(e) {
    const { selectionStart, selectionEnd } = e.target;
    textSelectionStore.set({ start: selectionStart, end: selectionEnd });
  }

  function sanitizeInput(input) {
    let clean = sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    });

    clean = clean.replace(/&amp;/g, "&");

    return clean;
  }

  function updateColor() {
    let sanitizedInput = sanitizeInput(textInput);
    textInputStore.set(sanitizedInput);
    textInput = sanitizedInput;

    let outputHtml = "";
    let combinedInput = (togglePreamble ? preamble : "") + sanitizedInput;
    let segments = combinedInput.split(/(&\d+|&[A-Za-z])/g);
    let currentColor = "white";

    for (let i = 0; i < segments.length; i++) {
      if (colors[segments[i]]) {
        currentColor = colors[segments[i]];
      } else {
        let segmentWithPreservedLines = segments[i].replace(/\n/g, "<br>");
        outputHtml += `<span style="color: ${currentColor}">${segmentWithPreservedLines}</span>`;
      }
    }
    textOutput = outputHtml;
  }

  onMount(updateColor);
</script>

<div class="content">
  <div class="interface">
    <button class="sw-button" on:click={handlePreamble}>Toggle Broadcast</button
    >
    <button class="sw-button" on:click={handleHelp}>Help!</button>
    <div class="output-slider">
      <p>Buffer Width</p>
      <p>{outputSize}px</p>
      <input
        type="range"
        min="1"
        max="895"
        bind:value={outputSize}
        class="slider"
        list="values"
      />
      <datalist id="values">
        <option value="650" />
      </datalist>
    </div>
  </div>
  {#if toggleHelp}
    <div id="helpBox" transition:fade={{ duration: 300 }}>
      <h2>How to use Colorforge:</h2>
      <ol>
        <li>Type in your text in the text input field.</li>
        <li>If needed, manually add color tags to your text.</li>
        <li>
          Select your desired color swatches on the right side of the app! Click
          add color to add a new color. Click on a color to change the color.
          Hover and click on the trash can to remove a color.
        </li>
        <li>
          Highlight the portion of your text in the top input box that you want
          to colorize.
        </li>
        <li>
          Click the 'Colorize' button to apply the colors from your selected
          palette to the highlighted text.
        </li>
        <li>
          Change the value in the 'step counter' field to modify how often
          colors are inserted into the text. The value represents the number of
          characters between color changes.
        </li>
      </ol>
      <p>Enjoy coloring your text with ease!</p>
    </div>
  {/if}
  <div class="color-content">
    <div class="input-undo">
      <span on:click={undoInput} class="material-symbols-outlined"> undo </span>
    </div>
    <textarea
      bind:clientWidth={inputX}
      bind:clientHeight={inputY}
      placeholder="Start typing your colors here..."
      class="color-input"
      cols="40"
      rows="10"
      bind:value={textInput}
      on:input={updateColor}
      on:select={updateSelection}
      style="width: {outputSize}px;"
    />
    <div class="color-output">
      <div class="color-width" style="width: {outputSize}px;">
        {@html textOutput}
      </div>
    </div>
  </div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .color-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100vw;
    height: 560px;
    align-items: center;
  }

  .input-undo {
    position: relative;
    width: 32px;
    height: 32px;
    top: 45px;
    left: 450px;
    border: 1px solid var(--background-accent);
    margin-bottom: 5px;
    cursor: pointer;
    z-index: 2;
    transition: all 0.5s;
    text-align: center;
  }

  .input-undo:hover {
    background-color: lightgray;
  }

  .color-input:focus {
    outline: none !important;
  }

  .color-input {
    background-color: var(--primary-background);
    border: 1px solid var(--background-accent);
    color: white;
    border-radius: 10px;
    padding: 20px;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    font-size: 18px;
    resize: none;
  }

  .color-input::placeholder {
    color: white;
  }

  .color-output {
    border-radius: 10px;
    overflow-y: auto;
    background-color: black;
    color: white;
    width: 48%;
    height: 100%;
    font-size: 18px;
    line-height: 1.6;
    text-align: left;
    padding: 20px;
    border: 1px solid rgba(255, 255, 0, 0.521);
  }

  #helpBox {
    position: absolute;
    left: 0;
    max-width: 450px;
    background-color: var(--background-accent);
    color: white;
    border: 1px solid var(--lotj-yellow);
    border-radius: 5px;
    padding: 15px;
    margin-top: 20px;
    text-align: left;
  }

  #helpBox h2 {
    color: var(--lotj-yellow);
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  #helpBox ol {
    margin-left: 10px;
  }

  #helpBox ol li {
    margin-bottom: 10px;
  }

  #helpBox p {
    color: var(--offset-color);
  }

  .output-slider {
    border-radius: 10px;
    border: 1px solid var(--background-accent);
    padding: 5px;
  }

  .output-slider > p {
    color: var(--lotj-yellow);
  }

  .interface {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .interface > button {
    align-self: center;
  }
</style>
