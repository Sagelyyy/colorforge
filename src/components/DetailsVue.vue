<template>
  <details>
    <summary
      class="cursor-pointer bg-slate-600 hover:bg-zinc-700 p-4 transition-colors select-none"
    >
      <slot name="title"></slot>
    </summary>
    <p class="bg-slate-700 p-4 border-t-2 border-t-slate-300">
      <slot name="content"></slot>
    </p>
  </details>
</template>
