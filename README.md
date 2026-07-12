# jackiectl.github.io

Personal site of **Tianlang (Jackie) Chen** — B.S.E. Data Science, University of
Michigan, Ann Arbor. Live at <https://jackiectl.github.io>.

## Credit

Built on the [**Academic CV**](https://github.com/HugoBlox/hugo-theme-academic-cv)
template for [Hugo Blox](https://github.com/HugoBlox/kit), used under the **MIT
License**. The upstream copyright notice is preserved verbatim in
[LICENSE.md](LICENSE.md).

## What is customized

Nothing in the theme itself is patched. Everything below is either data, config, or
an additive override, so the upstream template can still be upgraded:

| Where | What |
|---|---|
| `data/authors/me.yaml` | The whole profile: bio, education, internship, skills, languages, awards. |
| `content/_index.md` | Homepage section order — it mirrors the CV exactly: **Education → Internship → Research → Skills → Additional**. |
| `content/projects/` | One folder per research project, each with a generated cover image. |
| `layouts/_partials/hooks/head-end/custom.html` | The motion layer: gradient-cycling headings, hover lift on cards and icons, a slow drift on the background mesh. Injected through Hugo Blox's own `head-end` hook — no theme files are edited. |
| `layouts/_partials/hbx/blocks/resume-languages/` | Local override: the ring used to show a self-reported "100%", which said nothing. The language name sits inside it instead. |
| `layouts/_partials/hbx/blocks/resume-experience/` | Local override: adds `design.hide_education`, because the biography hero already renders education and this block would otherwise print it twice. |
| `assets/media/icon.svg` | Favicon (replaces the template's default). |

Motion is disabled automatically for visitors whose OS asks for reduced motion.

## Content is data, not markup

No template assumes how many entries a list holds. Adding a project is one folder
under `content/projects/`; adding a skill is one line in `data/authors/me.yaml`.
Lists end in a **visible** placeholder rather than a silent cap — the research
collection is explicitly set to `count: 0` so nothing is ever hidden behind a
default limit.

The **Publications** section renders even while it is empty ("In preparation"). It
does not get deleted just because there is nothing in it yet.

Upstream truth for all of this lives in `PROFILE.md` (in the private `pw-meta`
repo), projected into `profile-readme/data/profile.json`.

## The CV

`static/uploads/resume.pdf` is built from the LaTeX in the sibling `cv/` repo
(Overleaf-backed) with `tools/build-cv.sh`. Re-run it after any CV change and
commit the new PDF.

## Local development

The cluster's toolchain is too old for Hugo out of the box; see `CLAUDE.md` for the
three separate version walls and how to get around them. In short:

```bash
hugo server --disableFastRender    # needs Hugo >= 0.161, Go, Node >= 22.15, Tailwind CLI
```

## Deployment

GitHub Actions builds the site and publishes it to GitHub Pages on every push to
`master` (`.github/workflows/`). No custom domain — `github.io` is free and is all
this site needs.
