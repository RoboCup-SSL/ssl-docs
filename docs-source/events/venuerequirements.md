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

Planning the team area is a bit more involved. Starting from a baseline that each team brings two or three members,
organizers should plan to provide a 2m x 1m table with a 1m buffer zone. Bigger teams get another table, placed inline
with the first so some of the buffer zone is shared. This is a ballpark, so don't agonize over a team that lands near a
boundary; the averages wash out across an event.

Budget the following square footage for the team area:

- 1-3 Member Team: 1 table, 12sq.m (130sq.ft)
- 4-10 Member Team: 2 tables, 18sq.m (194sq.ft)
- 11-18 Member Team: 3 tables, 24sq.m (259sq.ft)
- 19+ Member Team: 4 tables, 30sq.m (323sq.ft)

Include at least one table for the event organizers.

You will also need to plan to provide tables at the field as per the [field technical documentation](../field.md).

## Type

The venue generally needs to support events of this nature. It's preferable that the venue have a concrete or plastic
tile floor. While it's important that you don't represent the event as industrial and dangerous, the venue owner needs
to understand that handtools and wear & tear on the space will exceed that of a normal "corporate event". It's better to
get this cleared ahead of time than to find out later they cannot support your event. Feel free to include pictures of
previous events the league has held.

## Setup and Teardown

Remember to book the venue for setup and teardown, not just the days you're competing. A full field setup can be done in
a day. Teardown can be done in a half day, but only with a plan. It's worth making that plan, because the saved day
usually shows up directly in the venue quote. Venues often price setup days differently than event days, so it's worth
asking early rather than finding out at the end.

Rigging is usually done by whichever contractor the venue already works with, so you won't be shopping around on
schedule. Ask what their lead time and availability look like while you're still negotiating dates.

## Field Support

The venue needs to be able to support trusses or permit other camera mounting at approximately 6-6.5m in height. This is
typically done by a rigging company with a truss, though some venues may already have trussing. The committees are
working hard to support a system where overhead cameras may be replaced by side mount cameras but we cannot guarantee
support for this yet and it is currently experimental.

One camera setup weighs approximately 2.5kg or 5lbs. This is under the limit where a licensed rigger is required to
fasten the equipment to the truss, but you should consult the [field setup guide](setupguide.md).

The league owns 8 camera systems, enough for 4 Division A fields or 8 Division B fields, and typically 5 of them are in
use at an international event. See the [travel case documentation](travelcases.md) for what ships. If your event needs
more fields than that covers, talk to the committees early, since cameras and lenses are a long lead time item. Note
also that the league cameras are not PoE. A direct wired camera configuration needs PoE cameras sourced locally.

## Lighting

Ideally the venue is windowless and has controllable overhead lighting. It's also important to confirm the overhead
lighting does not exhibit 50/60Hz flicker, though this is rare in most venues. If the venue has windows, it will almost
certainly mandate the use of SSL Vision Processor over SSL Vision (legacy) due to shifting color calibrations throughout
the day.

You may wish to provide additional lighting for consistency. A lighting guide is coming soon to the field documentation.

## Power

Power delivery is inherent to the venue, and thus must be provided by event organizer/venue. All league equipment
supports international power standards 100-240V, 50-60Hz. Teams are also expected to bring equipment that is
internationally compatible. This section outlines the power requirements. It's worth checking venue pricing to supply
extra outlets. In many cases it's cheaper to buy local power strips wholesale and only have the venue provide
approximate single outlet/plug drops with the organizer or teams providing power strips/extensions.

The event organizer only needs to provide 1 ~1500W drop per team table cluster. Event organizers should plan for an
average power usage of 750W per team (this is conservative) and should include outlets for the needed field equipment.
Total field power draw in its full configuration will not exceed ~1.2kW, excluding any streaming PCs.

## Network

Organizers should be prepared to provide field networks. This means either providing a router per field for isolation,
or setting up VLANs. Most teams simply reuse their lab equipment for regional events. For larger events, a networking
contractor may be required and the [network documentation](../field/network/compnetwork.md) may offer some help. PoE
will need to be provided for any field running remote controls.

Internet at the field is not guaranteed to participants, but is a strong positive if it can be included.

One network drop should be provided per team table, or WiFi can be provided if you have control over the channel
allocation.
