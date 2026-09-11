<script>
  let { title, subtitle, children } = $props();
</script>

<div class="relative min-h-screen overflow-hidden bg-ink text-ivory">
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(110,59,82,0.16),transparent_42%),radial-gradient(ellipse_at_bottom,rgba(20,18,22,1),#070708_70%)]"
  ></div>
  <div
    class="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-plum/25 to-transparent"
  ></div>

  <main class="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
    <p class="mb-10 text-center text-[11px] font-light tracking-[0.42em] text-mist uppercase">
      Atelier
    </p>

    <section class="border border-line/80 bg-panel/80 px-8 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
      <h1 class="font-serif text-[2.35rem] leading-none tracking-tight text-ivory">
        {title}
      </h1>
      <p class="mt-3 text-sm font-light leading-relaxed text-mist">
        {subtitle}
      </p>
      <div class="mt-8">
        {@render children()}
      </div>
    </section>
  </main>
</div>
