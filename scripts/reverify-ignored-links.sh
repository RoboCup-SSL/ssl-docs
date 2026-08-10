#!/usr/bin/env bash
# Open the linkcheck-ignored URLs (docs-source/conf.py's linkcheck_ignore) in
# a browser for periodic human re-verification. These are WAF-blocked sites
# that reject every automated request, so linkcheck can't check them itself
# — see the comment above linkcheck_ignore for details.
#
# After checking, bump the "verified YYYY-MM-DD" comment on each entry you
# confirmed still resolves correctly.
#
# Usage:
#   scripts/reverify-ignored-links.sh [-y|--yes]
#
#   -y, --yes   Skip the confirmation prompt (for automation/CI use).

set -euo pipefail

assume_yes=0
for arg in "$@"; do
    case "$arg" in
        -y|--yes)
            assume_yes=1
            ;;
        *)
            echo "Usage: $0 [-y|--yes]" >&2
            exit 1
            ;;
    esac
done

repo_root="$(git rev-parse --show-toplevel)"
conf_py="$repo_root/docs-source/conf.py"

if [[ ! -f "$conf_py" ]]; then
    echo "Can't find $conf_py" >&2
    exit 1
fi

# Pull the quoted regex strings out of the linkcheck_ignore = [ ... ] block,
# then de-regex them back into plain URLs. Each entry is an anchored,
# backslash-escaped literal URL (^...$ with \. \? etc.), so stripping the
# anchors and any backslash before a single char recovers the original URL.
mapfile -t urls < <(
    awk '/^linkcheck_ignore = \[/{flag=1; next} /^\]/{flag=0} flag' "$conf_py" \
        | grep -oP '(?<=r")[^"]+(?=")' \
        | sed -E 's/^\^//; s/\$$//; s/\\(.)/\1/g'
)

if [[ ${#urls[@]} -eq 0 ]]; then
    echo "No entries found in linkcheck_ignore ($conf_py)." >&2
    exit 0
fi

browsers=(google-chrome google-chrome-stable chrome chromium chromium-browser firefox)
browser=""
for candidate in "${browsers[@]}"; do
    if command -v "$candidate" >/dev/null 2>&1; then
        browser="$candidate"
        break
    fi
done

if [[ -z "$browser" ]]; then
    echo "No browser found on PATH (looked for: ${browsers[*]})." >&2
    echo "Check these manually instead:" >&2
    printf '  %s\n' "${urls[@]}" >&2
    exit 1
fi

echo "About to open ${#urls[@]} ignored link(s) in $browser for manual re-verification:"
printf '  %s\n' "${urls[@]}"

if [[ "$assume_yes" -ne 1 ]]; then
    if [[ ! -t 0 ]]; then
        echo "Not running interactively — pass -y/--yes to skip this prompt." >&2
        exit 1
    fi
    read -r -p "Open these in $browser? [y/N] " reply
    case "$reply" in
        y|Y|yes|YES) ;;
        *)
            echo "Aborted." >&2
            exit 1
            ;;
    esac
fi

"$browser" "${urls[@]}" &
disown
