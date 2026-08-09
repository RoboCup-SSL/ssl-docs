# Home Page

This is the documentation for [RoboCup](https://www.robocup.org/) [Small Size League](https://ssl.robocup.org/). It
contains motivation, extended documentation, and detailed first time setup and usage guidance for a variety of topics
common to the league as a whole.

## Common Pages of Interest

- [Field Technical Documentation](field.md)
- [Field Camera Calculator](field/camera-calculator.md)
- [Protocol/Coms Technical Documentation](protocol.md)

## Motivation

All SSL teams are required to interact with shared field software in order to play a match. This includes
[vision](https://github.com/TIGERs-Mannheim/vision-processor) (robot and ball positions) and
[game controller](https://github.com/robocup-ssl/ssl-game-controller) (game state). There are also a variety of other
league tools that need to establish communication links, some of which are helpful for teams like autoref. This raises a
key engineering challenge: standardizing the communication so that dozens of teams and tools can all show up and expect
to communicate correctly.

The SSL uses [Protobuf](https://protobuf.dev/) to standardize the tool data formats. Protobuf defines an interface
description language, and the league creates packet definitions for each tool using this interface language. These
packet definitions are defined here. A single source of truth for packet definitions provides clarity to the standard,
and helps avoid diverging versions and licensing incompatibility.

```{toctree}
---
maxdepth: 0
caption: Contents
---
field
protocol
```
