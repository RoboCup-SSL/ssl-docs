project = "SSL Docs"
copyright = "2026, RoboCup Small Size League"
author = "RoboCup Small Size League"

extensions = [
    "myst_parser",
]

source_suffix = {
    ".md": "markdown",
    ".rst": "restructuredtext",
}

myst_enable_extensions = [
    "colon_fence",
    "deflist",
]

exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

html_theme = "furo"
html_static_path = []
