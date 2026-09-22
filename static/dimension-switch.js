(() => {
  const carUrl = "https://car.jackiectl.com/?view=3d";

  function init() {
    const switchLink = document.createElement("a");
    switchLink.className = "dimension-corner-link";
    switchLink.href = carUrl;
    switchLink.textContent = "3D Car ↗";
    switchLink.setAttribute("aria-label", "Switch to the 3D car website");
    document.body.appendChild(switchLink);

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
        <p class="dimension-choice-lead">This is my personal website. I share my education, research, and projects here in two different ways.</p>
        <div class="dimension-choice-actions welcome">
          <button class="dimension-choice-action primary" type="button" data-continue>Continue <span aria-hidden="true">→</span></button>
        </div>
      </section>
      <section data-stage="choice" hidden>
        <p class="dimension-choice-kicker">TIANLANG (JACKIE) CHEN · PERSONAL WEBSITE</p>
        <h1 id="dimension-choice-title" tabindex="-1">Choose your dimension.</h1>
        <p class="dimension-choice-lead">Explore the same personal journey in an interactive 3D car ride, or read it here as a 2D website.</p>
        <div class="dimension-choice-actions">
          <a class="dimension-choice-action primary" href="${carUrl}">Enter the 3D Car Website <span aria-hidden="true">↗</span></a>
          <button class="dimension-choice-action secondary" type="button" data-enter-2d>Continue to the 2D Website <span aria-hidden="true">→</span></button>
        </div>
        <p class="dimension-choice-note">The 3D car ride works best on a desktop browser.</p>
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
