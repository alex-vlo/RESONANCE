<script>
  import { onMount } from "svelte";
  import Login from "./pages/Login.svelte";
  import Register from "./pages/Register.svelte";
  import Home from "./pages/Home.svelte";
  import { api } from "./lib/api.js";
  import { clearSession, getToken, getUser } from "./lib/session.js";

  let view = $state("login");
  let user = $state(null);

  function go(path) {
    history.pushState({}, "", path);
    syncFromLocation();
  }

  function syncFromLocation() {
    if (user) {
      view = "home";
      return;
    }
    view = location.pathname === "/register" ? "register" : "login";
  }

  function onSuccess(nextUser) {
    user = nextUser;
    go("/");
  }

  function onLogout() {
    user = null;
    go("/login");
  }

  onMount(() => {
    const stored = getUser();
    const token = getToken();

    if (stored && token) {
      user = stored;
      api.me(token).catch(() => {
        clearSession();
        user = null;
        syncFromLocation();
      });
    }

    syncFromLocation();
    const onPop = () => syncFromLocation();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  });
</script>

{#if view === "home" && user}
  <Home {user} {onLogout} />
{:else if view === "register"}
  <Register {onSuccess} goLogin={() => go("/login")} />
{:else}
  <Login {onSuccess} goRegister={() => go("/register")} />
{/if}
