#!/usr/bin/env bash
# Refresh _data/profile.json from the upstream copy in profile-readme.
#
# PROFILE.md is the source of truth; profile-readme/data/profile.json is its
# machine-readable projection, and this site reads a copy of that. A symlink
# would be tidier but breaks once the repo is checked out on its own (GitHub
# Actions clones site-2d alone, with no sibling profile-readme), so we vendor a
# copy and re-sync with this script.
#
# Usage: tools/sync-profile.sh [--check]
#   --check  exit non-zero if the copy is stale, changing nothing (for CI)

set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="$here/../profile-readme/data/profile.json"
dst="$here/_data/profile.json"

if [[ ! -f "$src" ]]; then
  echo "error: upstream not found at $src" >&2
  exit 1
fi

if [[ "${1:-}" == "--check" ]]; then
  if cmp -s "$src" "$dst"; then
    echo "up to date: $dst"
  else
    echo "STALE: $dst differs from $src — run tools/sync-profile.sh" >&2
    exit 1
  fi
  exit 0
fi

cp "$src" "$dst"
echo "synced: $src -> $dst"
