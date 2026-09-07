# League Protocols and Communication

[Just looking for the connection summary table?](#connection-summary-table)

"How do I connect to an SSL field?" is one of the first questions a software team member will ask. This page and its
sub-pages document the process of connecting up: interfacing to the field, transport protocols, and data formats. If you
aren't already roughly familiar with the SSL field, checkout the [field documentation](field.md) to learn about the
layout and network structure.

## What does a SSL field provide?

RoboCup SSL fields provide two primary services _to teams_.

1. Robot and Ball Localization (where are the robots and balls?)
1. Game State (game half, timeouts, penalties, etc.)

This article first covers vision (field geometry, robot and ball localization), then game controller (game state).
Conceptually, teams first want to receive robot positions. It does not matter what the game state is if you can't see
anything. Ensuring rules and game state compliance comes next.

## How do I connect to an SSL Field?

1. **A team is never required to reply to the field.** Teams can and do play full matches only _receiving_ field vision
   and game controller data. The only input required from a team is it's keeper number which is entered via the Game
   Controller Operator or the Remote Control, neither of which is provided by the team.
1. **Field data delivery is not guaranteed.** It's sent at a high rate so **teams are expected to tolerate occasional
   dropped packets without re-transmission.** Typically a re-transmission would take a few ms to execute, by which time
   the next data frame is probably ready anyway.
1. **All required field data is sent via [multicast](https://en.wikipedia.org/wiki/Multicast) or
   [broadcast](<https://en.wikipedia.org/wiki/Broadcasting_(networking)>).** This allows the networking equipment to
   duplicate the data stream as many times as needed without the league software managing dozens of connections. It also
   means the team's software does not need to know the addresses or hostnames of any specific field computers in order
   to connect. The team software simply needs to know the standard multicast addresses and ports of vision and game
   controller, and you'll be able to connect to any standard field around the world. Specifically, these data streams
   are [UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol) /[IPv4](https://en.wikipedia.org/wiki/IPv4)
   +[IGMP](https://en.wikipedia.org/wiki/Internet_Group_Management_Protocol).
1. **All league packet data is defined by protocol buffers.** You can find the definitions in the
   [ssl-protocol-defs repository](https://github.com/RoboCup-SSL/ssl-protocol-defs).

The actual protocols and data formats are documented in the sections below.

## Vision

A detailed description of the vision protocol is provided in a dedicated article.

[Vision Protocol](protocol/vision.md)

## Game Controller

A detailed description of the game controller protocol is provided in a dedicated article.

[Game Controller Protocol](protocol/gamecontroller.md)

## Connection Summary Table

Below is the summary table of protocol addressing and ports. The GC address can be found by listening to the GC
multicast group and reading the [source address](https://en.wikipedia.org/wiki/IPv4#Source_address) field of the IP
layer, rather than knowing it statically.

| Protocol                 | Protobuf                                                                                                                          | Type          | Address    | Port  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | ----- |
| SSL-Game-Controller (GC) | [Referee](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gamecontroller/ssl_gc_referee_message.proto)           | UDP Multicast | 224.5.23.1 | 10003 |
| SSL-Vision Detections    | [SSL_WrapperPacket](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_wrapper.proto)             | UDP Multicast | 224.5.23.2 | 10006 |
| AutoRef -> GC            | [AutoRef](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gamecontroller/ssl_gc_rcon_autoref.proto)              | TCP           | GC         | 10007 |
| AutoRef -> GC            | [AutoRef](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gamecontroller/ssl_gc_rcon_autoref.proto)              | TCP + SSL     | GC         | 10107 |
| Team -> GC               | [Team](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gamecontroller/ssl_gc_rcon_team.proto)                    | TCP           | GC         | 10008 |
| Team -> GC               | [Team](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gamecontroller/ssl_gc_rcon_team.proto)                    | TCP + SSL     | GC         | 10108 |
| Remote Control -> GC     | [Remote Control](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gamecontroller/ssl_gc_rcon_remotecontrol.proto) | TCP           | GC         | 10011 |
| Remote Control -> GC     | [Remote Control](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gamecontroller/ssl_gc_rcon_remotecontrol.proto) | TCP + SSL     | GC         | 10111 |
| SSL-Vision-Tracker       | [TrackerWrapperPacket](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_wrapper_tracked.proto)  | UDP Multicast | 224.5.23.2 | 10010 |
| Simulation Control       | [SimulationControl](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/simulation/ssl_simulation_control.proto)     | UDP           | Simulator  | 10300 |
| Robot Control Blue       | [RobotControl](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/simulation/ssl_simulation_robot_control.proto)    | UDP           | Simulator  | 10301 |
| Robot Control Yellow     | [RobotControl](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/simulation/ssl_simulation_robot_control.proto)    | UDP           | Simulator  | 10302 |

## Additional Resources

- Unicast
- Multicast
- Broadcast
- TCP
- UDP
- IPv4
- IGMPv4

```{toctree}
---
maxdepth: 1
caption: Contents
---
protocol/vision.md
protocol/gamecontroller.md
protocol/referee.md
protocol/simulator.md
```
