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

	:global(span){
		user-select: none;
	}

	    :global(button) {
        background-color: var(--primary-background);
        color: #FFD700;
        padding: 10px 20px;
        border: 2px solid #FFD700;
        border-radius: 4px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 20px;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 2px;
		max-width: 270px;
		max-height: 50px;
    }

    :global(button:hover) {
        background-color: #FFD700;
        color: #000;
    }

    :global(button:active) {
        background-color: #b38600;
        color: #000;
        transform: translateY(2px);
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