// Loaded site-wide via html_js_files; no-op on pages without the calculator.
if (document.getElementById('vc-calc')) {

const VC_SQFT_PER_SQM = 10.7639104;

// Pit size bands. The first three are published in Venue Requirements; the
// fourth extends the same (2t + 2) x 3 formula past where they stop.
//
// `members` is only used for the competitor count, and is the band's midpoint
// — a band is all the size information enumerate mode is given, so there is
// nothing better to assume. The 19+ band is open-ended and has no midpoint, so
// 22 is a nominal stand-in.
const VC_SIZE_BANDS = [
  { key: '1', label: '1–3 members', tables: 1, members: 2 },
  { key: '2', label: '4–10 members', tables: 2, members: 7 },
  { key: '3', label: '11–18 members', tables: 3, members: 15 },
  { key: '4', label: '19+ members', tables: 4, members: 22 },
];

const VC_DIVISIONS = ['a', 'b'];

function vcNum(id) {
  const v = parseFloat(document.getElementById(id).value);
  return isNaN(v) ? 0 : v;
}

function vcInt(id) {
  const v = parseInt(document.getElementById(id).value, 10);
  return isNaN(v) ? 0 : v;
}

function vcChecked(id) {
  return document.getElementById(id).checked;
}

function vcRadio(name) {
  return document.querySelector(`input[name="${name}"]:checked`).value;
}

// --- Presets ------------------------------------------------------------

function vcSetVoltage(v, a) {
  document.getElementById('vc-voltage').value = v;
  document.getElementById('vc-amps').value = a;
  vcInvalidate();
}

document.getElementById('vc-preset-na').addEventListener('click', function () {
  vcSetVoltage(120, 20);
});
document.getElementById('vc-preset-eu').addEventListener('click', function () {
  vcSetVoltage(230, 16);
});
document.getElementById('vc-preset-jp').addEventListener('click', function () {
  vcSetVoltage(100, 15);
});

// --- Pit sizing ---------------------------------------------------------

function vcClusterArea(tables) {
  // t tables inline occupy 2t x 1 m, plus a shared 1 m buffer on every side.
  if (tables <= 0) return 0;
  return (2 * tables + 2) * 3;
}

function vcTablesForMembers(members) {
  // Same boundaries as the bands above. The published bands overlap at 10 —
  // "4-10" and "10-18" both claim it — so 10 is resolved to the band whose
  // label the matrix shows, 4-10.
  if (members <= 3) return 1;
  if (members <= 10) return 2;
  if (members <= 18) return 3;
  return 3 + Math.ceil((members - 18) / 8);
}

// Returns { teams, tables, area, people } for one division. `mode` defaults to
// whichever team-entry mode is selected; passing it explicitly lets each table
// render its own footer from its own inputs, so the greyed-out one stays
// self-consistent rather than echoing the active mode's number. `people` is
// competitors only — no referees, organizers, volunteers or spectators.
function vcDivisionPits(div, mode) {
  if ((mode || vcRadio('vc-team-mode')) === 'matrix') {
    let teams = 0;
    let tables = 0;
    let area = 0;
    let people = 0;
    VC_SIZE_BANDS.forEach(function (band) {
      const n = vcInt(`vc-mx-${div}-${band.key}`);
      teams += n;
      tables += n * band.tables;
      area += n * vcClusterArea(band.tables);
      people += n * vcNum(`vc-adv-members-${band.key}`);
    });
    return { teams, tables, area, people };
  }
  const teams = vcInt(`vc-teams-${div}`);
  const members = vcNum(`vc-members-${div}`);
  const tables = vcTablesForMembers(members);
  return {
    teams,
    tables: teams * tables,
    area: teams * vcClusterArea(tables),
    people: teams * members,
  };
}

// --- Mode sync and derived fields ---------------------------------------

function vcSyncTeamMode() {
  const matrix = vcRadio('vc-team-mode') === 'matrix';
  VC_DIVISIONS.forEach(function (div) {
    document.getElementById(`vc-teams-${div}`).disabled = matrix;
    document.getElementById(`vc-members-${div}`).disabled = matrix;
  });
  VC_SIZE_BANDS.forEach(function (band) {
    VC_DIVISIONS.forEach(function (div) {
      document.getElementById(`vc-mx-${div}-${band.key}`).disabled = !matrix;
    });
  });
}

function vcUpdateTeamTotals() {
  // In average mode the matrix is a read-only echo of the plain team counts,
  // collapsing each division into the one band its average lands in — a flat
  // distribution to start editing from, not a claim about the real spread.
  // Competitor counts do NOT carry across: enumerate mode has only the band to
  // go on, so it uses band midpoints and its total will differ.
  if (vcRadio('vc-team-mode') !== 'matrix') {
    VC_DIVISIONS.forEach(function (div) {
      const teams = vcInt(`vc-teams-${div}`);
      const tables = vcTablesForMembers(vcNum(`vc-members-${div}`));
      const band = VC_SIZE_BANDS.find(b => b.tables === Math.min(tables, 4)) || VC_SIZE_BANDS[3];
      VC_SIZE_BANDS.forEach(function (b) {
        document.getElementById(`vc-mx-${div}-${b.key}`).value = b.key === band.key ? teams : 0;
      });
    });
  }
  // The matrix's "Members assumed" column is a read-only echo of the advanced
  // per-band figures, so changing one there can't leave the table contradicting
  // the number actually used.
  VC_SIZE_BANDS.forEach(function (band) {
    document.getElementById(`vc-mem-disp-${band.key}`).textContent =
      vcNum(`vc-adv-members-${band.key}`);
  });
  VC_DIVISIONS.forEach(function (div) {
    const byMatrix = vcDivisionPits(div, 'matrix');
    document.getElementById(`vc-mx-${div}-total`).textContent = byMatrix.teams;
    document.getElementById(`vc-mx-${div}-people`).textContent = Math.round(byMatrix.people);
    document.getElementById(`vc-avg-${div}-people`).textContent =
      Math.round(vcDivisionPits(div, 'average').people);
  });
}

function vcSyncFieldMode() {
  const derive = vcRadio('vc-field-mode') === 'derive';
  ['vc-div-a', 'vc-div-b', 'vc-div-b-practice'].forEach(function (id) {
    document.getElementById(id).disabled = derive;
  });
}

// How many teams one field is planned to carry. Fixed rather than exposed as
// inputs: an organizer who disagrees with them is better served typing the
// field counts they want directly, which is what manual mode is for.
const VC_TEAMS_PER_FIELD_A = 10;
const VC_TEAMS_PER_FIELD_B = 12;
const VC_TEAMS_PER_PRACTICE_FIELD = 20;

// Below this many teams sharing a match field, that field has enough idle time
// to practise on and a dedicated practice field isn't worth the floor space.
const VC_PRACTICE_SKIP_LOAD = 4;

// Field N gets VLAN (10 x N) on 10.(10 x N).0.0/16, so the VLAN id and the
// second octet always match and a glance at an address says which field it is.
// Field 1 lands on 10.10.0.0/16, the worked example in Competition Network.
const VC_VLAN_STEP = 10;
// Far enough above the field range that it can't collide until 20 fields.
const VC_PITS_VLAN = 200;

// Addresses held back below the DHCP pool for gateway, switches, routers and
// anything else that wants to sit at a fixed address. DHCP starts just above.
const VC_MGMT_RESERVED_TO = 50;

// One chair per competitor in the pits, since everyone needs somewhere to sit
// at their own bench, and one per table at the field for whoever is operating
// it. Organizer tables get one each on top.
const VC_CHAIRS_PER_COMPETITOR = 1;
const VC_CHAIRS_PER_FIELD_TABLE = 1;

// Camera systems the league owns and ships in its travel cases: enough for
// 4 Division A fields or 8 Division B fields. Anything past this the host has
// to source, and cameras and lenses are a long lead time item.
const VC_LEAGUE_CAMERA_SYSTEMS = 8;

// One remote control per team at the field, so a field either has both or none.
const VC_REMOTES_PER_FIELD = 2;

// A monitor each for the vision and game controller computers. They share their
// computer's table outlet via a power strip, so they add watts but not outlets.
const VC_MONITORS_PER_FIELD = 2;

// Tables at a field: two for the field's own equipment (vision, game
// controller), then one per team the field serves, capped at what will
// physically fit around a field of that size.
const VC_FIELD_EQUIPMENT_TABLES = 2;
const VC_FIELD_TABLES_MAX_A = 8;
const VC_FIELD_TABLES_MAX_B = 6;

// What the league's own travel cases turn up with, per field type. Must stay in
// step with the Field Equipment matrix's authored values, since Restore writes
// these back over whatever the page is showing.
const VC_FIELD_EQUIP_DEFAULTS = {
  a: { cfg: 'nuc2', remotes: true, status: 2, audio: true, stream: true },
  b: { cfg: 'nuc1', remotes: true, status: 2, audio: true, stream: true },
  p: { remotes: false, status: 0, audio: false, stream: false },
};
const VC_POE_STATUS_DEFAULT = false;

function vcRestoreFieldEquipment() {
  Object.keys(VC_FIELD_EQUIP_DEFAULTS).forEach(function (key) {
    const d = VC_FIELD_EQUIP_DEFAULTS[key];
    document.getElementById(`vc-remotes-${key}`).checked = d.remotes;
    document.getElementById(`vc-status-${key}`).value = d.status;
    document.getElementById(`vc-audio-${key}`).checked = d.audio;
    document.getElementById(`vc-stream-${key}`).checked = d.stream;
    // Practice fields borrow Division B's camera config and have no select.
    if (d.cfg) document.getElementById(`vc-cfg-${key}`).value = d.cfg;
  });
  document.getElementById('vc-poe-status').checked = VC_POE_STATUS_DEFAULT;
}

document.getElementById('vc-equip-reset').addEventListener('click', function () {
  vcRestoreFieldEquipment();
  vcInvalidate();
});

// Added on top of pit footprint for aisles between rows. The published band
// areas are footprint only, with no room to walk between them.
const VC_PITS_CIRCULATION = 0.30;

// Spectator seating, stage and registration. Not part of any league figure.
const VC_OTHER_AREA_SQM = 0;

// Spare capacity on each field switch, before rounding up to a stock port
// count. Guards against a dead port and the odd unplanned device.
const VC_SPARE_PORT_HEADROOM = 20;

// Drops that reach the outside world rather than a field: the streaming rigs
// and the organizers' desk.
const VC_INTERNET_DROPS = 2;

// Every power figure the calculator uses, in one place. None of these are on
// the form: they're either set by regulation, published by the league, or
// nameplate estimates an event organizer has no way to improve on. Edit here to
// retune the model; the Power section's "Show calculations" lists the values so
// the page stays auditable without being editable.
const VC_POWER = {
  // Fraction of a breaker's rating usable by a continuous load. Regulatory,
  // not a preference.
  circuitDerate: 0.80,

  // Applied to field-side nameplate load to estimate real draw. Taken from the
  // league's own published 1500 W provisioned / 750 W average team ratio,
  // since no equivalent average is published for field equipment.
  diversity: 0.50,

  // Published in Venue Requirements: provision this much per team, plan the
  // building aggregate on the average.
  teamDropW: 1500,
  teamAverageW: 750,

  // Nameplate / PSU-rating estimates against the minimum specs on the Compute
  // Resources page. Not measurements.
  devices: {
    // Vision and game controller computers together, as one per-field figure.
    // They remain two machines for outlet and switch-port counting.
    visionAndGc: 500,
    // Screens for those two computers. Counted separately so the computer
    // figure stays comparable with the Compute Resources specs.
    monitor: 45,
    streaming: 750,
    trussNuc: 90,
    fieldSwitch: 30,
    fieldRouter: 30,
    // A status board is a display plus the small computer driving it. The
    // display is always mains; only the computer can move onto PoE, so the
    // two are costed separately.
    statusBoardDisplay: 45,
    statusBoardComputer: 15,
    audioReferee: 100,
    // Supplemental field lighting. Zero unless an event brings its own; a
    // non-zero value also earns a floor outlet per field.
    lightingPerField: 0,
  },

  // Drawn from a PoE source rather than an outlet.
  poe: {
    remoteControl: 25.5,
    camera: 8,
    statusBoard: 15,
  },
};

// --- Advanced Configuration --------------------------------------------
//
// Every constant above is also an input, tucked behind a collapsed "Advanced
// Configuration" block in its section. The constants stay the single source of
// truth: on load their values are written into the inputs, and from then on the
// calculator reads the inputs. That way there's no second copy of a default to
// drift, and Restore just rewrites from the constant.
const VC_ADVANCED_GROUPS = {
  teams: {
    'vc-adv-members-1': VC_SIZE_BANDS[0].members,
    'vc-adv-members-2': VC_SIZE_BANDS[1].members,
    'vc-adv-members-3': VC_SIZE_BANDS[2].members,
    'vc-adv-members-4': VC_SIZE_BANDS[3].members,
  },
  fields: {
    'vc-adv-per-field-a': VC_TEAMS_PER_FIELD_A,
    'vc-adv-per-field-b': VC_TEAMS_PER_FIELD_B,
    'vc-adv-per-practice': VC_TEAMS_PER_PRACTICE_FIELD,
    'vc-adv-practice-skip': VC_PRACTICE_SKIP_LOAD,
  },
  equipment: {
    'vc-adv-remotes-per-field': VC_REMOTES_PER_FIELD,
    'vc-adv-monitors-per-field': VC_MONITORS_PER_FIELD,
    'vc-adv-chairs-per-field-table': VC_CHAIRS_PER_FIELD_TABLE,
    'vc-adv-field-equip-tables': VC_FIELD_EQUIPMENT_TABLES,
    'vc-adv-field-tables-max-a': VC_FIELD_TABLES_MAX_A,
    'vc-adv-field-tables-max-b': VC_FIELD_TABLES_MAX_B,
  },
  pits: {
    'vc-adv-chairs-per-competitor': VC_CHAIRS_PER_COMPETITOR,
    'vc-adv-circulation': VC_PITS_CIRCULATION * 100,
    'vc-adv-other-area': VC_OTHER_AREA_SQM,
  },
  network: {
    'vc-adv-spare-ports': VC_SPARE_PORT_HEADROOM,
    'vc-adv-internet-drops': VC_INTERNET_DROPS,
  },
  power: {
    'vc-adv-derate': VC_POWER.circuitDerate * 100,
    'vc-adv-diversity': VC_POWER.diversity,
    'vc-adv-team-drop': VC_POWER.teamDropW,
    'vc-adv-team-avg': VC_POWER.teamAverageW,
    'vc-adv-w-visiongc': VC_POWER.devices.visionAndGc,
    'vc-adv-w-stream': VC_POWER.devices.streaming,
    'vc-adv-w-nuc': VC_POWER.devices.trussNuc,
    'vc-adv-w-switch': VC_POWER.devices.fieldSwitch,
    'vc-adv-w-router': VC_POWER.devices.fieldRouter,
    'vc-adv-w-monitor': VC_POWER.devices.monitor,
    'vc-adv-w-status-display': VC_POWER.devices.statusBoardDisplay,
    'vc-adv-w-status-board': VC_POWER.devices.statusBoardComputer,
    'vc-adv-w-audio': VC_POWER.devices.audioReferee,
    'vc-adv-w-lighting': VC_POWER.devices.lightingPerField,
    'vc-adv-poe-remote': VC_POWER.poe.remoteControl,
    'vc-adv-poe-camera': VC_POWER.poe.camera,
    'vc-adv-poe-status': VC_POWER.poe.statusBoard,
  },
};

function vcRestoreAdvanced(group) {
  const defaults = VC_ADVANCED_GROUPS[group];
  if (!defaults) return;
  Object.keys(defaults).forEach(function (id) {
    document.getElementById(id).value = defaults[id];
  });
}

Object.keys(VC_ADVANCED_GROUPS).forEach(vcRestoreAdvanced);

document.querySelectorAll('[data-vc-adv-reset]').forEach(function (button) {
  button.addEventListener('click', function () {
    vcRestoreAdvanced(button.getAttribute('data-vc-adv-reset'));
    vcRefresh();
    vcInvalidate();
  });
});


function vcUpdateDerivedFieldCounts() {
  if (vcRadio('vc-field-mode') !== 'derive') return;
  const teamsA = vcDivisionPits('a').teams;
  const teamsB = vcDivisionPits('b').teams;

  const fieldsA = Math.ceil(teamsA / Math.max(1, vcNum('vc-adv-per-field-a')));
  const fieldsB = Math.ceil(teamsB / Math.max(1, vcNum('vc-adv-per-field-b')));
  document.getElementById('vc-div-a').value = fieldsA;
  document.getElementById('vc-div-b').value = fieldsB;

  // Measured against the load each match field actually ends up with after the
  // division rounds up, not the configured maximum — 5 teams at a cap of 12 is
  // one lightly loaded field, not a full one. Divisions with no teams have no
  // fields and don't vote.
  const loads = [];
  if (fieldsA > 0) loads.push(teamsA / fieldsA);
  if (fieldsB > 0) loads.push(teamsB / fieldsB);
  const skipAt = vcNum('vc-adv-practice-skip');
  const lightlyLoaded = loads.length > 0 && loads.every(l => l <= skipAt);

  document.getElementById('vc-div-b-practice').value =
    lightlyLoaded ? 0 : Math.ceil((teamsA + teamsB) / Math.max(1, vcNum('vc-adv-per-practice')));
}

function vcRefresh() {
  vcUpdateTeamTotals();
  vcUpdateDerivedFieldCounts();
}

document.querySelectorAll('input[name="vc-team-mode"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    vcSyncTeamMode();
    vcRefresh();
  });
});

