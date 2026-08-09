import os
import shutil
import subprocess
import time
from pathlib import Path

project = "RoboCup Small Size League"
copyright = "2026, RoboCup Small Size League"
author = "RoboCup Small Size League"

extensions = [
    "myst_parser",
    "sphinxcontrib.youtube",
    "sphinxcontrib.mermaid",
    "sphinxcontrib.drawio",
    "sphinx.ext.mathjax",
]

source_suffix = {
    ".md": "markdown",
    ".rst": "restructuredtext",
}

myst_enable_extensions = [
    "colon_fence",
    "deflist",
    "dollarmath",
]

myst_heading_anchors = 4

exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

html_theme = "furo"
html_static_path = ["_static"]
html_css_files = ["site.css", "camera-calc.css"]
html_js_files = ["camera-calc.js"]

# Diagrams using `layout: elk` in their frontmatter need the ELK layout
# plugin explicitly opted into — sphinxcontrib-mermaid doesn't load it by
# default even when a diagram requests it, silently falling back to dagre.
mermaid_include_elk = True
mermaid_version = "latest"

# Without this, mermaid assigns each diagram's SVG id via Date.now() with no
# counter or dedup. Pages with several diagrams reliably render two of them
# in the same millisecond, so they collide on the exact same id and the
# second diagram's output gets written into the first's DOM location instead
# of its own. deterministicIds switches id generation to a simple incrementing
# counter, which can't collide.
mermaid_init_config = {"startOnLoad": False, "deterministicIds": True}

# drawio's export binary is Electron, and nixpkgs doesn't set up the
# setuid chrome-sandbox helper Electron's sandbox needs outside of NixOS
# itself (local dev shells and the GitHub Actions runner alike), so it
# segfaults on startup without --no-sandbox. It also segfaults hunting for
# a GPU/DRI driver that doesn't exist in these headless environments,
# hence disabling GPU use as well.
drawio_no_sandbox = True
drawio_disable_gpu = True

# Diagrams that need to track the site's light/dark toggle correctly. An
# <img>-embedded SVG's light-dark() CSS resolves against the browser's OS/UA
# color-scheme preference, not the host page — and Furo's manual toggle never
# sets the CSS color-scheme property, only a data-theme attribute + CSS
# classes. So a live light-dark() SVG can go dark while the page is
# explicitly toggled to light. Each of these gets pre-rendered as two static
# SVGs (one per theme, via $DRAWIO_SVG_THEME on the nix-wrapped drawio
# binary) and picked between with Furo's own only-light/only-dark image
# classes — see field/network/compnetwork.md.
DUAL_THEME_DIAGRAMS = [
    "field/network/diagrams/ssl_field_network_fanout_truss.drawio",
    "field/network/diagrams/ssl_field_network_fanout_direct.drawio",
]


