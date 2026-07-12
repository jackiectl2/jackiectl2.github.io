# CLAUDE.md — site-2d (jackiectl.github.io)

Project memory for the 2D personal site. The parent `personal_website/CLAUDE.md` and
the user-level `~/.claude/CLAUDE.md` both load automatically; this file adds only
what is specific to this repo. **Code and comments here are English-only.**

## What this is

A **Hugo Blox** site, built on the [Academic CV](https://github.com/HugoBlox/hugo-theme-academic-cv)
template (**MIT** — `LICENSE.md` must stay verbatim). Static site, deployed to
GitHub Pages by GitHub Actions. Default branch `master`. Live:
<https://jackiectl.github.io>.

### History: this repo used to be something else

It was originally a clone of `bencentra/centrarium` (Jekyll), redesigned by hand.
The owner found the result too plain and asked for something flashier, with motion
and a bright palette, built on a popular off-the-shelf project rather than hand-written
CSS. **The whole Jekyll site was replaced by Hugo Blox on 2026-07-11 and the git
history was squashed to a single commit**, so `git log` no longer shows any of it.
Centrarium code no longer exists here — do not credit it, and do not go looking for
`_config.yml` / `_layouts` / `_sass`.

### Why not al-folio

al-folio (15.8k stars, the AI-researcher default) was built out with the same content
and shown side by side. The owner picked Hugo Blox because it is far more animated
and colourful. **This was an informed aesthetic call, not an accident — do not
"helpfully" revert it toward a plainer academic look.**

### AmberLJC's site — settled, do not re-litigate

`AmberLJC.github.io` came up repeatedly as a reference. Facts, established by
inspection:

- Her repo is a **fork of centrarium**, 132 commits ahead, and she **deleted the MIT
  LICENSE**.
- GitHub reports its license as **`null`**.
- The `README.md` in it declaring **CC BY-SA 3.0** is the *unmodified README of the
  `orderedlist/minimal` theme*, left behind from an early copy. It describes a theme
  she no longer uses. Her actual CSS (`theme-1-minimal.css`, CSS custom properties)
  is her own work.
- Even taken at face value, **CC BY-SA is copyleft** — building on it would force this
  whole site to be CC BY-SA too.

→ **Her code cannot be copied.** Imitating a *layout genre* is fine (that is not
copyrightable); copying her stylesheets is not.

## Customization — additive only, never patch the theme

| Where | What |
|---|---|
| `data/authors/me.yaml` | The entire profile. |
| `content/_index.md` | Homepage section order = **CV order**: Education → Internship → Research → Skills → Additional. Nav in `config/_default/menus.yaml` matches. |
| `content/projects/*/` | One folder per project + `featured.png`. |
| `layouts/_partials/hooks/head-end/custom.html` | Motion layer. Uses Hugo Blox's **own `head-end` hook** (`partial "functions/get_hook"`), so no theme file is edited. |
| `layouts/_partials/hbx/blocks/<id>/block.html` | Block overrides. The module mounts `blox/` → `layouts/_partials/hbx/blocks/`, so a project file at the same path **wins**. Two exist: `resume-languages` (name inside the ring, no bogus "100%") and `resume-experience` (adds `design.hide_education`, since the hero already renders education). |
| `assets/media/icon.svg` | Favicon. Overrides the theme's default red "H" — the theme picks up `media/icon.svg` from the project automatically. |

### Things that are not obvious

- **There is no `<main>` element.** CSS scoped to `main ...` silently matches
  nothing. This cost a debugging cycle.
- Section headings are written **three different ways**: `<h2>`, `<h3>`, and
  `<div class="text-3xl font-bold">`. Style all three or headings look inconsistent.
- The site name in the header comes from `params.yaml` → `site.name`, **not** from
  `hugo.yaml` → `title`.
- Skill progress bars only render `{{ if gt $level 0 }}` — so **omitting `level`** in
  the author YAML removes them. No override needed.
- The collection block defaults to **`count: 5`**, which silently hid the trailing
  "to be continued" card. It is now explicitly `count: 0` (unlimited). Never let a
  default cap hide entries.

## Local toolchain — three version walls (all worked around in scratch)

The cluster's own modules are all slightly too old. Everything lives in
`/scratch/nmasoud_owned_root/nmasoud_owned1/ctlang/pw-cache/sandbox/bin/`:

1. **Hugo `extended` will not run** — it needs GLIBC 2.34; RHEL 8 has **2.28**.
   Use the **standard** (pure-Go, static) Hugo binary instead, and let the npm
   Tailwind CLI do the CSS. `module load go/1.25.7` is required (Hugo Modules).
2. **`module load node.js/22.14.0` is 0.01 too old.** Hugo ≥ 0.164 uses
   `registerHooks` from `node:module`, added in Node **22.15**. Downloaded Node
   22.23 into scratch.
3. **Tailwind CLI** must be installed (`npm install`).

⚠️ **`node_modules` must live IN the repo — do not symlink it out to scratch.** That
is what 铁律 C prescribes, and it *breaks this build*: Hugo runs the Tailwind CLI
under Node's permission model, which refuses to read outside the project tree, so a
symlink resolving to `/scratch` dies with `Access to this API has been restricted.`
It is only 105 MB and it is gitignored, so the cost is small and never reaches
GitHub. This is a deliberate, size-checked exception.

```bash
SB=/scratch/nmasoud_owned_root/nmasoud_owned1/ctlang/pw-cache/sandbox
module load go/1.25.7
export PATH="$SB/bin:$PWD/node_modules/.bin:$PATH"   # scratch node FIRST
export GOPATH=$SB/gopath HUGO_CACHEDIR=$SB/hugocache
hugo server --disableFastRender --bind 0.0.0.0 --port 4020
```

**None of this affects CI** — GitHub's Ubuntu runners have current glibc/Node and use
Hugo extended normally. This is a local-preview problem only.

### Previewing from the browser

Claude's background servers are **not** auto-forwarded by VS Code (it only forwards
what its own terminals start). Tell the user to add the port by hand in the **PORTS**
panel, or to open an SSH tunnel.

### Headless screenshots

`firefox --headless --screenshot out.png --window-size=1400,2600 URL` works, and
Claude can Read the PNG — the design loop is closed without the user looking.
⚠️ **Lazy-loaded images render as grey boxes** in these captures. That is a
screenshot artifact, not a broken image. Check a short page to confirm.

## The CV

`static/uploads/resume.pdf` ← `tools/build-cv.sh`, which compiles the LaTeX in
`../cv` (Overleaf-backed). **LaTeX does build on this machine** — TinyTeX is in
`$HOME/.TinyTeX` with `tlmgr`. Two traps: TinyTeX does **not** symlink `biber` into
`~/bin` (put `$HOME/.TinyTeX/bin/x86_64-linux` on PATH), and **latexmk replays its
cached failure** until the outdir is wiped.

## Deployment

Actions builds and publishes on every push to `master`. Pages was enabled by the
workflow itself via `actions/configure-pages` with `enablement: true` — the
**fine-grained PAT cannot enable Pages** (`POST /repos/{o}/{r}/pages` → 403). The PAT
*can* push workflow files.

**No custom domain.** `github.io` is free and sufficient; `jackiectl.com` is reserved
for the 3D site only.

## Still open

- No blog posts yet.
- Project cover images are **procedurally generated geometry**, not AI illustrations —
  Claude has no image-generation model here. Replace them if the owner supplies real art.
- Publications is empty by design ("In preparation"). Fill `content/publications/`
  when papers exist. **Do not delete the section.**
