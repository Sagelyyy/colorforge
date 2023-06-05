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
	:root{
		--primary-background: #1a1a1d;
		--background-accent: #4e4e50;
	}

	:global(body){
		background-color: var(--primary-background);
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