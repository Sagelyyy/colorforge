import { type Ref } from "vue";
import {
  type ColorTableInterface,
  type PaletteInterface,
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

export function removeColors(
  input: Ref<string>,
  output: Ref<string | undefined>
) {
  input.value = input.value.replace(/&[0-9]{3}|&[a-zA-Z]/g, "");
  output.value = input.value;
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
  Palette: Ref<PaletteInterface[]>,
  selectedText: Ref<{ start: number; end: number }>,
  inputModel: Ref<string>,
  outputModel: Ref<string | undefined>,
  swatchIndex: number
) {
  const { start, end } = selectedText.value;
  const textSelection = inputModel.value.slice(start, end);
  const step = Palette.value[swatchIndex].step;
  const swatches = Palette.value[swatchIndex].swatches;
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
