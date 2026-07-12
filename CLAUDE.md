# CLAUDE.md — site-2d (jackiectl.github.io)

Project-level memory for the 2D personal site. The parent
`personal_website/CLAUDE.md` and the user-level `~/.claude/CLAUDE.md` both load
automatically; this file adds only what is specific to this repo. **Code and
comments in this repo are English-only.**

## What this is

A Jekyll site cloned from [`bencentra/centrarium`](https://github.com/bencentra/centrarium)
(**MIT** — `LICENSE.md` must stay verbatim). Not a fork: `origin` is
`jackiectl/jackiectl.github.io`, `upstream` is Centrarium, and the 128 upstream
commits are preserved so contributions still count. Default branch `master`.

## Design — do not drift back toward the sources

Two reference points, and the design is deliberately unlike **both**:

| | Ground | Type | Layout | Accent |
|---|---|---|---|---|
| Centrarium (upstream) | white | Roboto Slab / Open Sans | centered blog + cover hero | blue `#2980b9` |
| `AmberLJC.github.io` (the other well-known derivative) | white | **serif** body | centered, round avatar, academic | orange |
| **This site** | **xuan paper `#f6f2ea`** | **IBM Plex Sans / Mono** | **asymmetric: sticky left rail + hairline + stream** | **seal red `#b2382c`**, bamboo `#5e7a57` |

The whole palette and type scale live in `_sass/base/_variables.scss`. The design
itself is `_sass/_layout.scss` (a full rewrite — none of Centrarium's layout
survives). Bourbon/Bitters remain underneath only as a reset.

The vermilion square at the top of the rail is a **seal** (印章) — the one brand
tie to the 3D site. Its glyph is `seal:` in `_config.yml`; set it to `""` to drop it.

## Content is data (铁律 B)

`_data/profile.json` drives every list on the homepage. **No template assumes an
entry count** — adding a project is one JSON object, no HTML/CSS/layout change.
Each list ends in a *visible* "to be continued" placeholder, and Publications
renders even while empty ("In preparation"). Do not delete that section.

Placeholder wording comes from the data's `labels` block (`research_more`,
`timeline_more`, `publications_none`) — that is why the templates contain no CJK.
If you need a new placeholder string, add a label upstream rather than typing it
into a template.

`_data/profile.json` is a **vendored copy** of `../profile-readme/data/profile.json`,
which is the machine-readable projection of `PROFILE.md` (the single source of
truth). A symlink would drift less but breaks when this repo is checked out alone,
so re-sync explicitly:

```bash
tools/sync-profile.sh          # pull the upstream JSON in
tools/sync-profile.sh --check  # non-zero if stale — wire this into CI
```

⚠️ The copy **does** go stale. It already did once. Run `--check` before believing
the site reflects PROFILE.md.

## Running it

Gems live in `vendor/bundle`, symlinked to scratch (铁律 C), so `bundle install`
costs the home budget nothing. Ruby is Lmod, not system.

```bash
module load ruby/3.3.3
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload
```

The login node is fine for this — a dev server is not heavy compute.

### Gotchas already hit

- **`Gemfile.lock` was from 2016** (bundler 1.17.2, which calls `String#untaint`,
  removed in Ruby 3.2). Regenerated. Do not restore it.
- Ruby 3 dropped `webrick`/`csv`/`base64`/`bigdecimal` from stdlib, and kramdown 2
  split out the GFM parser — all four are explicit in the `Gemfile` now.
- **Headless screenshots work**: `firefox --headless --screenshot out.png
  --window-size=1280,3600 http://127.0.0.1:4000/`. Claude can Read the PNG, so the
  design loop is closed without the user having to look.

## Deployment — solved, via Actions

✅ **Live at <https://jackiectl.github.io>** since 2026-07-11.

**GitHub Pages' own Jekyll cannot build this site.** Pages' built-in build runs in
safe mode and only loads plugins from its allowlist; `jekyll-archives` and
`jekyll-paginate-v2` are not on it, so they would be **silently ignored** — the
site would still publish, but `/category/*` and `/blog/page/N/` would 404. (This
is what the "Sorry, not GitHub pages friendly!" comment in upstream's `_config.yml`
was warning about.)

So `.github/workflows/deploy.yml` builds the site itself and hands Pages the
finished `_site/` as a static artifact. Two things make it work without any manual
Settings click:

- `permissions: pages: write, id-token: write` on the job
- `actions/configure-pages@v5` with **`enablement: true`**, which turns Pages on
  and points it at Actions using the job's own `GITHUB_TOKEN`

⚠️ The **fine-grained PAT cannot do this** — `POST /repos/{o}/{r}/pages` returns
403 (`Resource not accessible by personal access token`). Do not waste time
retrying it from the CLI; the in-workflow `GITHUB_TOKEN` is the way. The PAT *can*
push workflow files, so it does carry the Workflows scope.

`bundler-cache: true` in the workflow requires `Gemfile.lock` to stay committed.

## Still open

- **No CV PDF.** The rail has no `cv` entry. `cv/` is LaTeX on Overleaf and this
  machine's TeX is incomplete (missing `upquote.sty` + Cochineal), so the PDF has
  to come from Overleaf.
- **The long About bio is unwritten** (`PROFILE.md` §1 marks the long version 待写).
  The homepage currently leads with the medium bio.
- No posts yet, so `post.html` / `archive.html` / pagination are only smoke-tested,
  never exercised with real content.
