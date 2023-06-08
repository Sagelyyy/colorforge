<script>
  import ColorInput from "./components/ColorInput.svelte";
  import Swatch from "./components/Swatch.svelte";
  import Title from "./components/Title.svelte";
</script>

<main>
  <Title />
  <Swatch />
  <ColorInput />
</main>

<style>
  :root {
    --primary-background: #1a1a1d;
    --background-accent: #4e4e50;
    --delete: #da2c38;
    --lotj-yellow: #f9c80e;
    --offset-color: #a3bbad;
  }

  :global(body) {
    background-color: var(--primary-background);
  }

  :global(span) {
    user-select: none;
  }

  :global(.sw-button) {
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 5px;
    transition: background-color 0.2s ease, color 0.2s ease;
    cursor: pointer;
    background-color: #000;
    color: var(--lotj-yellow);
    font-family: "Courier New", Courier, monospace;
    text-decoration: none;
    display: inline-block;
  }

  :global(.sw-button:hover) {
    background-color: var(--lotj-yellow);
    color: #000;
  }

  :global(.sw-button.delete) {
    background-color: #ff4d4d;
  }

  :global(.sw-button.delete:hover) {
    background-color: #b33030;
    color: #fff;
  }

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