document.querySelectorAll('input[name="vc-field-mode"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    vcSyncFieldMode();
    vcRefresh();
  });
});

['vc-teams-a', 'vc-members-a', 'vc-teams-b', 'vc-members-b']
  .concat(VC_SIZE_BANDS.flatMap(b => [`vc-mx-a-${b.key}`, `vc-mx-b-${b.key}`]))
  .forEach(function (id) {
    document.getElementById(id).addEventListener('input', vcRefresh);
  });

// Browsers restore previously-checked radios on a plain page refresh, which
// doesn't fire 'change' — resync to whatever's actually checked now, not just
// the HTML's hardcoded defaults.
vcSyncTeamMode();
vcSyncFieldMode();
vcRefresh();

// --- Field geometry -----------------------------------------------------

function vcFieldFootprint(fw, fh, buffer) {
  const w = fw + 2 * buffer;
  const h = fh + 2 * buffer;
  return { w, h, area: w * h };
}

function vcCameraConfig(cfg) {
  if (cfg === 'direct4') return { cameras: 4, nucs: 0, direct: true };
  if (cfg === 'nuc2') return { cameras: 2, nucs: 2, direct: false };
  return { cameras: 1, nucs: 1, direct: false };
}

// Every field gets the same switch. Standardising on one size means one spare
// on the shelf fits any field, and 24 ports covers every configuration the
// league runs with headroom to spare.
const VC_FIELD_SWITCH_PORTS = 24;

