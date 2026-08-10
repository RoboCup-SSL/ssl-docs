{
  description = "ssl-docs dev environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    uv2nix = {
      url = "github:pyproject-nix/uv2nix";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    pyproject-nix = {
      url = "github:pyproject-nix/pyproject.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    pyproject-build-systems = {
      url = "github:pyproject-nix/build-system-pkgs";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.uv2nix.follows = "uv2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, uv2nix, pyproject-nix, pyproject-build-systems, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        workspace = uv2nix.lib.workspace.loadWorkspace { workspaceRoot = ./.; };

        overlay = workspace.mkPyprojectOverlay {
          sourcePreference = "wheel";
        };

        pythonSet =
          (pkgs.callPackage pyproject-nix.build.packages {
            python = pkgs.python312;
          }).overrideScope
            (pkgs.lib.composeManyExtensions [
              pyproject-build-systems.overlays.default
              overlay
            ]);

        venv = pythonSet.mkVirtualEnv "ssl-docs-env" workspace.deps.default;

        # drawio is Electron, and Electron's "auto" ozone platform detection
        # picks Wayland whenever it finds a live compositor socket under
        # $XDG_RUNTIME_DIR — which sphinxcontrib-drawio's own Xvfb (X11) then
        # collides with, crashing the export. Force X11 unconditionally so
        # this works headless in CI and on any contributor's Wayland desktop.
        #
        # drawio's SVG export always wraps every fill/stroke/font color in a
        # light-dark(light, dark) CSS function, even for colors the diagram
        # sets explicitly — --svg-theme light only changes a couple of
        # built-in defaults, not this. sphinxcontrib-drawio has no config
        # knob to reach it either, so the exported SVG is post-processed
        # here to collapse light-dark(a, b) down to a single static color.
        #
        # Which side of the pair survives is controlled by $DRAWIO_SVG_THEME
        # (light [default] or dark) rather than always picking the light
        # value: light-dark() inside an <img>-embedded SVG resolves against
        # the *browser's* OS/UA color-scheme preference, not the host page's
        # — and Furo's manual light/dark toggle never sets the CSS
        # color-scheme property, only a data-theme attribute + CSS classes.
        # So a live light-dark() SVG can show dark colors while the page is
        # explicitly toggled to light. conf.py renders one static SVG per
        # theme via this switch and picks between them with Furo's own
        # only-light/only-dark image classes instead.
        drawio = pkgs.writeShellScriptBin "drawio" ''
          ${pkgs.drawio}/bin/drawio --ozone-platform=x11 "$@"
          status=$?
          if [ $status -ne 0 ]; then
            exit $status
          fi

          out=""
          prev=""
          for arg in "$@"; do
            if [ "$prev" = "--output" ]; then
              out="$arg"
            fi
            prev="$arg"
          done

          case "$out" in
            *.svg)
              if [ -f "$out" ]; then
                if [ "''${DRAWIO_SVG_THEME:-light}" = "dark" ]; then
                  ${pkgs.gnused}/bin/sed -E -i \
                    -e 's/light-dark\(((#[0-9a-fA-F]+)|(rgb\([0-9, ]+\))), *((#[0-9a-fA-F]+)|(rgb\([0-9, ]+\)))\)/\4/g' \
                    -e 's/--ge-adaptive-bg: light-dark\([^,]+, var\(--ge-dark-color, *([^)]+)\)\)/--ge-adaptive-bg: \1/g' \
                    "$out"
                else
                  ${pkgs.gnused}/bin/sed -E -i \
                    -e 's/light-dark\(((#[0-9a-fA-F]+)|(rgb\([0-9, ]+\))), *((#[0-9a-fA-F]+)|(rgb\([0-9, ]+\)))\)/\1/g' \
                    -e 's/--ge-adaptive-bg: light-dark\(([^,]+), var\([^)]*\)\)/--ge-adaptive-bg: \1/g' \
                    "$out"
                fi
              fi
              ;;
          esac
        '';
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            venv
            pkgs.uv
            pkgs.codespell
            drawio
            pkgs.xvfb
            pkgs.xvfb-run
          ];

          shellHook = ''
            unset PYTHONPATH
          '';
        };
      }
    );
}
