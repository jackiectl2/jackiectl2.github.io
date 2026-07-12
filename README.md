# jackiectl.github.io

Personal site of **Tianlang (Jackie) Chen** — B.S.E. Data Science, University of
Michigan. Live at <https://jackiectl.github.io>.

## Credit

Built on the [**Centrarium**](https://github.com/bencentra/centrarium) Jekyll theme
by [Ben Centra](http://bencentra.com), used under the MIT License. The original
copyright notice is preserved verbatim in [LICENSE.md](LICENSE.md), and the full
upstream commit history is preserved in this repository (`git log`).

The design here — the xuan-paper palette, the asymmetric rail layout, and the
data-driven content model below — is a rewrite; what remains of upstream is the
Jekyll scaffolding and the Bourbon/Bitters base. Upstream stays reachable as the
`upstream` remote.

Also uses [Font Awesome](https://fontawesome.com), [highlight.js](https://highlightjs.org),
and [Tippy.js](https://atomiks.github.io/tippyjs/).

## Content is data, not markup

Everything on the homepage — research, experience, skills, publications, links —
renders by iterating over [`_data/profile.json`](_data/profile.json). **No template
assumes how many entries a list has.** Adding a project means adding one JSON
object; no HTML, CSS, or layout changes. Each list ends in a visible
"to be continued" placeholder, so the headroom is something a visitor can see
rather than a gap they can't.

`_data/profile.json` is a vendored copy of `profile-readme/data/profile.json`,
which is itself the machine-readable projection of `PROFILE.md` (the single source
of truth for the whole personal-brand project). A symlink would drift less but
breaks when this repo is checked out on its own, so re-sync explicitly:

```bash
tools/sync-profile.sh          # copy the upstream JSON in
tools/sync-profile.sh --check  # fail if the copy is stale (for CI)
```

The Publications section renders whether or not it has entries — empty, it says
"In preparation". It does not get deleted just because it is currently empty.

## Local development

Ruby comes from Lmod on the cluster; gems install into `vendor/bundle`, which is a
symlink out to scratch so they never count against the home-directory budget.

```bash
module load ruby/3.3.3
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload
```

Then open <http://127.0.0.1:4000>.

## Deployment

⚠️ **This site cannot be built by GitHub Pages' own Jekyll.** It depends on
`jekyll-archives` and `jekyll-paginate-v2`, neither of which is on the Pages plugin
allowlist. It has to be built by GitHub Actions and deployed as a static artifact.
That workflow is not written yet.

## Layout

```
_data/profile.json   all site content (see above)
_config.yml          site metadata, left-rail nav, the focus line
_includes/           head, rail (sidebar), colophon, scripts
_layouts/            default (shell), page, post, archive
_sass/base/          _variables.scss holds the whole palette and type scale
_sass/_layout.scss   the design: rail, sections, work list, chips, article
index.html           the homepage — every section loops over profile.json
blog.html            paginated post list at /blog/
tools/sync-profile.sh
```
