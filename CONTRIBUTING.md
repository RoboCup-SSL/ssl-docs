# Contributing Guide

This document provide guidelines for contributing to this repository.

## Scope

Any high-level documentation related to the SSL is welcome here. This includes anything not clearly having a home 
elsewhere.

Architecture documentation is welcome here. This may include items such as fields, protocols, league technical 
summaries, or community technical surveys of TDPs or other academic publications.

In general, development specific documentation for league tools should live with that tool. This includes detailed 
descriptions of commands, dependencies, bugs, etc. Consider opening issues or pull requests on those tools when
issue arise. However, higher level documentation is very welcome here. This would include step-by-step usage guides,
guides that include the tools in broader application, e.g. an example of calibrating vision to a specific field. When,
possible, documentation should not be duplicated from a league tool repository. It's expected though that a usage guide
may invoke some of the documented commands or compile steps. Consider adding an external link for the full 
documentation and just invoking the command here. 

If a league or external tool defines a _formal contract_ for usage, the definition of that contract must be 
unambiguous. For example, the league [protocol definitions repository](https://github.com/RoboCup-SSL/ssl-protocol-defs)
is the authoritative source on the data format of the protocols. However some aspects of the protocol outside the data 
format are defined here, such as standard port numbers and expected network topology. On pages of this nature the
author _must_ clearly separate what is defined where and link to external resources. Consider opening an Issue with
the "discussion" tag if you are unclear about a boundary; a committee member can quickly help set the boundary of what
should be documented where.

## Style

Pages should be written in clear concise technical English. Avoid abbreviations and sentence fragments in wiki pages.
Do not use overly flowery language or sentence enhancers. Reviewers **will** request language be tightened if this
writing stype is present.

Use figures to augment or replace prose when possible. This improves readability. In order of preference, add 
images as [SVG](https://en.wikipedia.org/wiki/SVG), then PNG, then JPG. This instance supports native rendering of
[Mermaid Diagrams](https://en.wikipedia.org/wiki/Mermaid_(software)) and 
[Diagrams.net (draw.io)](https://en.wikipedia.org/wiki/Diagrams.net). Care has been taken to support both light and 
dark rendering for both options, though rendering draw.io is slightly more complicated due to limitations with the
sphinx supporting module. Use Mermaid if possible.

For algorithms or calculations, considering embedded a JavaScript asset. See the Camera Calculator page as an
example.

### Adding Images

Add images with following block:

````
![Image Name](../images/image1.svg)
````

The name on the left is used when the asset cannot be loaded. Use relative paths to reference the image. Images live
in an `images/` subfolder next to the page that uses them. Save and commit your images there.

### Adding Mermaid Diagrams

Mermaid sources live as `.mmd` files in a `diagrams/` subdirectory next to the page that uses them, and are
embedded with the `mermaid` directive:

````
```{mermaid} diagrams/my-diagram.mmd
```
````

Mermaid renders natively in both light and dark themes.

### Adding Diagrams.net

Diagrams.net (draw.io) sources live in a `diagrams/` subdirectory next to the page that uses them. Draw the
diagram with the [desktop app or diagrams.net](https://www.diagrams.net/) and save the `.drawio` file there.

Diagrams are pre-rendered at build time into separate light and dark SVGs so they track the site's theme toggle
correctly. To wire up a new diagram, add its path to `DUAL_THEME_DIAGRAMS` in [`conf.py`](docs-source/conf.py):

```python
DUAL_THEME_DIAGRAMS = [
    "field/network/diagrams/ssl_field_network_fanout_truss.drawio",
    "field/network/diagrams/ssl_field_network_fanout_direct.drawio",
    "field/network/diagrams/my_new_diagram.drawio",  # new entry
]
```

Then reference the generated `.light.svg` / `.dark.svg` pair with Furo's theme-scoped image classes:

````
```{image} diagrams/my_new_diagram.light.svg
:class: only-light
:alt: Description of the diagram
```

```{image} diagrams/my_new_diagram.dark.svg
:class: only-dark
:alt: Description of the diagram
```
````

Building the docs (inside `nix develop`) regenerates the two SVGs from the `.drawio` source automatically. The
generated svg files should not be committed to git and are ignored by the top-level .gitignore file by default.

## Opening Issues

Feel free to open issues to raise bugs, request new pages, or discuss the reorganization or migration of existing
documentation. Take a look at the `type` labels and be sure to assign the right one. Please open a discussion issue
if you expect to make a large contribution or otherwise thing the community might want to weigh in, including 
dividing up work or setting scope.

## Opening PRs

Contributions are made though pull requests. If your PR addressing one or more issues, please tag them in in the
description.

**PRs Must Include an AI Disclosure!** Please briefly describe what, if anything, AI assisted with.

## Usage of AI

Usage of AI is generally encouraged. The documentation maintainers strongly prefer pictures, graphics, diagrams,
and interactive webpages to static prose. AI is a powerful tool to improve visual communication. Use of AI is also
a powerful tool for language translation and improving technical brevity.

**The author is responsible for the output of their AI.** We expect authors to check generated content for accuracy.
The AI must maintain a concise neutral or slightly friendly tone. Aggressive critical tone of in-league resources is
discouraged as is overly sycophantic or flattering language. Do not generate large amounts of text. This is technical 
documentation designed primarily for utility.

### Improving Language Density

The following prompt is an example of guidance that can be given to an AI helping you write prose:

> Use simple technical english. Do not use abbreviations, but standard acronyms are acceptable. Do not use sentence 
> fragments. Strip or rewrite any casual and non-technical prose to emphasize readabilty of technical documentation. 