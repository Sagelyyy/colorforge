<script>
  import { readable } from "svelte/store";
  import { colorTable as colors } from "../utils/colors";

  let titleText = "COLORFORGE";

  const nonBlackColors = Object.entries(colors)
    .filter(([key, value]) => value !== "rgb(0, 0, 0)")
    .map(([key, value]) => value);

  let currentColorIndex = 0;

  let colorStore = readable(nonBlackColors[currentColorIndex], (set) => {
    let intervalId = setInterval(() => {
      currentColorIndex = (currentColorIndex + 1) % nonBlackColors.length;
      set(nonBlackColors[currentColorIndex]);
    }, 2000);
    return () => clearInterval(intervalId);
  });
</script>

<h1 class="title" style="color: {$colorStore}">{titleText}</h1>

<style>
  .title {
    margin: 0 auto;
    text-transform: uppercase;
    font-weight: 100;
    transition: color 2s;
    font-family: "Montserrat", sans-serif;
  }

  @media (min-width: 320px) {
    .title {
      font-size: 2em;
    }
  }

  @media (min-width: 768px) {
    .title {
      font-size: 3em;
    }
  }

  @media (min-width: 1024px) {
    .title {
      font-size: 4em;
    }
  }
</style>
