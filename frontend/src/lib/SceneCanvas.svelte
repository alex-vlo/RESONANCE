<script>
  import { onMount } from "svelte";
  import { createWorld } from "./scene/createWorld.js";

  let canvas = $state();

  onMount(() => {
    const world = createWorld(canvas);
    return () => world.destroy();
  });
</script>

<canvas bind:this={canvas} class="pointer-events-none absolute inset-0 h-full w-full"></canvas>
