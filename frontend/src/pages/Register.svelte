<script>
  import AuthStage from "../lib/AuthStage.svelte";
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

<AuthStage current="register" {goLogin} goRegister={() => {}}>
  <div class="brand mb-10 flex items-center gap-3">
    <svg class="h-9 w-9" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M8 36L18 8h6L14 36H8zm16 0L34 8h6L30 36h-6z" fill="#1a1a1a" />
      <path d="M20 22h8v4h-8z" fill="#1a1a1a" />
    </svg>
    <div>
      <p class="font-display text-[2.4rem] leading-none tracking-tight">Panel</p>
      <p class="mt-2 text-sm text-mute">Crear una cuenta</p>
    </div>
  </div>

  <form class="max-w-xs space-y-6" onsubmit={submit}>
    <label class="block">
      <span class="mb-2 block text-[11px] tracking-[0.2em] text-mute uppercase">Nombre</span>
      <input class="field" type="text" autocomplete="name" bind:value={fullName} required />
    </label>
    <label class="block">
      <span class="mb-2 block text-[11px] tracking-[0.2em] text-mute uppercase">Correo</span>
      <input class="field" type="email" autocomplete="email" bind:value={email} required />
    </label>
    <label class="block">
      <span class="mb-2 block text-[11px] tracking-[0.2em] text-mute uppercase">Contraseña</span>
      <input
        class="field"
        type="password"
        autocomplete="new-password"
        bind:value={password}
        required
        minlength="8"
      />
    </label>
    {#if error}
      <p class="text-sm text-red-800/80">{error}</p>
    {/if}
    <button class="btn-ink" type="submit" disabled={loading}>
      {loading ? "Creando…" : "Registrarme"}
    </button>
  </form>
</AuthStage>
