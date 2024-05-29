import { type Ref } from "vue";
import {
  type ColorTableInterface,
  type PalleteInterface,
  type SwatchInterface,
} from "../utils/types";
import { colorTable } from "../utils/colors";

export function findColor(
  input: string,
  colors: ColorTableInterface,
  outputModel: Ref<string>
) {
  const regex = /&[0-9]{3}|&[a-zA-Z]/g;
  outputModel.value = input.replace(regex, (match) => {
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
  outputModel: Ref<string>
) {
  const { start, end } = selectedText.value;
  const textSelection = inputModel.value.slice(start, end);

  const step = pallete.value[0].step;
  const swatches = pallete.value[0].swatches;
  const colorizedText = colorizeText(textSelection, step, swatches);

  inputModel.value =
    inputModel.value.slice(0, start) +
    colorizedText +
    inputModel.value.slice(end);
  findColor(inputModel.value, colorTable, outputModel);
}

export function colorizeText(
  text: string,
  step: number,
  swatches: SwatchInterface[]
): string {
  let result = swatches[0].tag;
  let nonSpaceCount = 0;
  let swatchIndex = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] !== " ") {
      nonSpaceCount++;
    }
    if (nonSpaceCount > 0 && nonSpaceCount % step === 0) {
      swatchIndex = (swatchIndex + 1) % swatches.length;
      result += swatches[swatchIndex].tag;
      nonSpaceCount = 0;
    }
    result += text[i];
  }
  return result;
}
