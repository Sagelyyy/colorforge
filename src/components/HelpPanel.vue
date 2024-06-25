<script setup lang="ts">
import DetailsVue from "./DetailsVue.vue";
</script>

<template>
  <div class="absolute right-0 top-0 w-1/5 bg-zinc-800 p-4 flex flex-col gap-2">
    <h4 class="text-xl">📖 How to Use ColorForge</h4>
    <DetailsVue>
      <template #title> What is ColorForge? </template>
      <template #content>
        ColorForge is a tool that allows you to quickly create and edit colors.
        For the MUD Legends of The Jedi.
      </template>
    </DetailsVue>
    <DetailsVue>
      <template #title> What are palettes and swatches? </template>
      <template #content>
        A palette contains swatches, and swatches are a group of colors.
      </template>
    </DetailsVue>
    <DetailsVue>
      <template #title>
        How do I use ColorForge to create and edit colors?
      </template>
      <template #content>
        You can write colors directly in the top box and see the colored output
        in the bottom box.
      </template>
    </DetailsVue>
    <DetailsVue>
      <template #title>How do I add palettes and swatches?</template>
      <template #content>
        Above the help icon you can toggle the side panel to open and close the
        modal, here you can hover over buttons to see what they do. Simply click
        "Add new palette" to create a new Palette, then click the "Add color"
        button to add colors to the palette.
      </template>
    </DetailsVue>
    <DetailsVue>
      <template #title>How do I use the swatches in my palettes?</template>
      <template #content>
        To use the swatches, simply highlight the text you want to color in the
        top box, then click the "Color text" button. You can change how often
        your colors are inserted into the text with by changing the number
        "Color every X letters.".
      </template>
    </DetailsVue>
  </div>
</template>
