<script>
  import { blank_object } from "svelte/internal";

  let githubLink = "https://github.com/Sagelyyy";
</script>

<footer>
  <p>
    Created by <a href={githubLink} target="_blank" rel="noopener noreferrer"
      >Chris</a
    >
  </p>

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
      box-shadow: 1px -10px 30px black;
    }

    a {
      color: var(--lotj-yellow);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</footer>