function vcSwitchCount(portsWithHeadroom) {
  return Math.max(1, Math.ceil(portsWithHeadroom / VC_FIELD_SWITCH_PORTS));
}

// --- Render helpers -----------------------------------------------------

// The report is rebuilt on every Calculate and is what the CSV download is
// serialised from, so the file always matches exactly what's on screen.
let vcReport = [];

// The headline numbers a host quotes at a venue, collected alongside the full
// report. Values are plain text, never HTML, since they go straight into
// Markdown and the clipboard.
let vcSummary = [];

// `estimated` marks a headline whose value rests on a figure no league
// document states, so the Markdown export can say so rather than presenting
// every line with the same authority.
function vcSum(label, value, estimated) {
  vcSummary.push({ label, value, estimated: !!estimated });
}

// "a", "a and b", "a, b and c".
function vcList(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function vcHead(label) {
  vcReport.push({ type: 'head', text: label });
  return `<h3 class="venue-calc-out-head">${label}</h3>`;
}

function vcNote(text, warn) {
  vcReport.push({ type: 'note', text });
  return `<p class="venue-calc-out-note${warn ? ' vc-warn' : ''}">${text}</p>`;
}

// rows: arrays of cell strings, or { cells, cls } to style the whole row.
// A null row renders nothing, so callers can inline their conditionals.
function vcTable(headers, rows) {
  vcReport.push({
    type: 'table',
    headers,
    rows: rows.filter(Boolean).map(r => (Array.isArray(r) ? r : r.cells)),
  });
  const head = headers.map(h => `<th>${h}</th>`).join('');
  const body = rows.filter(Boolean).map(function (row) {
    const cells = Array.isArray(row) ? row : row.cells;
    const cls = Array.isArray(row) ? '' : (row.cls || '');
    const tds = cells.map(function (c, i) {
      // First column labels the row; the rest are figures.
      return i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`;
    }).join('');
    return `<tr${cls ? ` class="${cls}"` : ''}>${tds}</tr>`;
  }).join('');
  return `<table class="venue-calc-out-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

// Areas round up, never to nearest: these are figures an organizer hands a
// venue, and rounding a floor requirement down under-books the room. Square
// feet are converted from the exact area before rounding, not from the
// already-rounded metric figure.
function vcSqm(sqm) {
  return Math.ceil(sqm);
}

function vcSqft(sqm) {
  return Math.ceil(sqm * VC_SQFT_PER_SQM);
}

function vcW(w) {
  return w >= 1000 ? `${(w / 1000).toFixed(2)} kW` : `${w.toFixed(0)} W`;
}

// --- Calculate ----------------------------------------------------------

function vcCalculate() {
  vcRefresh();
  vcReport = [];
  vcSummary = [];

  const pitsA = vcDivisionPits('a');
  const pitsB = vcDivisionPits('b');
  const teams = pitsA.teams + pitsB.teams;
  const competitors = Math.round(pitsA.people + pitsB.people);

  const buffer = vcNum('vc-buffer');
  const cfgA = vcCameraConfig(document.getElementById('vc-cfg-a').value);
  const cfgB = vcCameraConfig(document.getElementById('vc-cfg-b').value);
  // `key` selects this field type's column in the Field Equipment matrix.
  // `served` is the teams this field type has to seat; practice fields are
  // shared by the whole event, match fields only by their own division.
  const fieldGroups = [
    { label: 'Division A match', n: vcInt('vc-div-a'), fw: 13.4, fh: 10.4, cfg: cfgA, key: 'a',
      div: 'a', served: pitsA.teams },
    { label: 'Division B match', n: vcInt('vc-div-b'), fw: 10.4, fh: 7.4, cfg: cfgB, key: 'b',
      div: 'b', served: pitsB.teams },
    { label: 'Division B practice', n: vcInt('vc-div-b-practice'), fw: 10.4, fh: 7.4, cfg: cfgB, key: 'p',
      div: 'b', served: teams },
  ];
  const activeGroups = fieldGroups.filter(g => g.n > 0);
  const totalFields = activeGroups.reduce((sum, g) => sum + g.n, 0);

  const equipTables = vcNum('vc-adv-field-equip-tables');
  const fieldTableCap = { a: vcNum('vc-adv-field-tables-max-a'), b: vcNum('vc-adv-field-tables-max-b') };

  // Tables at one field of this type: the field's own equipment tables plus one
  // per team it serves, capped at what fits around a field that size. Returns
  // the split so outlets can count all of them and switch ports only the team
  // ones — the equipment tables' machines are already counted individually.
  function vcFieldTables(g) {
    const perField = g.n > 0 ? Math.ceil(g.served / g.n) : 0;
    const cap = Math.max(equipTables, fieldTableCap[g.div]);
    const total = Math.min(equipTables + perField, cap);
    return { served: perField, equipment: equipTables, team: total - equipTables, total, capped: equipTables + perField > cap };
  }

  let html = '';

  // --- Event scale ------------------------------------------------------

  const teamMode = vcRadio('vc-team-mode') === 'matrix' ? 'enumerated' : 'from division averages';
  const fieldMode = vcRadio('vc-field-mode') === 'derive' ? 'derived from teams' : 'set directly';

  html += vcHead('Event Scale');
  html += vcTable(['', 'Division A', 'Division B', 'Total'], [
    ['Teams', pitsA.teams, pitsB.teams, `<strong>${teams}</strong>`],
    ['Competitors', Math.round(pitsA.people), Math.round(pitsB.people), `<strong>${competitors}</strong>`],
    ['Pit tables', pitsA.tables, pitsB.tables, pitsA.tables + pitsB.tables],
  ]);
  html += vcNote(`Team sizes ${teamMode}. Competitors counts team members only, so referees, organizers, `
    + `volunteers and spectators are on top of it.`);
  const camerasTotal = activeGroups.reduce((sum, g) => sum + g.cfg.cameras * g.n, 0);
  html += vcTable(['Fields', 'Count', 'Cameras each', 'Cameras'],
    activeGroups.map(g => [g.label, g.n, g.cfg.cameras, g.cfg.cameras * g.n])
      .concat([{
        cells: ['Total', `<strong>${totalFields}</strong>`, '', `<strong>${camerasTotal}</strong>`],
        cls: 'vc-total',
      }]));
  html += vcNote(`Field counts ${fieldMode}.`);
  vcSum('Teams', `${teams} (${pitsA.teams} Division A, ${pitsB.teams} Division B)`);
  // Average mode multiplies the organizer's own roster figures; enumerate mode
  // has only the band, so it falls back to midpoints.
  vcSum('Competitors', `${competitors}`, vcRadio('vc-team-mode') === 'matrix');
  vcSum('Fields', `${totalFields} (${activeGroups.map(g => `${g.n} ${g.label}`).join(', ')})`, true);
  vcSum('Camera systems', `${camerasTotal}`, true);
  if (camerasTotal > VC_LEAGUE_CAMERA_SYSTEMS) {
    html += vcNote(
      `This needs ${camerasTotal} camera systems and the league owns ${VC_LEAGUE_CAMERA_SYSTEMS}. `
        + `Talk to the committees early, since cameras and lenses are a long lead time item.`,
      true
    );
  }
  if (activeGroups.some(g => g.cfg.direct)) {
    html += vcNote(
      'A direct wired configuration needs PoE cameras. The league does not own any, so those have to be '
        + 'sourced locally.',
      true
    );
  }

  // --- Floor area -------------------------------------------------------

  let fieldArea = 0;
  const areaRows = [];
  activeGroups.forEach(function (g) {
    const fp = vcFieldFootprint(g.fw, g.fh, buffer);
    fieldArea += fp.area * g.n;
    areaRows.push([
      `${g.label} &times; ${g.n}`,
      `${fp.w.toFixed(1)} &times; ${fp.h.toFixed(1)} m`,
      vcSqm(fp.area * g.n),
      vcSqft(fp.area * g.n),
    ]);
  });

  // At least one organizer table always exists; the form enforces it too.
  const organizerTables = Math.max(1, vcInt('vc-organizer-tables'));
  const organizerArea = vcClusterArea(organizerTables);
  const teamsArea = pitsA.area + pitsB.area;
  const circulation = vcNum('vc-adv-circulation') / 100;
  const pitsArea = (teamsArea + organizerArea) * (1 + circulation);
  const otherArea = vcNum('vc-adv-other-area');
  const totalArea = fieldArea + pitsArea + otherArea;

  html += vcHead('Floor Area');
  html += vcTable(['Area', 'Each', 'm&sup2;', 'sq.ft'], areaRows.concat([
    { cells: ['All fields', '', vcSqm(fieldArea), vcSqft(fieldArea)], cls: 'vc-subtotal' },
    pitsA.teams > 0
      ? [`Division A pits &times; ${pitsA.teams}`, `${vcSqm(pitsA.area / pitsA.teams)} m&sup2;`,
         vcSqm(pitsA.area), vcSqft(pitsA.area)]
      : null,
    pitsB.teams > 0
      ? [`Division B pits &times; ${pitsB.teams}`, `${vcSqm(pitsB.area / pitsB.teams)} m&sup2;`,
         vcSqm(pitsB.area), vcSqft(pitsB.area)]
      : null,
    [`Organizer tables &times; ${organizerTables}`, '', vcSqm(organizerArea), vcSqft(organizerArea)],
    { cells: [`Pits subtotal, +${(circulation * 100).toFixed(0)}% circulation`, '',
              vcSqm(pitsArea), vcSqft(pitsArea)], cls: 'vc-subtotal' },
    otherArea > 0 ? ['Other area', '', vcSqm(otherArea), vcSqft(otherArea)] : null,
    { cells: ['Total floor area', '', `<strong>${vcSqm(totalArea)}</strong>`,
              `<strong>${vcSqft(totalArea)}</strong>`], cls: 'vc-total' },
  ]));
  vcSum('Total floor area', `${vcSqm(totalArea)} m\u00b2 (${vcSqft(totalArea)} sq.ft)`, true);
  if (competitors > 0) {
    // Not a code requirement — a sanity figure to check against whatever
    // occupancy number the venue quotes, which counts heads, not equipment.
    html += vcNote(`That works out to ${(totalArea / competitors).toFixed(1)} m&sup2; `
      + `(${(totalArea * VC_SQFT_PER_SQM / competitors).toFixed(0)} sq.ft) per competitor across `
      + `${competitors} of them. Worth checking against whatever occupancy limit the venue quotes.`);
  }

  // --- Tables -----------------------------------------------------------

  const fieldTableRows = activeGroups.map(function (g) {
    const t = vcFieldTables(g);
    return {
      cells: [`${g.label} &times; ${g.n}`, t.served, t.equipment, t.team, t.total, t.total * g.n],
      cls: t.capped ? 'vc-warn' : '',
    };
  });
  const fieldTablesTotal = activeGroups.reduce((sum, g) => sum + vcFieldTables(g).total * g.n, 0);
  const pitTablesTotal = pitsA.tables + pitsB.tables + organizerTables;

  html += vcHead('Tables and Chairs');
  html += vcTable(['At the fields', 'Teams served', 'Equipment', 'Team', 'Per field', 'Total'],
    fieldTableRows.concat([
      { cells: ['All fields', '', '', '', '', `<strong>${fieldTablesTotal}</strong>`], cls: 'vc-total' },
    ]));
  if (activeGroups.some(g => vcFieldTables(g).capped)) {
    const cappedLabels = activeGroups.filter(g => vcFieldTables(g).capped).map(g => g.label);
    html += vcNote(`${vcList(cappedLabels)} serve more teams than they have room for. `
      + `${fieldTableCap.a} tables fit a Division A field and ${fieldTableCap.b} fit a Division B one, so teams `
      + `there share a table between matches rather than each keeping one.`, true);
  }
  html += vcTable(['In the pits', 'Tables'], [
    pitsA.teams > 0 ? [`Division A teams &times; ${pitsA.teams}`, pitsA.tables] : null,
    pitsB.teams > 0 ? [`Division B teams &times; ${pitsB.teams}`, pitsB.tables] : null,
    ['Organizers', organizerTables],
    { cells: ['All pits', `<strong>${pitTablesTotal}</strong>`], cls: 'vc-total' },
  ]);
  html += vcTable(['Event total', 'Tables'], [
    { cells: ['Fields and pits', `<strong>${fieldTablesTotal + pitTablesTotal}</strong>`], cls: 'vc-total' },
  ]);

  const chairsPerCompetitor = vcNum('vc-adv-chairs-per-competitor');
  const chairsPerFieldTable = vcNum('vc-adv-chairs-per-field-table');
  const pitChairs = Math.ceil(competitors * chairsPerCompetitor) + organizerTables;
  const fieldChairs = Math.ceil(fieldTablesTotal * chairsPerFieldTable);
  html += vcTable(['Chairs', 'Each', 'Count'], [
    ['Competitors', `${chairsPerCompetitor} per competitor`, Math.ceil(competitors * chairsPerCompetitor)],
    ['Organizers', '1 per table', organizerTables],
    ['At the fields', `${chairsPerFieldTable} per table`, fieldChairs],
    { cells: ['Total', '', `<strong>${pitChairs + fieldChairs}</strong>`], cls: 'vc-total' },
  ]);
  vcSum('Tables', `${fieldTablesTotal + pitTablesTotal} (${fieldTablesTotal} at the fields, `
    + `${pitTablesTotal} in the pits)`, true);
  vcSum('Chairs', `${pitChairs + fieldChairs}`, true);

  // --- Power ------------------------------------------------------------

  const wVisionGc = vcNum('vc-adv-w-visiongc');
  const wStream = vcNum('vc-adv-w-stream');
  const wNuc = vcNum('vc-adv-w-nuc');
  const wSwitch = vcNum('vc-adv-w-switch');
  const wRouter = vcNum('vc-adv-w-router');
  const wMonitor = vcNum('vc-adv-w-monitor');
  const wStatusDisplay = vcNum('vc-adv-w-status-display');
  const wStatusBoard = vcNum('vc-adv-w-status-board');
  const monitorsPerField = vcNum('vc-adv-monitors-per-field');
  const wAudio = vcNum('vc-adv-w-audio');
  const wLighting = vcNum('vc-adv-w-lighting');

  const poeStatus = vcChecked('vc-poe-status');

  const poeRemoteW = vcNum('vc-adv-poe-remote');
  const poeCameraW = vcNum('vc-adv-poe-camera');
  const poeStatusW = vcNum('vc-adv-poe-status');

  // Per field type, from the Field Equipment matrix. Remotes are all-or-nothing
  // — one per team at the field, both teams or neither — and status boards are
  // capped at the 3 the matrix allows.
  const remotesPerField = vcNum('vc-adv-remotes-per-field');
  const vcRemotes = g => (vcChecked(`vc-remotes-${g.key}`) ? remotesPerField : 0);
  const vcStatusBoards = g => Math.min(3, Math.max(0, vcInt(`vc-status-${g.key}`)));
  const vcHasAudio = g => vcChecked(`vc-audio-${g.key}`);
  const vcHasStream = g => vcChecked(`vc-stream-${g.key}`);

  // One streaming rig per field that's streaming, not one for the whole event.
  const streamingCount = activeGroups.reduce((sum, g) => sum + (vcHasStream(g) ? g.n : 0), 0);

  const voltage = vcNum('vc-voltage');
  const amps = vcNum('vc-amps');
  const derate = vcNum('vc-adv-derate') / 100;
  const circuitW = Math.max(1, voltage * amps * derate);

  // Status boards draw from PoE or from an outlet, never both. The display
  // wattage is the outlet-side figure; the PoE figure is the board alone.
  const perFieldGroundW = function (g) {
    return wVisionGc + monitorsPerField * wMonitor + wSwitch + wRouter + wLighting
      // The display draws mains either way; only the board itself can be PoE.
      + vcStatusBoards(g) * wStatusDisplay
      + (poeStatus ? 0 : vcStatusBoards(g) * wStatusBoard)
      + (vcHasAudio(g) ? wAudio : 0);
  };
  // Truss-mounted cameras draw from their NUC, so the NUC figure is the whole
  // truss-side load; direct-wired cameras draw PoE from the vision computer.
  const perFieldTrussW = function (g) {
    return g.cfg.nucs * wNuc;
  };

  let fieldsConnected = 0;
  let trussConnected = 0;
  let fieldCircuits = 0;
  const fieldPowerRows = [];
  const fieldCircuitRows = [];
  activeGroups.forEach(function (g) {
    const ground = perFieldGroundW(g);
    const truss = perFieldTrussW(g);
    fieldsConnected += ground * g.n;
    trussConnected += truss * g.n;
    fieldPowerRows.push([`${g.label} &times; ${g.n}`, vcW(ground), vcW(truss),
                         vcW((ground + truss) * g.n)]);
    // Circuits are counted per field rather than off the venue-wide total:
    // fields are physically separated, and truss-height outlets are fed
    // separately from floor-level ones, so neither shares a breaker with
    // another field.
    const groundCircuits = Math.ceil(ground / circuitW);
    const trussCircuits = truss > 0 ? Math.ceil(truss / circuitW) : 0;
    fieldCircuits += (groundCircuits + trussCircuits) * g.n;
    fieldCircuitRows.push([`${g.label} &times; ${g.n}`, groundCircuits, trussCircuits,
                           (groundCircuits + trussCircuits) * g.n]);
  });

  const teamDropW = vcNum('vc-adv-team-drop');
  const teamAvgW = vcNum('vc-adv-team-avg');
  const streamingConnected = streamingCount * wStream;
  const pitsConnected = teams * teamDropW;
  const pitsAverage = teams * teamAvgW;
  const diversity = vcNum('vc-adv-diversity');
  const fieldConnectedAll = fieldsConnected + trussConnected + streamingConnected;
  const fieldAverage = fieldConnectedAll * diversity;
  const totalConnected = fieldConnectedAll + pitsConnected;
  const totalAverage = fieldAverage + pitsAverage;

  html += vcHead('Power');
  html += vcTable(['Fields', 'Floor, each', 'Truss, each', 'Connected'], fieldPowerRows.concat([
    streamingCount > 0
      ? [`Streaming computers &times; ${streamingCount}`, vcW(wStream), '', vcW(streamingConnected)]
      : null,
    { cells: ['All fields connected', '', '', vcW(fieldConnectedAll)], cls: 'vc-subtotal' },
    { cells: [`All fields expected (&times; ${diversity} diversity)`, '', '', vcW(fieldAverage)],
      cls: 'vc-subtotal' },
  ]));
  html += vcTable(['Pits', 'Per team', 'Teams', 'Total'], [
    ['Provisioned capacity', vcW(teamDropW), teams, vcW(pitsConnected)],
    ['Expected draw', vcW(teamAvgW), teams, vcW(pitsAverage)],
  ]);
  html += vcTable(['Event total', 'Watts'], [
    { cells: ['Provisioned capacity', `<strong>${vcW(totalConnected)}</strong>`], cls: 'vc-total' },
    { cells: ['Expected draw', `<strong>${vcW(totalAverage)}</strong>`], cls: 'vc-total' },
  ]);
  vcSum('Power provisioned', vcW(totalConnected), true);
  vcSum('Power expected draw', vcW(totalAverage), true);

  // --- Circuits ---------------------------------------------------------

  // A team's drop is provisioned at its full rating, so pack whole teams into
  // a circuit rather than dividing the aggregate — a circuit that can carry
  // 1.9 team drops still only gets one team.
  const teamsPerCircuit = teamDropW > 0 ? Math.floor(circuitW / teamDropW) : teams;
  const pitsCircuits = teamsPerCircuit >= 1
    ? Math.ceil(teams / teamsPerCircuit)
    : teams * Math.ceil(teamDropW / circuitW);
  const streamCircuits = streamingCount > 0 ? Math.ceil(streamingConnected / circuitW) : 0;

  html += vcHead('Circuits');
  html += vcTable(['Circuits', 'Floor', 'Truss', 'Total'], fieldCircuitRows.concat([
    streamCircuits > 0 ? ['Streaming', streamCircuits, '', streamCircuits] : null,
    teamsPerCircuit >= 1
      ? [`Pits, ${teamsPerCircuit} team${teamsPerCircuit === 1 ? '' : 's'} per circuit`,
         pitsCircuits, '', pitsCircuits]
      : { cells: [`Pits, ${Math.ceil(teamDropW / circuitW)} circuits per team drop`,
                  pitsCircuits, '', pitsCircuits], cls: 'vc-warn' },
    { cells: ['Total', '', '', `<strong>${pitsCircuits + fieldCircuits + streamCircuits}</strong>`],
      cls: 'vc-total' },
  ]));
  vcSum('Circuits', `${pitsCircuits + fieldCircuits + streamCircuits} at `
    + `${voltage} V / ${amps} A`, true);
  html += vcNote(`Usable per circuit: ${vcW(circuitW)} `
    + `(${voltage} V &times; ${amps} A &times; ${(derate * 100).toFixed(0)}%). Fields are counted separately `
    + `from each other, and truss outlets separately from floor ones, since neither can share a breaker.`);

  // --- Outlets ----------------------------------------------------------

  // One outlet per table per Competition Field; teams get one drop per
  // cluster per Venue Requirements and bring their own power strip.
  const pitsOutlets = teams + organizerTables;
  let fieldGroundOutlets = 0;
  let trussOutlets = 0;
  const outletRows = [];
  activeGroups.forEach(function (g) {
    // One outlet per table, plus one for the switch and router between them.
    let n = vcFieldTables(g).total + 1;
    // One per status board whether or not it's on PoE: PoE powers the little
    // computer, never the display hanging off it.
    n += vcStatusBoards(g);
    if (vcHasAudio(g)) n += 1;
    if (wLighting > 0) n += 1;
    // The streaming rig sits at the field it covers, so its outlet is floor
    // level at that field rather than an event-wide extra.
    if (vcHasStream(g)) n += 1;
    fieldGroundOutlets += n * g.n;
    trussOutlets += g.cfg.nucs * g.n;
    outletRows.push([`${g.label} &times; ${g.n}`, n, g.cfg.nucs, (n + g.cfg.nucs) * g.n]);
  });

  const totalOutlets = pitsOutlets + fieldGroundOutlets + trussOutlets;

  html += vcHead('Outlets');
  html += vcTable(['Outlets', 'Floor, each', 'Truss, each', 'Total'], outletRows.concat([
    { cells: ['Field floor', '', '', fieldGroundOutlets], cls: 'vc-subtotal' },
    { cells: ['Field truss', '', '', trussOutlets], cls: 'vc-subtotal' },
    { cells: ['Pits floor', '', '', pitsOutlets], cls: 'vc-subtotal' },
    { cells: ['Total', '', '', `<strong>${totalOutlets}</strong>`], cls: 'vc-total' },
  ]));
  vcSum('Outlets', `${totalOutlets} (${fieldGroundOutlets} field floor, ${trussOutlets} field truss, `
    + `${pitsOutlets} pits floor)`, true);
  if (trussOutlets > 0) {
    html += vcNote('Field truss outlets are one per truss NUC, at mounting height. Price them with the rigging '
      + 'rather than as floor drops.', true);
  }

  // --- Network ----------------------------------------------------------

  const spare = 1 + vcNum('vc-adv-spare-ports') / 100;
  const networkRows = [];
  let totalSwitchPorts = 0;
  let totalSwitches = 0;
  let totalPoeW = 0;
  let hostAdapterPoeW = 0;

  activeGroups.forEach(function (g) {
    // Cameras never land on the field switch. In the truss config they hang
    // off their NUC; in the direct config they hang off the vision computer's
    // PoE host adapter. Either way the switch sees one port per NUC, or none.
    let ports = g.cfg.nucs;
    ports += 2; // vision computer, game controller computer
    ports += vcRemotes(g);
    ports += vcStatusBoards(g);
    ports += vcFieldTables(g).team;
    ports += vcHasAudio(g) ? 1 : 0;
    ports += vcHasStream(g) ? 1 : 0;
    ports += 1; // router / venue uplink
    const sized = Math.ceil(ports * spare);
    totalSwitchPorts += ports * g.n;

    const switchPoe = vcRemotes(g) * poeRemoteW + (poeStatus ? vcStatusBoards(g) * poeStatusW : 0);
    totalPoeW += switchPoe * g.n;
    if (g.cfg.direct) hostAdapterPoeW += g.cfg.cameras * poeCameraW * g.n;

    const switches = vcSwitchCount(sized);
    totalSwitches += switches * g.n;
    networkRows.push({
      cells: [
        `${g.label} &times; ${g.n}`,
        ports,
        VC_FIELD_SWITCH_PORTS * switches - ports,
        switches > 1 ? `${switches} &times; ${VC_FIELD_SWITCH_PORTS}-port` : `${VC_FIELD_SWITCH_PORTS}-port`,
        vcW(switchPoe),
      ],
      cls: switches > 1 ? 'vc-warn' : '',
    });
  });

  const pitsDropsPerTeam = vcInt('vc-pits-drops');
  const pitsDrops = teams * pitsDropsPerTeam;
  const internetDrops = vcInt('vc-adv-internet-drops');
  const venueDrops = totalFields + pitsDrops + organizerTables + internetDrops;

  html += vcHead('Network');
  html += vcTable(['Field switches', 'Ports used', 'Spare', 'Buy', 'PoE budget'],
    networkRows.concat([
      { cells: ['All fields', totalSwitchPorts, '', '', vcW(totalPoeW)], cls: 'vc-subtotal' },
    ]));
  if (hostAdapterPoeW > 0) {
    html += vcNote(`A further ${vcW(hostAdapterPoeW)} of PoE comes from the vision `
      + `computers' host adapters, for direct wired cameras, rather than from the field switches.`);
  }
  html += vcTable(['Venue-provided drops', 'Each', 'Count'], [
    ['Field uplinks', '1 per field', totalFields],
    ['Pits', `${pitsDropsPerTeam} per team`, pitsDrops],
    ['Organizer tables', '1 per table', organizerTables],
    ['Internet', '', internetDrops],
    { cells: ['Total', '', `<strong>${venueDrops}</strong>`], cls: 'vc-total' },
  ]);

  // One VLAN per field is the isolation boundary the league needs: multicast
  // and broadcast from one field must never reach another. The pits VLAN
  // carries no league traffic, so it's a convenience rather than a requirement.
  const pitsVlan = pitsDropsPerTeam > 0 ? 1 : 0;

  function vcVlanRow(label, octet) {
    return {
      cells: [
        label,
        octet,
        `10.${octet}.0.0/16`,
        `10.${octet}.0.1`,
        `10.${octet}.0.${VC_MGMT_RESERVED_TO + 1} to 10.${octet}.255.249`,
      ],
      cls: octet > 250 ? 'vc-warn' : '',
    };
  }

  let fieldIndex = 0;
  const vlanRows = [];
  activeGroups.forEach(function (g) {
    for (let i = 1; i <= g.n; i += 1) {
      fieldIndex += 1;
      vlanRows.push(vcVlanRow(g.n > 1 ? `${g.label} ${i}` : g.label, VC_VLAN_STEP * fieldIndex));
    }
  });
  if (pitsVlan > 0) vlanRows.push(vcVlanRow('Pits (optional)', VC_PITS_VLAN));

  html += vcTable(['VLANs', 'VLAN', 'Subnet', 'Gateway', 'DHCP pool'], vlanRows.concat([
    { cells: ['Total', `<strong>${totalFields + pitsVlan}</strong>`, '', '', ''], cls: 'vc-total' },
  ]));
  html += vcNote(
    `VLAN id matches the second octet, so an address says which field it is. Per field: .0.1 gateway, `
      + `.0.2 through .0.${VC_MGMT_RESERVED_TO} reserved for fixed addresses, .255.255 broadcast, IPv4 only.`
  );
  if (VC_VLAN_STEP * fieldIndex > 250) {
    html += vcNote(
      'Past 25 fields this numbering runs out of second octet, so renumber by hand from there.', true
    );
  }
  html += vcNote(
    'One per field is required, since vision and referee multicast must not cross fields. '
      + (pitsVlan > 0
          ? 'The pits VLAN is optional; ask for it anyway.'
          : 'No pits VLAN: the pits have no wired drops.')
  );

  vcSum('Network drops from the venue', `${venueDrops}`, true);
  vcSum('Field switches', `${totalSwitches} at ${VC_FIELD_SWITCH_PORTS} ports`, true);
  vcSum('VLANs', `${totalFields + pitsVlan}`);

  document.getElementById('vc-output').innerHTML = html;
  vcSetExportsEnabled(true);
}

// Results go stale the moment any input moves, so the tables are cleared and
// the exports switched off rather than left showing numbers that no longer
// match the form.
function vcSetExportsEnabled(enabled) {
  ['vc-download', 'vc-download-md', 'vc-copy'].forEach(function (id) {
    document.getElementById(id).disabled = !enabled;
  });
}

function vcInvalidate() {
  if (vcReport.length === 0) return;
  vcReport = [];
  vcSummary = [];
  document.getElementById('vc-output').innerHTML =
    '<p class="venue-calc-stale">Inputs changed. Press Calculate to update the results.</p>';
  vcSetExportsEnabled(false);
}

const vcRoot = document.querySelector('.venue-calc');
if (vcRoot) {
  ['input', 'change'].forEach(function (evt) {
    vcRoot.addEventListener(evt, vcInvalidate);
  });
}

document.getElementById('vc-calc').addEventListener('click', vcCalculate);

// --- Scenarios -----------------------------------------------------------

// Whole-form starting points. Everything not listed here is whatever the
// section defaults already are, since applying a scenario resets the form
// first — except mains voltage and breaker rating, which follow the country
// the venue is in rather than the size of the event.
const VC_SCENARIOS = {
  international: { teamsA: 8, membersA: 12, teamsB: 12, membersB: 7 },
  'regional-a': { teamsA: 4, membersA: 12, teamsB: 0, membersB: 7 },
  'regional-b': { teamsA: 0, membersA: 12, teamsB: 4, membersB: 7 },
};

const VC_SCENARIO_BASE = { organizerTables: 2, bufferM: 1.5, pitsDropsPerTeam: 1 };

function vcCheckRadio(name, value) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(function (radio) {
    radio.checked = radio.value === value;
  });
}

function vcApplyScenario(key) {
  const scenario = VC_SCENARIOS[key];
  if (!scenario) return;

  Object.keys(VC_ADVANCED_GROUPS).forEach(vcRestoreAdvanced);
  vcRestoreFieldEquipment();
  vcCheckRadio('vc-team-mode', 'average');
  vcCheckRadio('vc-field-mode', 'derive');

  document.getElementById('vc-teams-a').value = scenario.teamsA;
  document.getElementById('vc-members-a').value = scenario.membersA;
  document.getElementById('vc-teams-b').value = scenario.teamsB;
  document.getElementById('vc-members-b').value = scenario.membersB;
  document.getElementById('vc-organizer-tables').value = VC_SCENARIO_BASE.organizerTables;
  document.getElementById('vc-buffer').value = VC_SCENARIO_BASE.bufferM;
  document.getElementById('vc-pits-drops').value = VC_SCENARIO_BASE.pitsDropsPerTeam;

  vcSyncTeamMode();
  vcSyncFieldMode();
  vcCalculate();
}

document.querySelectorAll('[data-vc-scenario]').forEach(function (button) {
  button.addEventListener('click', function () {
    vcApplyScenario(button.getAttribute('data-vc-scenario'));
  });
});

// --- CSV download --------------------------------------------------------

// Cells are built for HTML, so strip markup and turn the handful of entities
// the report uses back into plain characters before they reach a spreadsheet.
const VC_ENTITIES = {
  '&times;': 'x', '&sup2;': '2', '&mdash;': '-', '&ndash;': '-',
  '&rarr;': '->', '&lceil;': '', '&rceil;': '', '&amp;': '&', '&nbsp;': ' ',
};

function vcPlain(cell) {
  let text = String(cell === null || cell === undefined ? '' : cell)
    .replace(/<[^>]+>/g, '');
  Object.keys(VC_ENTITIES).forEach(function (ent) {
    text = text.split(ent).join(VC_ENTITIES[ent]);
  });
  return text.replace(/\s+/g, ' ').trim();
}

function vcCsvCell(value) {
  const text = vcPlain(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function vcReportToCsv() {
  const lines = [
    ['SSL Venue Requirements Calculator'],
    ['Generated', new Date().toISOString().slice(0, 10)],
  ].map(r => r.map(vcCsvCell).join(','));

  vcReport.forEach(function (entry) {
    if (entry.type === 'head') {
      lines.push('');
      lines.push(vcCsvCell(entry.text));
      return;
    }
    if (entry.type === 'note') {
      lines.push(vcCsvCell(`Note: ${entry.text}`));
      return;
    }
    lines.push(entry.headers.map(vcCsvCell).join(','));
    entry.rows.forEach(row => lines.push(row.map(vcCsvCell).join(',')));
  });
  return lines.join('\r\n');
}

function vcSummaryToMarkdown() {
  const lines = [
    '# SSL Venue Requirements',
    '',
    `Generated ${new Date().toISOString().slice(0, 10)} by the SSL Venue Requirements Calculator.`,
    '',
  ];
  vcSummary.forEach(function (entry) {
    lines.push(`- **${vcPlain(entry.label)}:** ${vcPlain(entry.value)}${entry.estimated ? ' (est.)' : ''}`);
  });
  lines.push('');
  lines.push('Lines marked (est.) rest on assumptions this calculator makes rather than on a published league');
  lines.push('requirement. Everything else follows from figures the league documents or from what you entered.');
  lines.push('');
  lines.push('Planning figures for a venue conversation, not an electrical design. Have an electrician or the');
  lines.push("venue's own facilities team confirm circuit counts and layout.");
  return lines.join('\n');
}

function vcSaveFile(text, filename, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function vcStamp() {
  return new Date().toISOString().slice(0, 10);
}

document.getElementById('vc-download-md').addEventListener('click', function () {
  if (vcSummary.length === 0) return;
  vcSaveFile(vcSummaryToMarkdown(), `ssl-venue-summary-${vcStamp()}.md`, 'text/markdown;charset=utf-8;');
});

document.getElementById('vc-copy').addEventListener('click', function () {
  if (vcSummary.length === 0) return;
  const button = this;
  const restore = function (message) {
    const original = button.textContent;
    button.textContent = message;
    setTimeout(function () { button.textContent = original; }, 1500);
  };
  // The clipboard API needs a secure context, so a docs build opened over
  // file:// will reject. Say so rather than failing silently.
  if (!navigator.clipboard) {
    restore('Copy unavailable');
    return;
  }
  navigator.clipboard.writeText(vcSummaryToMarkdown())
    .then(function () { restore('Copied'); })
    .catch(function () { restore('Copy failed'); });
});

document.getElementById('vc-download').addEventListener('click', function () {
  if (vcReport.length === 0) return;
  // The BOM is what makes Excel read the file as UTF-8 rather than latin-1.
  vcSaveFile('\uFEFF' + vcReportToCsv(), `ssl-venue-plan-${vcStamp()}.csv`, 'text/csv;charset=utf-8;');
});

}
