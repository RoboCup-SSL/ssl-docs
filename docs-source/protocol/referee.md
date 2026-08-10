# Referee Protocol

Probably mostly document the vision filter data stream?

## Transport

### Connections Table

The following table contains connection information for automatic referee (autoRef) implementations talking to the
[Game Controller](https://github.com/RoboCup-SSL/ssl-game-controller). See the
[game controller protocol](./gamecontroller.md#remote-control-rcon-channels-optional) page for the shared rcon
registration/signing flow these channels use, including
[how to find the Game Controller's IP](./gamecontroller.md#remote-control-rcon-channels-optional) without guessing it.

| Protocol      | Protobuf                                                                                                 | Type      | Address | Port  |
| ------------- | -------------------------------------------------------------------------------------------------------- | --------- | ------- | ----- |
| AutoRef -> GC | [AutoRef](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_autoref.proto) | TCP       | GC      | 10007 |
| AutoRef -> GC | [AutoRef](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/gc/ssl_gc_rcon_autoref.proto) | TCP + SSL | GC      | 10107 |

## Message Format

## League Software
