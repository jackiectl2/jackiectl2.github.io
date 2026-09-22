(() => {
  const carUrl = "https://car.jackiectl.com/?view=3d";

  function init() {
    const switchLink = document.querySelector(`#nav-menu a[href="${carUrl}"]`);
    const headerActions = document.querySelector("#site-header [data-search-toggle]")?.parentElement;
    if (switchLink && headerActions) {
      const menuItem = switchLink.parentElement;
      switchLink.classList.add("dimension-corner-link");
      switchLink.setAttribute("aria-label", "Switch to the 3D website");
      switchLink.removeAttribute("target");
      headerActions.prepend(switchLink);
      menuItem.remove();
    }

    const url = new URL(window.location.href);
    const enter2d = url.searchParams.get("view") === "2d";
    if (enter2d) {
      url.searchParams.delete("view");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }

    const isHome = window.location.pathname === "/" || window.location.pathname === "/index.html";
    if (!isHome || enter2d) return;

    const dialog = document.createElement("dialog");
    dialog.className = "dimension-choice";
    dialog.setAttribute("aria-labelledby", "dimension-welcome-title");
    dialog.innerHTML = `
      <section data-stage="welcome">
        <p class="dimension-choice-kicker">TIANLANG (JACKIE) CHEN · PERSONAL WEBSITE</p>
        <h1 id="dimension-welcome-title">Welcome to Jackie's Website.</h1>
        <p class="dimension-choice-lead">This is my personal website. You can explore it in 3D or 2D.</p>
        <div class="dimension-choice-actions welcome">
          <button class="dimension-choice-action primary" type="button" data-continue>Continue <span aria-hidden="true">→</span></button>
        </div>
      </section>
      <section data-stage="choice" hidden>
        <p class="dimension-choice-kicker">TIANLANG (JACKIE) CHEN · PERSONAL WEBSITE</p>
        <h1 id="dimension-choice-title" tabindex="-1">Choose a version.</h1>
        <p class="dimension-choice-lead">How would you like to explore my website?</p>
        <div class="dimension-choice-actions">
          <a class="dimension-choice-action primary" href="${carUrl}">Enter 3D Website <span aria-hidden="true">↗</span></a>
          <button class="dimension-choice-action secondary" type="button" data-enter-2d>Enter 2D Website <span aria-hidden="true">→</span></button>
        </div>
      </section>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector("[data-continue]").addEventListener("click", () => {
      dialog.querySelector('[data-stage="welcome"]').hidden = true;
      dialog.querySelector('[data-stage="choice"]').hidden = false;
      dialog.setAttribute("aria-labelledby", "dimension-choice-title");
      dialog.querySelector("#dimension-choice-title").focus();
    });
    dialog.querySelector("[data-enter-2d]").addEventListener("click", () => {
      dialog.close();
      dialog.remove();
    });
    dialog.showModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
