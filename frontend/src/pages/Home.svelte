<script>
  import { clearSession } from "../lib/session.js";

  let { user, onLogout } = $props();

  function logout() {
    clearSession();
    onLogout();
  }

  const role = $derived(user?.roles?.name ?? "—");
</script>

<div class="min-h-screen bg-ink text-ivory">
  <header class="flex items-center justify-between border-b border-line px-8 py-5">
    <p class="text-[11px] tracking-[0.42em] text-mist uppercase">Atelier</p>
    <button
      class="text-[11px] tracking-[0.22em] text-mist uppercase transition hover:text-ivory"
      type="button"
      onclick={logout}
    >
      Salir
    </button>
  </header>

  <main class="mx-auto max-w-xl px-8 py-24">
    <p class="text-[11px] tracking-[0.28em] text-plum-soft uppercase">Sesión iniciada</p>
    <h1 class="mt-4 font-serif text-5xl leading-tight">{user?.full_name}</h1>
    <p class="mt-4 text-sm font-light text-mist">{user?.email}</p>
    <p class="mt-10 border-t border-line pt-6 text-sm font-light text-mist">
      Rol: <span class="text-ivory">{role}</span>
    </p>
  </main>
</div>
