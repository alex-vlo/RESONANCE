<script>
  import AuthStage from "../lib/AuthStage.svelte";

  let { onSuccess, goRegister } = $props();
</script>

<AuthStage current="login" goLogin={() => {}} {goRegister}>
  <p class="text-[11px] tracking-[0.32em] text-gold/80 uppercase">Archivo sonoro</p>
  <h1 class="mt-4 max-w-xl font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
    Música para escuchar despacio
  </h1>
  <p class="mt-4 max-w-md text-sm font-light leading-relaxed text-mute">
    Vinilo, cinta y archivos de alta resolución. Un catálogo ordenado, sin prisa.
  </p>

  <div class="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <article class="card">
      <p class="card-kicker">01</p>
      <h2 class="card-title">Vinilos</h2>
    </article>
    <article class="card">
      <p class="card-kicker">02</p>
      <h2 class="card-title">Álbumes</h2>
    </article>
    <article class="card">
      <p class="card-kicker">03</p>
      <h2 class="card-title">Hi-Fi Gear</h2>
    </article>
    <article class="card">
      <p class="card-kicker">04</p>
      <h2 class="card-title">Accesorios</h2>
    </article>
    <article class="card">
      <p class="card-kicker">05</p>
      <h2 class="card-title">Colección</h2>
    </article>
    <article class="card">
      <p class="card-kicker">06</p>
      <h2 class="card-title">Digital Hi-Res</h2>
    </article>
  </div>
</AuthStage>
