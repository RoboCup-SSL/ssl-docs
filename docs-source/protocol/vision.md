# Vision Protocol

This page describes the layers that deliver and decode the vision data stream from the field.

## League Software

There are two pieces of league maintained software that interpret camera data to produce a vision data stream:

- (Recommended) [Vision Processor](https://github.com/RoboCup-SSL/ssl-vision-processor)
- (Legacy) [SSL Vision](https://github.com/RoboCup-SSL/ssl-vision)

If you're actively trying to connect to a field, you'll need to make sure at least one is running and has a valid field
geometry calibration. More info about running each tool can be found in the repo linked above.

## Transport

The [transport layer](https://en.wikipedia.org/wiki/Transport_layer) is responsible for delivering raw data to the team
computers from the field. It doesn't say anything about the data it's delivering, but this is the first step of field
connectivity. As shown in the diagram below, a team computer connects to the field's vision data stream by joining the
vision multicast group. The league defines this multicast group as having an address of `224.5.23.2` at port `10006`.
You join a multicast group just like you connect to any IP address and port combo, though you may need to pass some
additional options when binding the socket. Consult the documentation for the language of your choosing.

```{mermaid} diagrams/multicast-join.mmd
```

Once you've joined, you should expect to receive messages on a regular interval. Robot and Ball detections will arrive
at the framerate of the field camera(s), usually 60-75Hz. You will also receive field geometry data every few seconds.
**Do not assume the dimensions of the field in your software.** No field is perfect and your software/AI should always
operate on the real physically constructed field dimensions. These will be loaded into the league vision software,
calibration will occur, and final field geometry will be sent on the vision data channel. Always use this data as your
source of truth for the field. Competition fields are often off by up to a few cm and aspect ratio is not preserved.

Shown in the join sequence diagram below is also a dropped detection frame. Note that re-transmission does not occur.
Packet loss should be _well below_ 1%. If it's not, network quality investigation is warranted.

````{container} wide-mermaid
```{mermaid} diagrams/multicast-join-sequence.mmd
```
````

### Connections Table

The following table contains all relevant connection information related to vision data streams.

| Protocol              | Protobuf                                                                                                              | Type          | Address    | Port  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------- | ---------- | ----- |
| SSL-Vision Detections | [SSL_WrapperPacket](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_wrapper.proto) | UDP Multicast | 224.5.23.2 | 10006 |

## Message Format

Now that a data stream is received, the raw data needs to be decoded. The league uses
[google protobuf](https://protobuf.dev/) to define the data format actually sent via multicast. The interface
definitions are available in the [league protobuf repository](https://github.com/RoboCup-SSL/ssl-protocol-defs). The
definition file there are needed to decode the raw data. The image below shows the hierarchy of the data structure send
in the data stream.

````{container} no-letterbox-mermaid
```{mermaid} diagrams/message-hierarchy.mmd
```
````

There are two top level data structures, SSL_DetectionFrame and SSL_GeometryData. These correspond to the packet types
seen in the join sequence diagram above. SSL_DetectionFrame is the meat of the data stream, and as seen in the diagram,
contains only the positions and orientations of friendly robots, opponent robots, and balls. It also includes timing
information so you can tell if a packet has been lost or has arrived out of order. SSL_GeometryData is sent on a regular
1s interval. Most teams will only care about the SSL_GeometryFieldSize which contains information about the real
physical field dimensions. These will differ from the idealized values and teams should use the real ones.
SSL_GeometryCameraCalibration contains information about the camera calibration result. Many teams do not use the camera
calibration data, only the field size data.

The table below contains links to the specific proto files needed to decode the mentioned data types. It's recommended
you include the entire [ssl-protocol-defs repository](https://github.com/RoboCup-SSL/ssl-protocol-defs) as a submodule
in your code, rather than copying the files directly.

| Message                       | Proto File                                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| SSL_WrapperPacket             | [ssl_vision_wrapper.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_wrapper.proto)     |
| SSL_DetectionFrame            | [ssl_vision_detection.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_detection.proto) |
| SSL_DetectionBall             | [ssl_vision_detection.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_detection.proto) |
| SSL_DetectionRobot            | [ssl_vision_detection.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_detection.proto) |
| SSL_GeometryData              | [ssl_vision_geometry.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_geometry.proto)   |
| SSL_GeometryFieldSize         | [ssl_vision_geometry.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_geometry.proto)   |
| SSL_GeometryCameraCalibration | [ssl_vision_geometry.proto](https://github.com/RoboCup-SSL/ssl-protocol-defs/blob/main/proto/vision/ssl_vision_geometry.proto)   |

## Coordinate System

At this point, a team should have valid decoded field geometry, robot positions, and ball positions. This section
discusses the actual units and coordinate frame of the decoded. Position units are in millimeters (mm) and angles are in
radians measured counter-clockwise from +X. Likewise, field geometry is in mm.

Timestamps are of type `double` and are unix timestamps in seconds. The "frame_number" field is a monotonic counter.

```{image} diagrams/coordinate-system-light.svg
---
class: only-light
alt: SSL vision coordinate system, origin at field center, +X/+Y axes, and 
  orientation angle convention
---
```

```{image} diagrams/coordinate-system-dark.svg
---
class: only-dark
alt: SSL vision coordinate system, origin at field center, +X/+Y axes, and 
  orientation angle convention
---
```

The coordinate frame is centered in the middle of the field, with +Y axis going up and the +X axis going right. When
facing the field from the side table, nominally the negative most corner will be at the viewers bottom left and the
positive most corner in the upper right.

| Field                                     | Unit                         |
| ----------------------------------------- | ---------------------------- |
| `x`, `y` (position)                       | mm                           |
| `orientation`                             | rad, CCW from +X             |
| `t_capture`, `t_sent`, `t_capture_camera` | s (unix timestamp, `double`) |
| `frame_number`                            | monotonic counter, unitless  |
| `confidence`                              | unitless, `[0-1]`            |

## Multi-camera Handling and Filtering

SSL_DetectionsFrames carry only positions as seen by **one camera**. This means if you play on any field with more than
one camera, **you will receive a detection per camera**. When robots/balls overlap cameras, the data stream will contain
multiple detections of the object and the timestamps and positions may disagree slightly. This is intentional behavior,
as teams may disagree on the approach to handle detections at boundaries. For example, when kicking off on a 4 camera
field, all four cameras are likely to see the ball and robots at the center and you will receive 4 detections for each
entity. This is visualized in the graphic below.

````{container} no-letterbox-mermaid
```{mermaid} diagrams/multi-camera-merge.mmd
```
````

There is no single agreed upon way to resolve these overlaps. An additional challenge is filtering position in velocity.
Teams will see noise in this derivative without filtering. Again, there are many approaches to solve this. The committee
notes that is a challenging problem in the SSL and robotics in general. Since 2023, the automatic referee software
packages in use by the game controller publish their filtered game state. This is so teams can inspect the data
interpretation behind issued penalties and infractions. It's also intended to be a "decent" or better implementation of
a shared data filter. Teams are allowed, and even encouraged, to use this filtered data in their AI. Eventually a team
may need to write a custom filter, but its expected that years would pass for a new team before the autoref filter is a
limiting factor. Many teams have written about
[vision filters in the SSL](https://tdpsearch.com/search?q=vision+filter&league=soccer_smallsize).

**The [referee protocol](./referee.md) page documents how teams can use the filtered vision data from the automatic
referees.**

## Network Flow

The diagram below is the same competition network fan-out shown in the
[field network documentation](../field/network/compnetwork.md), with the machines involved in the vision stream
highlighted and everything else (game state / referee / broadcast only) muted. Cameras and the Truss NUC produce it, the
Vision Computer publishes the merged `224.5.23.2:10006` stream, and team PCs (plus, optionally, a streaming PC) consume
it. The router and switch are highlighted too — they maintain the multicast group (IGMP snooping/querier) the whole
stream depends on, even though they never decode the vision data stream.

```{image} diagrams/ssl_field_network_fanout_truss_vision_highlight.light.svg
---
class: only-light
alt: SSL field network fan-out diagram with vision-producing and 
  vision-consuming machines highlighted, everything else muted
---
```

```{image} diagrams/ssl_field_network_fanout_truss_vision_highlight.dark.svg
---
class: only-dark
alt: SSL field network fan-out diagram with vision-producing and 
  vision-consuming machines highlighted, everything else muted
---
```
