import { type ModelRef, type Ref } from "vue";
import {
  type ColorTableInterface,
  type PalleteInterface,
  type SwatchInterface,
} from "../utils/types";
import { colorTable } from "../utils/colors";

export function findColor(
  input: ModelRef<string | undefined>,
  colors: ColorTableInterface,
  output: Ref<string | undefined>
) {
  console.log(input.value);

  const regex = /&[0-9]{3}|&[a-zA-Z]/g;
  output.value = input.value!.replace(regex, (match) => {
    const color = colors[match];
    return color ? `</span><span style="color: ${color}">` : match;
  });
  console.log(`findColor: \n input: ${input}, \n output: ${output.value}`);
}

export function setUserSelection(
  e: Event,
  selectedText: Ref<{ start: number; end: number }>
) {
  console.log(`setUserSelection ${JSON.stringify(selectedText.value)}`);
  const target = e.target as HTMLInputElement;
  const selectionStart = target.selectionStart ?? 0;
  const selectionEnd = target.selectionEnd ?? 0;
  selectedText.value = { start: selectionStart, end: selectionEnd };
}

export function applyColors(
  pallete: Ref<PalleteInterface[]>,
  selectedText: Ref<{ start: number; end: number }>,
  inputModel: ModelRef<string | undefined>,
  outputModel: Ref<string | undefined>
) {
  console.log("applyColors");
  const { start, end } = selectedText.value;
  const textSelection = inputModel.value!.slice(start, end);

  const step = pallete.value[0].step;
  const swatches = pallete.value[0].swatches;
  const colorizedText = colorizeText(textSelection, step, swatches);

  inputModel.value =
    inputModel!.slice(0, start) + colorizedText + inputModel!.slice(end);
  findColor(inputModel, colorTable, outputModel);
}

export function colorizeText(
  text: string,
  step: number,
  swatches: SwatchInterface[]
): string {
  console.log("colorizeText");
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
