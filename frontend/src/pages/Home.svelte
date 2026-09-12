<script>
  import SceneCanvas from "../lib/SceneCanvas.svelte";
  import { clearSession } from "../lib/session.js";

  let { user, onLogout } = $props();

  function logout() {
    clearSession();
    onLogout();
  }

  const role = $derived(user?.roles?.name ?? "—");
</script>

<div class="relative min-h-screen overflow-hidden bg-paper text-ink">
  <SceneCanvas />
  <div class="grain pointer-events-none absolute inset-0"></div>

  <header class="relative z-10 flex items-center justify-between px-10 py-8">
    <p class="font-display text-sm tracking-[0.42em] text-gold uppercase">RESONANCE</p>
    <button class="text-sm tracking-[0.18em] text-mute uppercase hover:text-gold" type="button" onclick={logout}>
      Salir
    </button>
  </header>

  <main class="relative z-10 px-10 pt-24 md:px-28">
    <p class="text-[11px] tracking-[0.28em] text-mute uppercase">Sesión activa</p>
    <h1 class="mt-4 font-display text-6xl leading-none">{user?.full_name}</h1>
    <p class="mt-5 text-mute">{user?.email}</p>
    <p class="mt-10 text-sm text-mute">Rol · <span class="text-ink">{role}</span></p>
  </main>
</div>