def render_dual_theme_diagrams(app):
    # Unlike sphinxcontrib-drawio's own directive, these are plain {image}
    # references (see below) — Sphinx's image collector needs the file to
    # exist on disk for every builder, not just ones that emit images, so
    # this can't be skipped for the dummy/linkcheck builders.
    drawio_bin = shutil.which("drawio")
    if drawio_bin is None:
        raise RuntimeError("drawio binary not found on PATH — run inside `nix develop`")

    xvfb_run_bin = shutil.which("xvfb-run")
    if xvfb_run_bin is None:
        raise RuntimeError("xvfb-run binary not found on PATH — run inside `nix develop`")

    for rel_source in DUAL_THEME_DIAGRAMS:
        source = Path(app.srcdir) / rel_source
        for theme in ("light", "dark"):
            # Written alongside the .drawio source (not html_static_path) so
            # the normal {image} directive can find and copy it like any
            # other source-tree image.
            out_path = source.with_suffix(f".{theme}.svg")
            if out_path.exists() and out_path.stat().st_mtime > source.stat().st_mtime:
                continue

            env = os.environ.copy()
            env["DRAWIO_SVG_THEME"] = theme
            # ELECTRON_RUN_AS_NODE (set by some terminal/editor hosts, e.g.
            # VS Code) makes Electron run as plain Node instead of launching
            # drawio's UI, so the export silently produces nothing. Also
            # drop WAYLAND_DISPLAY: Electron's ozone "auto" platform picks
            # Wayland whenever a live compositor socket exists, which
            # collides with Xvfb's X11 display and crashes the export.
            env.pop("ELECTRON_RUN_AS_NODE", None)
            env.pop("ELECTRON_NO_ATTACH_CONSOLE", None)
            env.pop("WAYLAND_DISPLAY", None)

            args = [
                xvfb_run_bin,
                "-a",
                drawio_bin,
                "--export",
                "--crop",
                "--page-index",
                "0",
                "--format",
                "svg",
                "--output",
                str(out_path),
                str(source),
                "--disable-gpu",
                "--disable-software-rasterizer",
                "--disable-features=DefaultPassthroughCommandDecoder",
                "--no-sandbox",
            ]

            # Running several of these back-to-back within one process
            # occasionally hits a transient Xvfb display race between
            # consecutive xvfb-run invocations (each one succeeds fine in
            # isolation) — retry a couple of times before giving up, and
            # surface real stderr on the final failure instead of Sphinx's
            # generic "exited with error" message.
            attempts = 3
            for attempt in range(1, attempts + 1):
                result = subprocess.run(args, env=env, capture_output=True, text=True)
                if result.returncode == 0:
                    break
                if attempt == attempts:
                    raise RuntimeError(
                        f"drawio export failed after {attempts} attempts for {source} ({theme}):\n"
                        f"stdout:\n{result.stdout}\nstderr:\n{result.stderr}"
                    )
                time.sleep(2)


def setup(app):
    # The calculator page's math lives inside raw HTML labels, which Sphinx's
    # math domain never sees, so its per-page MathJax inclusion heuristic
    # misses it. Load MathJax (and other extension assets) unconditionally on
    # every page instead.
    app.set_html_assets_policy("always")
    app.connect("builder-inited", render_dual_theme_diagrams)


linkcheck_user_agent = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

# Some vendor sites sit behind bot-mitigation (WAF/CDN) that rejects every
# automated request with an instant 403 regardless of user-agent or headers,
# even though the pages load fine in a real browser (both curl with a real
# browser UA and the WebFetch tool get the same instant 403 — this isn't a
# UA-sniffing check we can spoof our way past). Each URL below was manually
# opened in a browser and confirmed good on the noted date; re-verify and
# bump the date if one starts 404ing for real.
linkcheck_ignore = [
    # rolling vs global shutter write-up — verified 2026-08-09
    r"^https://www\.teledynevisionsolutions\.com/learn/learning-center/imaging-fundamentals/rolling-vs-global-shutter/$",
    # Spinnaker SDK product page — verified 2026-08-09
    r"^https://www\.teledynevisionsolutions\.com/products/spinnaker-sdk/\?model=Spinnaker%20SDK&vertical=machine%20vision&segment=iis$",
    # dual-channel PoE GigE host adapter (ACC-01-1105) — verified 2026-08-09
    r"^https://www\.teledynevisionsolutions\.com/products/ethernet-network-interface-card/\?model=ACC-01-1105&vertical=machine%20vision&segment=iis$",
    # Computar E3Z4518CS-MPIR lens product page — verified 2026-08-09
    r"^https://www\.bhphotovideo\.com/c/product/1091754-REG/computar_e3z4518cs_mpir_1_2_4_5_13_2mm_f1_8_dn\.html$",
    # Computar E3Z3915CS-MPWIR 4K lens product page — verified 2026-08-09
    r"^https://www\.bhphotovideo\.com/c/product/1524951-REG/computar_e3z3915cs_mpwir_4k_1_1_8_3_9_10mm_f1_5\.html$",
    # Intel Core i7-7567U spec sheet — verified 2026-08-09
    r"^https://www\.intel\.com/content/www/us/en/products/sku/97541/intel-core-i77567u-processor-4m-cache-up-to-4-00-ghz/specifications\.html$",
]
