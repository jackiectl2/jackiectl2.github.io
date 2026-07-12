#!/usr/bin/env bash
# Compile the CV from ../cv (the Overleaf-backed LaTeX repo) and drop the PDF
# into assets/, where the rail's "cv" link points.
#
# The CV source is a separate repo synced with Overleaf; only the built PDF lives
# here, because that is what the site actually serves. Re-run this after any CV
# change, then commit the new PDF.
#
# Requires the TinyTeX install in $HOME/.TinyTeX. Note biber is NOT symlinked into
# ~/bin by TinyTeX, so we put TinyTeX's real bin directory on PATH ourselves —
# without it latexmk dies with "biber: command not found".

set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="$here/../cv"
out="$here/assets/Tianlang-Chen-CV.pdf"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

texbin="$HOME/.TinyTeX/bin/x86_64-linux"
if [[ ! -x "$texbin/biber" ]]; then
  echo "error: no TinyTeX at $texbin (need pdflatex + biber)" >&2
  echo "       tlmgr install biber upquote cochineal" >&2
  exit 1
fi
export PATH="$texbin:$PATH"

echo "building $src/cv-llt.tex ..."
( cd "$src" && latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir="$tmp" cv-llt.tex >"$tmp/build.log" 2>&1 ) || {
  echo "error: LaTeX failed. Tail of the log:" >&2
  tail -30 "$tmp/build.log" >&2
  exit 1
}

mkdir -p "$here/assets"
cp "$tmp/cv-llt.pdf" "$out"
echo "wrote $out ($(du -h "$out" | cut -f1))"
