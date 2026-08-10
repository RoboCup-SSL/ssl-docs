# Game Controller Protocol

This page describes the layers that deliver and decode the game state protocol to and from the field. This protocol is
partly bidirectional — teams may optionally talk back to the
[Game Controller](https://github.com/RoboCup-SSL/ssl-game-controller) to request a keeper change, a timeout, or a
substitution.

## League Software

There is one piece of league maintained software that manages game state and produces this protocol:

- [Game Controller](https://github.com/RoboCup-SSL/ssl-game-controller)

If you're actively trying to connect to a field, you'll need to make sure it's running. Automatic referee
implementations are separate, optional software that talk to the Game Controller over the same protocol described below
— see the [referee protocol](./referee.md) page for how their filtered game state gets used.

## Transport

**A team is never required to reply to the Game Controller.** Teams can and do play full matches only _receiving_ game
state. The Game Controller talks to teams two ways: a one-way broadcast every team should listen to, and an optional
two-way TCP connection only needed if a team wants to actively request something.

### Referee Broadcast

The Game Controller publishes overall game state (stage, command, scores, cards) as a one-way UDP multicast stream. The
league defines this multicast group as having an address of `224.5.23.1` at port `10003`. You join a multicast group
just like you connect to any IP address and port combo, though you may need to pass some additional options when binding
the socket.

```{mermaid} diagrams/referee-broadcast.mmd
```

Once you've joined, you should expect to receive a `Referee` packet on a regular interval, independent of any camera
framerate. **Do not assume the game is running the current command until you've received a `Referee` packet saying so.**
Field data delivery is not guaranteed here either — a dropped packet is not re-transmitted, and packet loss should be
_well below_ 1%.

````{container} wide-mermaid
```{mermaid} diagrams/referee-broadcast-sequence.mmd
```
````

### Remote Control "rcon" Channels (Optional)

If a team's software/AI wants to request a keeper change, respond to an advantage choice, or request a substitution, it
opens a TCP connection to the Game Controller and registers. Again, many of these functions can be done by the human
robot handler and physical remote control provided by the event organizer/field. There are three separate rcon channels,
each on its own port: one for teams, one for autoRefs, and one for physical remote controls. Registration and signing
are described in
[ssl_gc_rcon.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon.proto); signatures
are optional and only needed for secure/verified communication.

Unlike the broadcast channel, opening a TCP connection requires knowing the Game Controller's actual IP. **You don't
need to guess this or hardcode a hostname** — read it off the
[source address](https://en.wikipedia.org/wiki/IPv4#Source_address) field of the IP packets carrying the `Referee`
broadcast you're already receiving. Whatever machine that traffic comes from is the Game Controller.

````{container} wide-mermaid
```{mermaid} diagrams/rcon-handshake-sequence.mmd
```
````

The connection stays open — registration happens once, then the team sends further requests and receives replies over
the same socket for as long as it stays connected. If a team never connects, it simply never receives a
`ControllerReply` and never gets to make requests; the game continues based on the referee's broadcast state alone.

### Connections Table

The following table contains connection information for the broadcast channel and the team/remote-control rcon channels.
AutoRef connections use the same rcon flow but are documented on the [referee protocol](./referee.md#connections-table)
page instead, alongside the rest of the autoRef-specific content.

| Protocol                 | Protobuf                                                                                                              | Type          | Address    | Port  |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | ----- |
| SSL-Game-Controller (GC) | [Referee](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_referee_message.proto)           | UDP Multicast | 224.5.23.1 | 10003 |
| Team -> GC               | [Team](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_team.proto)                    | TCP           | GC         | 10008 |
| Team -> GC               | [Team](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_team.proto)                    | TCP + SSL     | GC         | 10108 |
| Remote Control -> GC     | [Remote Control](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_remotecontrol.proto) | TCP           | GC         | 10011 |
| Remote Control -> GC     | [Remote Control](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_remotecontrol.proto) | TCP + SSL     | GC         | 10111 |

## Message Format

The league uses [google protobuf](https://protobuf.dev/) to define the data format for this protocol too. The interface
definitions are in the same [league protobuf repository](https://github.com/RoboCup-SSL/ssl-protocol-defs) used for
vision. The image below shows the hierarchy of the broadcast `Referee` message — the one every team decodes, whether or
not it ever opens an rcon connection.

````{container} no-letterbox-mermaid
```{mermaid} diagrams/referee-hierarchy.mmd
```
````

`Referee` is the single top level structure sent on the broadcast channel. It carries the coarse game `stage` and
fine-grained `command` teams must obey, a `Referee.TeamInfo` for each of `yellow` and `blue` (score, cards, timeouts,
keeper id), an optional `designated_position` for ball placement, and any `game_events`/`game_event_proposals` the
active autoRef has reported.

The table below contains links to the specific proto files needed to decode the broadcast message and the three rcon
channels. It's recommended you include the entire
[ssl-protocol-defs repository](https://github.com/RoboCup-SSL/ssl-protocol-defs) as a submodule in your code, rather
than copying the files directly.

| Message                                                                                                 | Proto File                                                                                                                             |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Referee, Referee.TeamInfo, Referee.Point                                                                | [ssl_gc_referee_message.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_referee_message.proto)       |
| GameEvent, GameEventProposalGroup                                                                       | [ssl_gc_game_event.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_game_event.proto)                 |
| ControllerReply, Signature                                                                              | [ssl_gc_rcon.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon.proto)                             |
| TeamRegistration, TeamToController, ControllerToTeam                                                    | [ssl_gc_rcon_team.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_team.proto)                   |
| AutoRefRegistration, AutoRefToController, ControllerToAutoRef                                           | [ssl_gc_rcon_autoref.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_autoref.proto)             |
| RemoteControlRegistration, RemoteControlToController, ControllerToRemoteControl, RemoteControlTeamState | [ssl_gc_rcon_remotecontrol.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_remotecontrol.proto) |
| Team, RobotId, Division                                                                                 | [ssl_gc_common.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_common.proto)                         |

## Team Sides

This protocol shares its coordinate frame and units with the vision protocol — see
[vision's coordinate system](./vision.md#coordinate-system) for the full breakdown (mm, radians, CCW from +X). The only
game-controller-specific piece is `blue_team_on_positive_half`, which tells you which side of the field's +X axis the
blue team currently defends. **This flips between halves — do not hardcode a side.** `designated_position` (used for
ball placement) is a `Referee.Point` in the same field frame.

## Registration Channels

The Game Controller's rcon interface is split into three independent TCP channels — team, autoRef, and remote control —
each on its own port, each with its own registration message and message types. This means if your software wants to act
as more than one role (for example, a team client that is also a remote control), it needs a separate TCP connection and
registration per role; they are not multiplexed over one socket.

**The [referee protocol](./referee.md) page documents how teams can use the `game_events` an automatic referee reports
over this protocol.**

## Network Flow

The diagram below is the same competition network fan-out shown in the
[field network documentation](../field/network/compnetwork.md), with the machines involved in the game controller
protocol highlighted and the vision-only machines (cameras, Truss NUC, Vision Computer) muted. The Game Controller
publishes the `224.5.23.1:10003` broadcast and serves the three rcon channels; team PCs, remotes, the status board, and
the officiating/broadcast machines that read referee state all consume it. The router and switch are highlighted too —
they maintain the multicast group and carry the rcon TCP connections.

```{image} diagrams/ssl_field_network_fanout_truss_gc_highlight.light.svg
---
class: only-light
alt: SSL field network fan-out diagram with game-controller-producing and 
  game-controller-consuming machines highlighted, vision-only machines muted
---
```

```{image} diagrams/ssl_field_network_fanout_truss_gc_highlight.dark.svg
---
class: only-dark
alt: SSL field network fan-out diagram with game-controller-producing and 
  game-controller-consuming machines highlighted, vision-only machines muted
---
```
