<script>
  import SceneCanvas from "./SceneCanvas.svelte";

  let { current = "login", goLogin, goRegister, children } = $props();
</script>

<div class="relative min-h-screen overflow-hidden bg-paper text-ink">
  <SceneCanvas />
  <div class="grain pointer-events-none absolute inset-0"></div>

  <header class="relative z-10 flex items-center justify-between px-8 py-6 md:px-12">
    <p class="font-display text-sm tracking-[0.42em] text-gold uppercase">RESONANCE</p>
    <button class="btn-login" type="button">Acceder</button>
  </header>

  <main class="relative z-10 flex min-h-[calc(100vh-8.5rem)] items-center px-8 pb-24 pt-4 md:px-12">
    <div class="w-full max-w-5xl">
      {@render children()}
    </div>
  </main>

  <div class="player pointer-events-none absolute inset-x-0 bottom-0 z-10">
    <div class="flex items-center gap-4 px-8 py-3 md:px-12">
      <span class="h-2 w-2 rounded-full bg-gold/80"></span>
      <p class="min-w-0 flex-1 truncate text-[11px] tracking-[0.18em] text-mute uppercase">
        Ahora · Silencio analógico
      </p>
      <div class="hidden h-[2px] flex-1 bg-line sm:block">
        <div class="h-full w-1/3 bg-gold/70"></div>
      </div>
      <p class="text-[11px] tabular-nums text-mute">01:14 / 04:02</p>
    </div>
  </div>
</div>
