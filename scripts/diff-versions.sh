#!/usr/bin/env bash
# Diff doc source between two git refs (tags, branches, or commits).
# Manual stand-in for Read the Docs' version flyout since we don't host there.
#
# Usage:
#   scripts/diff-versions.sh <old-ref> <new-ref> [path]
#
# Examples:
#   scripts/diff-versions.sh v1.0.0 v1.1.0
#   scripts/diff-versions.sh v1.0.0 main rules.md
#   scripts/diff-versions.sh v1.0.0 v1.1.0 > /tmp/v1.0.0..v1.1.0.diff

set -euo pipefail

if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <old-ref> <new-ref> [path]" >&2
    exit 1
fi

old_ref="$1"
new_ref="$2"
path="${3:-.}"

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

for ref in "$old_ref" "$new_ref"; do
    if ! git rev-parse --verify --quiet "$ref" >/dev/null; then
        echo "error: ref '$ref' not found" >&2
        exit 1
    fi
done

git diff --color=always "$old_ref" "$new_ref" -- "$path"
