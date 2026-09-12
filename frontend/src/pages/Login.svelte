<script>
  import AuthStage from "../lib/AuthStage.svelte";
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

<AuthStage current="login" goLogin={() => {}} {goRegister}>
  <div class="brand mb-10 flex items-center gap-3">
    <svg class="h-9 w-9" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M8 36L18 8h6L14 36H8zm16 0L34 8h6L30 36h-6z" fill="#1a1a1a" />
      <path d="M20 22h8v4h-8z" fill="#1a1a1a" />
    </svg>
    <div>
      <p class="font-display text-[2.4rem] leading-none tracking-tight">Panel</p>
      <p class="mt-2 text-sm text-mute">Administración · acceso</p>
    </div>
  </div>

  <form class="max-w-xs space-y-6" onsubmit={submit}>
    <label class="block">
      <span class="mb-2 block text-[11px] tracking-[0.2em] text-mute uppercase">Correo</span>
      <input class="field" type="email" autocomplete="email" bind:value={email} required />
    </label>
    <label class="block">
      <span class="mb-2 block text-[11px] tracking-[0.2em] text-mute uppercase">Contraseña</span>
      <input class="field" type="password" autocomplete="current-password" bind:value={password} required />
    </label>
    {#if error}
      <p class="text-sm text-red-800/80">{error}</p>
    {/if}
    <button class="btn-ink" type="submit" disabled={loading}>
      {loading ? "Entrando…" : "Continuar"}
    </button>
  </form>
</AuthStage>
