<script>
  import AuthShell from "../lib/AuthShell.svelte";
  import { api } from "../lib/api.js";
  import { saveSession } from "../lib/session.js";

  let { onSuccess, goLogin } = $props();

  let fullName = $state("");
  let email = $state("");
  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  async function submit(event) {
    event.preventDefault();
    error = "";
    if (password.length < 8) {
      error = "La contraseña debe tener al menos 8 caracteres";
      return;
    }
    loading = true;
    try {
      const data = await api.register(fullName, email, password);
      saveSession(data.token, data.user);
      onSuccess(data.user);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<AuthShell title="Registro" subtitle="Crea una cuenta para acceder al panel.">
  <form class="space-y-5" onsubmit={submit}>
    <label class="block">
      <span class="mb-2 block text-[11px] tracking-[0.22em] text-mist uppercase">Nombre</span>
      <input
        class="w-full border border-line bg-ink-soft px-3 py-2.5 text-sm text-ivory outline-none transition focus:border-plum-soft"
        type="text"
        autocomplete="name"
        bind:value={fullName}
        required
      />
    </label>

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
        autocomplete="new-password"
        bind:value={password}
        required
        minlength="8"
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
      {loading ? "Creando…" : "Crear cuenta"}
    </button>
  </form>

  <p class="mt-8 text-center text-sm font-light text-mist">
    ¿Ya tienes cuenta?
    <button class="text-ivory underline decoration-plum/70 underline-offset-4" type="button" onclick={goLogin}>
      Entrar
    </button>
  </p>
</AuthShell>
