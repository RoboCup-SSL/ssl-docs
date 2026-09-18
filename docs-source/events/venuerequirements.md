# Venue Requirements for Hosting SSL Competitions

Venue requirements are broken down into a few main categories.

The [Venue Requirements Calculator](venue-calculator.md) does the arithmetic on this page for you, and extends it to
power, outlet, and network drop counts.

## Size

The first major question for a venue is "does it have enough room"?

A Division A field is 13.4 by 10.4m. We recommend a 1.5m buffer on all sides (tables will encroach), bringing the
recommended footprint to 16.4m x 13.4m, 220sq.m, or 2366sq.ft.

A Division B field is 10.4 by 7.4m. We recommend a 1.5m buffer on all sides (tables will encroach), bringing the
recommended footprint to 13.4m x 10.4m, 140sq.m, or 1501sq.ft.

Planning the team area is a bit more involved. Starting from a baseline that each team bring two team members,
organizers should plan to provide a 2m x 1m table with a 1m buffer zone. For each additional 4-6 team members a team
brings, the organizers should provide 1 additional table, all inline with eachother. When combining table, some of the
buffer zone is shared.

Budget the following square footage for the team area:

- 0-3 Member Team: 12sq.m (130sq.ft)
- 4-10 Member Team: 18sq.m (194sq.ft)
- 10-18 Member Team: 24sq.m (259sq.ft)

Include at least one table for the event organizers.

You will also need to plan to provide tables at the field as per the [field technical documentation](../field.md).

## Type

The venue generally needs to support events of this nature. It's preferable that the venue have a concrete or plastic
tile floor. While it's important that you don't represent the event as industrial and dangerous, the venue owner needs
to understand that handtools and wear & tear on the space will exceed that of a normal "corporate event". It's better to
get this cleared ahead of time than to find our later they cannot support your event. Feel free to include pictures of
previous events the league has held.

## Field Support

The venue needs to be able to support trusses or permit other camera mounting at approximately 6-6.5m in height. This is
typically done by a rigging company with a truss, though some venues may already have trussing. The committees are
working hard to support a system where overhead cameras may be replaced by side mount cameras but we cannot guarentee
support for this yet and it is currently experimental.

One camera setup weights approximately 2.5kg or 5lbs. This is under the limit that licensed rigger is required to fasten
the equipment to the truss, but you should consult the [field setup guide](setupguide.md).

## Lighting

Ideally the venue is windowless and has controllable overhead lighting. It's also important to confirm the overhead
lighting does not exhibit 50/60Hz flicker, though this rare in most venues. If the venue has windows, it will almost
certainly mandate the use of SSL Vision Processor over SSL Vision (legacy) due to shifting color calibrations throughout
the day.

You may wish to provide additional lighting for consistency. A lighting guide is comming soon to the field
documentation.

## Power

Power delivery is inherant to the venue, and thus must be provided by event organizer/venue. All league equipment
supports international power standards 100-240V, 50-60Hz. Teams are also expected to bring equipment that is
internationally compatible. This section outlines the power requirements. It's worthing checking venue pricing to supply
extra outlets. In many cases it's cheaper to buy local power strips wholesale and only have the venue provide
approximate single outlet/plug drops with the organizer or teams providing power strips/extensions.

The event organizer only needs to provide 1 ~1500W drop per team table cluster. Event organizers should plan for an
average power usage of 750W per team (this is conservative) and should include outlets for the needed field equipment.
Total field power draw in its full configration will not exceed ~1.2kW, excluding any streaming PCs.

## Network

Organizers should be prepared to provide field networks. This means either providing a router per field for isolation,
or setting up VLANs. Most teams simply re-use their lab equipment for regional events. For larger events, a networking
contractor may be required and the [network documentation](../field/network/compnetwork.md) may offer some help. PoE
will need to be provided for any field running remote controls.

Internet at the field is not guarenteed to participants, but is a strong positive if it can be included.

One network drop should be provided per team table, or WiFi can be provided if you have control over the channel
allocation.
