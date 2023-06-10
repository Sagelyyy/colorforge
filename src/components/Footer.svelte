<script>
  import { nanoid } from "nanoid";
  import Heart from "./Heart.svelte";

  let dummyLink = "#";
  let hearts = [];

  function showLove() {
    hearts = [...hearts, { id: nanoid() }];
    console.log(hearts);
  }

  function onHeartEnd(id) {
    hearts = hearts.filter((heart) => heart.id !== id);
  }
</script>

{#each hearts as heart (heart.id)}
  <Heart on:end={() => onHeartEnd(heart.id)} />
{/each}

<footer>
  <p>
    Created with <span class="love-class" on:click={showLove}>❤️</span> by Chris
  </p>
</footer>

<style>
  footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: var(--primary-background);
    color: var(--lotj-yellow);
    text-align: center;
    padding: 1rem 0;
    border-top: 1px solid var(--lotj-yellow);

    z-index: 3;
  }

  .love-class {
    display: inline-block;
    transform-origin: center;
    animation: pulse 5s ease-in-out infinite alternate;
    cursor: pointer;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.4);
    }

    100% {
      transform: scale(1);
    }
  }
</style>
