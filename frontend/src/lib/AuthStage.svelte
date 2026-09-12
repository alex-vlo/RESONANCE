<script>
  import SceneCanvas from "./SceneCanvas.svelte";

  let { current = "login", goLogin, goRegister, children } = $props();
</script>

<div class="relative min-h-screen overflow-hidden bg-paper text-ink">
  <SceneCanvas />
  <div class="grain pointer-events-none absolute inset-0"></div>

  <aside class="absolute top-1/2 left-5 z-10 flex -translate-y-1/2 flex-col items-center gap-6">
    <div class="flex flex-col items-center gap-2 text-[10px] tracking-[0.28em] text-mute uppercase">
      <span class="h-10 w-px bg-line"></span>
      <button
        class="[writing-mode:vertical-rl] rotate-180 {current === 'login' ? 'text-ink' : 'text-mute'}"
        type="button"
        onclick={goLogin}
      >
        Login
      </button>
      <span class="h-1.5 w-1.5 rounded-full {current === 'login' ? 'bg-ink' : 'border border-mute'}"></span>
      <button
        class="[writing-mode:vertical-rl] rotate-180 {current === 'register' ? 'text-ink' : 'text-mute'}"
        type="button"
        onclick={goRegister}
      >
        Registro
      </button>
      <span class="h-1.5 w-1.5 rounded-full {current === 'register' ? 'bg-ink' : 'border border-mute'}"></span>
      <span class="h-10 w-px bg-line"></span>
    </div>
  </aside>

  <main class="relative z-10 flex min-h-screen items-center px-16 py-20 md:px-28">
    <div class="w-full max-w-md">
      {@render children()}
    </div>
  </main>
</div>
