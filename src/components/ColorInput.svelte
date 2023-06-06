<script>
  import { onMount } from 'svelte';
  import {colorTable as colors} from "../utils/colors"
  import { textInputStore, textSelectionStore } from '../store.js';
  import sanitizeHtml from 'sanitize-html';

  let textInput = '';
  let textOutput = '';
  let togglePreamble = false;
  textInputStore.subscribe(value => {
    textInput = value;
    updateColor();
  });
  const preamble =
  "&YB&Oro&zad&Wc&wa&zst&Oin&Yg N&Oe&zt&ww&zo&Or&Yk [&wCorellia&R(&zPrivate Signal&R)&Y]&z:&w";

  function handlePreamble() {
    togglePreamble = !togglePreamble
    updateColor()
  }

  function updateSelection(e) {
      const { selectionStart, selectionEnd } = e.target;
      textSelectionStore.set({ start: selectionStart, end: selectionEnd });
      console.log($textSelectionStore)
  }

function sanitizeInput(input) {
  let clean = sanitizeHtml(input, {
    allowedTags: [], // No HTML tags are allowed
    allowedAttributes: {}, // No HTML attributes are allowed
  });
  
  clean = clean.replace(/&amp;/g, '&'); // Replace &amp; with &

  return clean;
}

function updateColor() {
    let sanitizedInput = sanitizeInput(textInput);
    textInputStore.set(sanitizedInput);
    textInput = sanitizedInput;

    let outputHtml = '';
    let combinedInput = (togglePreamble ? preamble + "\n" : "") + sanitizedInput;
    let segments = combinedInput.split(/(&\d+|&[A-Za-z])/g);
    let currentColor = 'white';

    for (let i = 0; i < segments.length; i++) {
        if (colors[segments[i]]) {
            currentColor = colors[segments[i]];
        } else {
            let segmentWithPreservedLines = segments[i].replace(/\n/g, '<br>');
            outputHtml += `<span style="color: ${currentColor}">${segmentWithPreservedLines}</span>`;
        }
    }
    textOutput = outputHtml;
}



  onMount(updateColor);
</script>

<div class="content">
    <button on:click={handlePreamble}>Toggle Broadcast</button>
    <textarea
    placeholder="Start typing your colors here..."
    class="color-input"
    cols="40"
    rows="10"
    bind:value={textInput}
    on:input={updateColor}
    on:select={updateSelection}
></textarea>
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

    .color-input:focus{
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

</style>
