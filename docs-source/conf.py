project = "RoboCup Small Size League"
copyright = "2026, RoboCup Small Size League"
author = "RoboCup Small Size League"

extensions = [
    "myst_parser",
    "sphinxcontrib.youtube",
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


def setup(app):
    # The calculator page's math lives inside raw HTML labels, which Sphinx's
    # math domain never sees, so its per-page MathJax inclusion heuristic
    # misses it. Load MathJax (and other extension assets) unconditionally on
    # every page instead.
    app.set_html_assets_policy("always")

linkcheck_user_agent = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)
