<script>
  import { onMount } from "svelte";
  import { colorTable as colors } from "../utils/colors";
  import { textInputStore, textSelectionStore } from "../store.js";
  import sanitizeHtml from "sanitize-html";
  import { fade } from "svelte/transition";

  let textInput = "";
  let textOutput = "";
  let togglePreamble = false;
  let toggleHelp = false;
  textInputStore.subscribe((value) => {
    textInput = value;
    updateColor();
  });
  const preamble =
    "&YB&Oro&zad&Wc&wa&zst&Oin&Yg N&Oe&zt&ww&zo&Or&Yk [&wCorellia&R(&zPrivate Signal&R)&Y]&z:&w";

  function handleHelp() {
    toggleHelp = !toggleHelp;
    console.log(toggleHelp);
  }

  function handlePreamble() {
    togglePreamble = !togglePreamble;
    updateColor();
  }

  function updateSelection(e) {
    const { selectionStart, selectionEnd } = e.target;
    textSelectionStore.set({ start: selectionStart, end: selectionEnd });
    console.log($textSelectionStore);
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
    let combinedInput =
      (togglePreamble ? preamble + "\n" : "") + sanitizedInput;
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
  <button class="sw-button" on:click={handlePreamble}>Toggle Broadcast</button>
  <button class="sw-button" on:click={handleHelp}>Help!</button>
  {#if toggleHelp}
    <div id="helpBox" transition:fade={{ duration: 300 }}>
      <h2>How to Use this App:</h2>
      <ol>
        <li>Type in your text in the text input field.</li>
        <li>If needed, manually add color tags to your text.</li>
        <li>
          Select your desired color swatches on the right side of the app.
        </li>
        <li>
          Highlight the portion of your text in the top input box that you want
          to colorize.
        </li>
        <li>
          Click the 'Colorize' button to apply the colors from your selected
          swatch to the highlighted text.
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
  <textarea
    placeholder="Start typing your colors here..."
    class="color-input"
    cols="40"
    rows="10"
    bind:value={textInput}
    on:input={updateColor}
    on:select={updateSelection}
  />
  <div class="color-output">{@html textOutput}</div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
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
    box-sizing: border-box;
    margin-bottom: 20px;
    font-size: 18px;
    resize: none;
  }

  .color-input::placeholder {
    color: white;
  }

  .color-output {
    border-radius: 10px;
    background-color: black;
    color: white;
    width: 48%;
    min-height: 250px;
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
</style>
