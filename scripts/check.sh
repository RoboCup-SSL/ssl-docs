#!/usr/bin/env bash
# Run all CI checks locally, report pass/fail per check.
#
# Usage: scripts/check.sh

set -uo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

rm -rf _build

declare -a names=()
declare -a results=()
declare -a notes=()

run_check() {
    local name="$1"
    shift
    echo "==> $name"
    if "$@" >/tmp/check-"$name".log 2>&1; then
        results+=("PASS")
    else
        results+=("FAIL")
        tail -n 20 /tmp/check-"$name".log
    fi
    names+=("$name")
    notes+=("")
}

# linkcheck reports a skipped URL as "-ignored-" and still passes, so PASS on
# its own doesn't mean everything got checked. Two separate reasons a link is
# skipped: the WAF-blocked vendor sites in conf.py's linkcheck_ignore
# (permanent, re-verified by hand via reverify-ignored-links.sh), and every
# github.com link when GITHUB_TOKEN is unset (fixable, and most of the external
# links in these docs) — worth telling them apart.
skipped_link_note() {
    local log="/tmp/check-external-links.log"
    [[ -f "$log" ]] || return 0

    local github other note=""
    github=$(grep -c -- '-ignored-.*https://github\.com/' "$log" || true)
    other=$(grep -- '-ignored-' "$log" | grep -vc 'https://github\.com/' || true)

    if [[ "$github" -gt 0 ]]; then
        note="$github github links skipped, GITHUB_TOKEN unset"
    fi
    if [[ "$other" -gt 0 ]]; then
        [[ -n "$note" ]] && note+="; "
        note+="$other skipped via linkcheck_ignore"
    fi

    echo "$note"
}

run_check build nix develop -c sphinx-build -W -b html docs-source _build/html
run_check internal-links nix develop -c sphinx-build -W -n -b dummy docs-source _build/dummy
run_check external-links nix develop -c sphinx-build -b linkcheck docs-source _build/linkcheck
notes[$((${#notes[@]} - 1))]="$(skipped_link_note)"
run_check spellcheck nix develop -c codespell docs-source README.md
run_check format nix develop -c mdformat --check --wrap 120 docs-source README.md

echo
echo "== Summary =="
failed=0
for i in "${!names[@]}"; do
    line="${results[$i]}  ${names[$i]}"
    [[ -n "${notes[$i]}" ]] && line+="  (${notes[$i]})"
    echo "$line"
    [[ "${results[$i]}" == "FAIL" ]] && failed=1
done

exit "$failed"
