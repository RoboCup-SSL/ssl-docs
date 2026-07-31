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
}

run_check build nix develop -c sphinx-build -W -b html docs-source _build/html
run_check internal-links nix develop -c sphinx-build -W -n -b dummy docs-source _build/dummy
run_check external-links nix develop -c sphinx-build -b linkcheck docs-source _build/linkcheck
run_check spellcheck nix develop -c codespell docs-source README.md

echo
echo "== Summary =="
failed=0
for i in "${!names[@]}"; do
    echo "${results[$i]}  ${names[$i]}"
    [[ "${results[$i]}" == "FAIL" ]] && failed=1
done

exit "$failed"
