# SSL Docs

[**Live docs → robocup-ssl.github.io/ssl-docs**](https://robocup-ssl.github.io/ssl-docs/)
[![Build and deploy docs](https://github.com/RoboCup-SSL/ssl-docs/actions/workflows/docs.yml/badge.svg)](https://github.com/RoboCup-SSL/ssl-docs/actions/workflows/docs.yml)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)


See the [Contributing Guide](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md)!

RoboCup Small Size League docs. [Sphinx](https://www.sphinx-doc.org/) + [MyST](https://myst-parser.readthedocs.io/),
deployed to GitHub Pages via Actions.

This repository documents top level items, such as field architecture, new team guides, etc. Highly technical
documentation regarding the usage of a league software tool should be in the repository for that tool. Any top level
integration/usages guides would be welcome here.

## Build

[Nix](https://nixos.org/) flake ([uv2nix](https://github.com/pyproject-nix/uv2nix)) gives a reproducible shell:

```bash
nix develop -c sphinx-build -b html docs-source _build/html
```

Or without Nix, via [uv](https://docs.astral.sh/uv/):

```bash
uv sync
uv run sphinx-build -b html docs-source _build/html
```

Output: `_build/html/index.html`.

Live-reload dev server ([sphinx-autobuild](https://github.com/sphinx-doc/sphinx-autobuild)):

```bash
nix develop -c sphinx-autobuild docs-source _build/html
```

Serves at `localhost:8000` (`--port` to override).

Dependency changes: edit `pyproject.toml`, run `uv lock`.

## Checks

CI runs these on every push/PR. Run all locally:

```bash
scripts/check.sh
```

Or individually:

```bash
# strict build (broken refs/directives fail)
nix develop -c sphinx-build -W -b html docs-source _build/html

# internal links/refs only, no HTML output
nix develop -c sphinx-build -W -n -b dummy docs-source _build/dummy

# external links
nix develop -c sphinx-build -b linkcheck docs-source _build/linkcheck

# spelling (codespell)
nix develop -c codespell docs-source README.md

# formatting (mdformat, 120-col wrap)
nix develop -c mdformat --check --wrap 120 docs-source README.md
```

Auto-fix formatting: drop `--check` from the last command.

## Deploy

`main` push → [`.github/workflows/docs.yml`](.github/workflows/docs.yml) builds + deploys via GitHub Pages Actions. Not
RTD-hosted.

## Diff versions

```bash
scripts/diff-versions.sh v1.0.0 v1.1.0
scripts/diff-versions.sh v1.0.0 main rules.md
```

## External Links Manual Checks

If a website blocks bots, then the external links Ci check will fail. You can add these links to `linkcheck_ignore` in 
`conf.py`. Periodically, anyone can run `./scripts/reverify-ignored-links.sh` which will find a browser and open all
the ignored links to be checked manually. This usually passes the cloudflare bot check. Currently no clear way to do
this in CI.

## License

[CC BY 4.0](LICENSE).
