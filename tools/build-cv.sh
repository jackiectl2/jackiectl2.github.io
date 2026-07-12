#!/usr/bin/env bash
# Compile the CV from ../cv (the Overleaf-backed LaTeX repo) into static/uploads/,
# where the site's "Download CV" button points.
#
# TinyTeX does NOT symlink biber into ~/bin, so put its real bin dir on PATH --
# without this, latexmk dies with "biber: command not found". And latexmk caches
# that failure, so the output dir is rebuilt from scratch each run.

set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="$here/../cv"
out="$here/static/uploads/resume.pdf"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

texbin="$HOME/.TinyTeX/bin/x86_64-linux"
if [[ ! -x "$texbin/biber" ]]; then
  echo "error: no TinyTeX at $texbin" >&2
  echo "       tlmgr install biber upquote cochineal" >&2
  exit 1
fi
export PATH="$texbin:$PATH"

echo "building $src/cv-llt.tex ..."
( cd "$src" && latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir="$tmp" cv-llt.tex >"$tmp/build.log" 2>&1 ) || {
  echo "error: LaTeX failed:" >&2; tail -30 "$tmp/build.log" >&2; exit 1
}

mkdir -p "$(dirname "$out")"
cp "$tmp/cv-llt.pdf" "$out"
echo "wrote $out"
