import { type ModelRef, type Ref } from "vue";
import {
  type ColorTableInterface,
  type PalleteInterface,
  type SwatchInterface,
} from "../utils/types";
import { colorTable } from "../utils/colors";

export function findColor(
  input: Ref<string>,
  colors: ColorTableInterface,
  output: Ref<string | undefined>
) {
  const regex = /&[0-9]{3}|&[a-zA-Z]/g;
  output.value = input.value.replace(regex, (match) => {
    const color = colors[match];
    return color ? `</span><span style="color: ${color}">` : match;
  });
}

export function setUserSelection(
  e: Event,
  selectedText: Ref<{ start: number; end: number }>
) {
  const target = e.target as HTMLInputElement;
  const selectionStart = target.selectionStart ?? 0;
  const selectionEnd = target.selectionEnd ?? 0;
  selectedText.value = { start: selectionStart, end: selectionEnd };
}

export function applyColors(
  pallete: Ref<PalleteInterface[]>,
  selectedText: Ref<{ start: number; end: number }>,
  inputModel: Ref<string>,
  outputModel: Ref<string | undefined>,
  swatchIndex: number
) {
  const { start, end } = selectedText.value;
  const textSelection = inputModel.value.slice(start, end);
  const step = pallete.value[swatchIndex].step;
  const swatches = pallete.value[swatchIndex].swatches;

  console.log("applyColors");
  console.log(`Pallete: ${JSON.stringify(pallete.value)}`);
  console.log(`Step: ${step}`);
  console.log(`Swatches: ${JSON.stringify(swatches)}`);

  const colorizedText = colorizeText(textSelection, step, swatches);

  inputModel.value =
    inputModel.value.slice(0, start) +
    colorizedText +
    inputModel.value.slice(end);
  findColor(inputModel, colorTable, outputModel);
}

export function colorizeText(
  text: string,
  step: number,
  swatches: SwatchInterface[]
): string {
  console.log("colorizeText");
  console.log(`Step: ${step}`);
  console.log(`Swatches: ${JSON.stringify(swatches)}`);

  let result = swatches[0].tag;
  let nonSpaceCount = 0;
  let swatchIndex = 0;

  for (let i = 0; i < text.length; i++) {
    result += text[i];

    if (text[i] !== " ") {
      nonSpaceCount++;
    }

    if (nonSpaceCount % step === 0 && nonSpaceCount > 0) {
      swatchIndex = (swatchIndex + 1) % swatches.length;
      result += swatches[swatchIndex].tag;
    }
  }

  return result;
}
