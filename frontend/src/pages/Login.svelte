<script>
  import AuthShell from "../lib/AuthShell.svelte";
  import { api } from "../lib/api.js";
  import { saveSession } from "../lib/session.js";

  let { onSuccess, goRegister } = $props();

  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  async function submit(event) {
    event.preventDefault();
    error = "";
    loading = true;
    try {
      const data = await api.login(email, password);
      saveSession(data.token, data.user);
      onSuccess(data.user);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<AuthShell title="Entrar" subtitle="Accede con tu correo y contraseña.">
  <form class="space-y-5" onsubmit={submit}>
    <label class="block">
      <span class="mb-2 block text-[11px] tracking-[0.22em] text-mist uppercase">Correo</span>
      <input
        class="w-full border border-line bg-ink-soft px-3 py-2.5 text-sm text-ivory outline-none transition focus:border-plum-soft"
        type="email"
        autocomplete="email"
        bind:value={email}
        required
      />
    </label>

    <label class="block">
      <span class="mb-2 block text-[11px] tracking-[0.22em] text-mist uppercase">Contraseña</span>
      <input
        class="w-full border border-line bg-ink-soft px-3 py-2.5 text-sm text-ivory outline-none transition focus:border-plum-soft"
        type="password"
        autocomplete="current-password"
        bind:value={password}
        required
      />
    </label>

    {#if error}
      <p class="text-sm text-plum-soft">{error}</p>
    {/if}

    <button
      class="mt-2 w-full bg-plum py-2.5 text-[11px] tracking-[0.28em] text-ivory uppercase transition hover:bg-plum-soft disabled:opacity-50"
      type="submit"
      disabled={loading}
    >
      {loading ? "Entrando…" : "Continuar"}
    </button>
  </form>

  <p class="mt-8 text-center text-sm font-light text-mist">
    ¿Aún no tienes cuenta?
    <button class="text-ivory underline decoration-plum/70 underline-offset-4" type="button" onclick={goRegister}>
      Crear una
    </button>
  </p>
</AuthShell>
