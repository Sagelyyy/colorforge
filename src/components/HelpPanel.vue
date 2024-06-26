<script setup lang="ts">
import ButtonVue from "./ButtonVue.vue";
import DetailsVue from "./DetailsVue.vue";
</script>

<template>
  <div
    class="absolute right-0 top-0 w-1/5 bg-zinc-800 p-4 flex flex-col gap-2 overflow-y-auto lg:[height:calc(100dvh-2rem)] z-10"
  >
    <h4 class="text-xl">📖 How to Use ColorForge</h4>
    <DetailsVue>
      <template #title> What is ColorForge? </template>
      <template #content>
        ColorForge is a tool that allows you to quickly create and edit colors
        for the MUD Legends of The Jedi.
      </template>
    </DetailsVue>
    <DetailsVue>
      <template #title> What is Legends of the Jedi? </template>
      <template #content>
        Legends of the Jedi is a Multi-User Dungeon (MUD) roleplaying game that
        you connect to using a client. You can find out more
        <a
          class="underline text-blue-500 hover:text-blue-600"
          target="_blank"
          href="https://www.legendsofthejedi.com/"
          >here.</a
        >
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
        in the bottom box. Colors are a set of 3 numbers preceded by & from
        0-255 (examples would be &005 or &124). There are a set of stock colors
        as well:
        <div class="bg-black text-yellow-300 px-2">
          <code>
            &x - Black <br />
            &r - Red <br />
            &g - Green<br />
            &O - Orange <br />
            &b - Dark Blue <br />
            &p - Purple <br />
            &c - Cyan <br />
            &w - Gray <br />
            &z - Dark Grey <br />
            &R - Light Red <br />

            &G - Light Green <br />&Y - Yellow <br />&B - Blue <br />&P - Pink
            <br />&C - Light Blue <br />
            &W - White <br />
          </code>
        </div>
      </template>
    </DetailsVue>
    <DetailsVue>
      <template #title>How do I add palettes and swatches?</template>
      <template #content>
        Above the help icon you can toggle the side panel by clicking the icon.
        Here you can hover over buttons to see what they do. Simply click "Add
        new palette" to create a new Palette, then click the "Add color" button
        to add colors to the palette.
      </template>
    </DetailsVue>
    <DetailsVue>
      <template #title>How do I use the swatches in my palettes?</template>
      <template #content>
        To use the swatches, simply highlight the text you want to color in the
        top box, then click the "Color text" button. You can change how often
        your colors are inserted into the text by changing the number "Color
        every X letters.".
      </template>
    </DetailsVue>
  </div>
</template>
