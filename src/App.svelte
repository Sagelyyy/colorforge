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
    background-color: #000; /* Black background */
    color: var(--lotj-yellow); /* Gold color text */
    font-family: "Courier New", Courier, monospace; /* Monospaced font for a tech look */
    text-decoration: none; /* Remove underline from link */
    display: inline-block; /* Make link behave like a button */
  }

  :global(.sw-button:hover) {
    background-color: var(--lotj-yellow); /* Gold background on hover */
    color: #000; /* Black text on hover */
  }

  :global(.sw-button.delete) {
    background-color: #ff4d4d; /* Red background for delete button */
  }

  :global(.sw-button.delete:hover) {
    background-color: #b33030; /* Darker red on hover for delete button */
    color: #fff; /* White text on hover for delete button */
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
