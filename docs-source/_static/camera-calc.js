// Loaded site-wide via html_js_files; no-op on pages without the calculator.
if (document.getElementById('cc-calc')) {

function ccSensorMode() {
  return document.querySelector('input[name="cc-sensor-mode"]:checked').value;
}

function ccCameraCount() {
  return parseInt(document.querySelector('input[name="cc-n"]:checked').value, 10);
}

function ccLensMode() {
  return document.querySelector('input[name="cc-lens-mode"]:checked').value;
}

function ccMarkerMode() {
  return document.querySelector('input[name="cc-marker-mode"]:checked').value;
}

function ccLoadFieldPreset(w, h) {
  document.getElementById('cc-tw').value = w;
  document.getElementById('cc-th').value = h;
}

// Field dimensions per the SSL Rules (Field Surface, Substitution Areas):
// playing area, plus the field margin out to the walls (0.3 m along the
// touch lines; behind the goal lines 0.6 m in Div A, 0.3 m in Div B). Div A's
// extra 0.3 m behind each goal line is the Goal Substitution Area; the Center
// Substitution Area sits inside the 0.3 m margin either way, so excluding the
// exchange area only changes Div A. The carpet runs 0.7 m past the field lines
// on all sides, outside the walls, for the referee walkway.
const CC_FIELDS = {
  a: { length: 12000, width: 9000, goalMargin: 600 },
  b: { length: 9000, width: 6000, goalMargin: 300 },
};

function ccFieldArea() {
  return document.querySelector('input[name="cc-area"]:checked').value;
}

function ccFieldPreset(div) {
  const field = CC_FIELDS[div];
  const area = ccFieldArea();
  if (area === 'carpet') {
    return [field.length + 2 * 700, field.width + 2 * 700];
  }
  const goalMargin = area === 'exchange' ? field.goalMargin : 300;
  return [field.length + 2 * goalMargin, field.width + 2 * 300];
}

function ccUpdatePresetLabels() {
  ['a', 'b'].forEach(function (div) {
    const [w, h] = ccFieldPreset(div);
    document.getElementById('cc-preset-' + div).innerHTML =
      `Load Division ${div.toUpperCase()} (${w} &times; ${h} mm)`;
  });
}

document.querySelectorAll('input[name="cc-area"]').forEach(function (radio) {
  radio.addEventListener('change', ccUpdatePresetLabels);
});

// Same refresh-restores-radios issue as the other radio groups.
ccUpdatePresetLabels();

['a', 'b'].forEach(function (div) {
  document.getElementById('cc-preset-' + div).addEventListener('click', function () {
    ccLoadFieldPreset(...ccFieldPreset(div));
  });
});

function ccUpdateDerivedSensorSize() {
  if (ccSensorMode() !== 'pixel') return;
  const rh = parseFloat(document.getElementById('cc-rh').value);
  const rv = parseFloat(document.getElementById('cc-rv').value);
  const px = parseFloat(document.getElementById('cc-px').value) / 1000; // µm -> mm
  if (isNaN(rh) || isNaN(rv) || isNaN(px)) return;
  document.getElementById('cc-sh').value = (rh * px).toFixed(3);
  document.getElementById('cc-sv').value = (rv * px).toFixed(3);
}

function ccUpdateDerivedPixelSize() {
  if (ccSensorMode() !== 'size') return;
  const rh = parseFloat(document.getElementById('cc-rh').value);
  const rv = parseFloat(document.getElementById('cc-rv').value);
  const sh = parseFloat(document.getElementById('cc-sh').value);
  const sv = parseFloat(document.getElementById('cc-sv').value);
  if (isNaN(rh) || isNaN(rv) || isNaN(sh) || isNaN(sv) || rh === 0 || rv === 0) return;
  // average of the two axes' implied pitch, since pixel size here assumes square pixels
  const pxMm = ((sh / rh) + (sv / rv)) / 2;
  document.getElementById('cc-px').value = (pxMm * 1000).toFixed(3); // mm -> µm
}

function ccUpdateDerivedFields() {
  ccUpdateDerivedSensorSize();
  ccUpdateDerivedPixelSize();
}

function ccSyncSensorModeDisabled() {
  const isPixel = ccSensorMode() === 'pixel';
  document.getElementById('cc-sh').disabled = isPixel;
  document.getElementById('cc-sv').disabled = isPixel;
  document.getElementById('cc-px').disabled = !isPixel;
}

document.querySelectorAll('input[name="cc-sensor-mode"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    ccSyncSensorModeDisabled();
    ccUpdateDerivedFields();
  });
});

['cc-px', 'cc-sh', 'cc-sv', 'cc-rh', 'cc-rv'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', ccUpdateDerivedFields);
});

// Browsers restore previously-checked radios on a plain page refresh, which
// doesn't fire 'change' — resync disabled state to whatever's actually
// checked now, not just the HTML's hardcoded default.
ccSyncSensorModeDisabled();
ccUpdateDerivedFields();

function ccUpdateDerivedVarifocalRange() {
  if (ccLensMode() !== 'focal') return;
  const f = parseFloat(document.getElementById('cc-f').value);
  if (isNaN(f)) return;
  document.getElementById('cc-f-min').value = f;
  document.getElementById('cc-f-max').value = f;
}

function ccUpdateDerivedFixedFocal() {
  if (ccLensMode() !== 'varifocal') return;
  const fMin = parseFloat(document.getElementById('cc-f-min').value);
  const fMax = parseFloat(document.getElementById('cc-f-max').value);
  if (isNaN(fMin) || isNaN(fMax)) return;
  document.getElementById('cc-f').value = ((fMin + fMax) / 2).toFixed(2);
}

function ccUpdateDerivedLensFields() {
  ccUpdateDerivedVarifocalRange();
  ccUpdateDerivedFixedFocal();
}

function ccSyncLensModeDisabled() {
  const mode = ccLensMode();
  document.getElementById('cc-f').disabled = mode !== 'focal';
  document.getElementById('cc-f-min').disabled = mode !== 'varifocal';
  document.getElementById('cc-f-max').disabled = mode !== 'varifocal';
  document.getElementById('cc-fov-d').disabled = mode !== 'fov';
  document.getElementById('cc-valid-range-note').hidden = mode !== 'fov';
}

document.querySelectorAll('input[name="cc-lens-mode"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    ccSyncLensModeDisabled();
    ccUpdateDerivedLensFields();
  });
});

['cc-f', 'cc-f-min', 'cc-f-max'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', ccUpdateDerivedLensFields);
});

// Same refresh-restores-radios issue as sensor mode above.
ccSyncLensModeDisabled();
ccUpdateDerivedLensFields();

function ccSyncMarkerModeDisabled() {
  const isLeague = ccMarkerMode() === 'league';
  document.getElementById('cc-d').disabled = isLeague;
  document.getElementById('cc-nmin').disabled = isLeague;
}

document.querySelectorAll('input[name="cc-marker-mode"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    ccSyncMarkerModeDisabled();
    if (ccMarkerMode() === 'league') {
      document.getElementById('cc-d').value = 40;
      document.getElementById('cc-nmin').value = 6;
    }
  });
});

// Resync disabled state on load too (see comments above) — deliberately
// doesn't reset values here, only on an actual user click, so a
// browser-restored "custom" selection keeps its restored values.
ccSyncMarkerModeDisabled();

// League camera and lens, per Cameras and Lenses' Known Good Configurations.
document.getElementById('cc-preset-league').addEventListener('click', function () {
  document.querySelector('input[name="cc-sensor-mode"][value="size"]').checked = true;
  document.querySelector('input[name="cc-lens-mode"][value="focal"]').checked = true;
  document.getElementById('cc-rh').value = 2448;
  document.getElementById('cc-rv').value = 2048;
  document.getElementById('cc-sh').value = 8.45;
  document.getElementById('cc-sv').value = 7.07;
  document.getElementById('cc-f').value = 5;
  ccSyncSensorModeDisabled();
  ccUpdateDerivedFields();
  ccSyncLensModeDisabled();
  ccUpdateDerivedLensFields();
});

function ccWHFromFocal(h, f, sh, sv) {
  return [(h * sh) / f, (h * sv) / f];
}

function ccWHFromDiagonalFov(h, fovD, aspect) {
  // aspect = W/H, taken from the resolution's aspect ratio (Rh/Rv).
  const toRad = deg => (deg * Math.PI) / 180;
  const diag = 2 * h * Math.tan(toRad(fovD) / 2);
  const H = diag / Math.sqrt(aspect * aspect + 1);
  const W = aspect * H;
  return [W, H];
}

// Max robot height per the SSL Rules (robot must fit in a 0.15 m high
// cylinder); coverage is checked at this plane.
const CC_ROBOT_HEIGHT = 150;

function ccTileFit(kW, kH, tileW, tileH) {
  // kW, kH: footprint per mm of camera distance above the coverage plane
  // (W/h, H/h). Footprint grows linearly with distance, so each axis needs
  // distance >= tile / k; the binding axis sets the minimum. Try the sensor
  // both ways round, since a camera can be mounted rotated 90° to better
  // match a tile whose aspect ratio differs from the sensor's.
  const straight = Math.max(tileW / kW, tileH / kH);
  const rotated = Math.max(tileW / kH, tileH / kW);
  if (rotated < straight) {
    return { rotated: true, dist: rotated, limitedBy: tileW / kH >= tileH / kW ? 'width' : 'height' };
  }
  return { rotated: false, dist: straight, limitedBy: tileW / kW >= tileH / kH ? 'width' : 'height' };
}

function ccComputeFromWH(h, W, H, rh, rv, d, nMin, tw, th, n) {
  const toDeg = r => (r * 180) / Math.PI;
  const fovH = 2 * toDeg(Math.atan(W / (2 * h)));
  const fovV = 2 * toDeg(Math.atan(H / (2 * h)));
  // Density is evaluated at the ground plane (balls), where it's worst.
  const rho = Math.min(rh / W, rv / H);
  const pxAcross = rho * d;
  const passes = pxAcross >= nMin;

  const result = { fovH, fovV, W, H, rho, pxAcross, passes };
  if (!isNaN(tw) && !isNaN(th) && tw > 0 && th > 0) {
    // Coverage is evaluated at the robot-top plane, where the footprint is
    // smallest, so markers on robots against the wall are still in frame.
    const [tileW, tileH] = ccPerCameraTarget(n, tw, th);
    const fit = ccTileFit(W / h, H / h, tileW, tileH);
    const scale = (h - CC_ROBOT_HEIGHT) / h;
    const [alongW, alongH] = fit.rotated ? [H * scale, W * scale] : [W * scale, H * scale];
    result.tile = { tileW, tileH, alongW, alongH, rotated: fit.rotated, limitedBy: fit.limitedBy };
    result.minMount = CC_ROBOT_HEIGHT + fit.dist;
    result.coverageOk = h >= result.minMount;
    result.areaRatio = (n * W * H) / (tw * th) * 100;
  }
  return result;
}

function ccCompute(h, f, sh, sv, rh, rv, d, nMin, tw, th, n) {
  const [W, H] = ccWHFromFocal(h, f, sh, sv);
  return ccComputeFromWH(h, W, H, rh, rv, d, nMin, tw, th, n);
}

function ccComputeDiagonalFov(h, fovD, rh, rv, d, nMin, tw, th, n) {
  const [W, H] = ccWHFromDiagonalFov(h, fovD, rh / rv);
  return ccComputeFromWH(h, W, H, rh, rv, d, nMin, tw, th, n);
}

function ccPerCameraTarget(n, tw, th) {
  // 1 camera: full field. 2: split the longer axis in half (half field).
  // 4: split both axes in half (quadrants). Matches the convention used
  // throughout the Cameras and Lenses worked examples.
  if (n === 2) return tw >= th ? [tw / 2, th] : [tw, th / 2];
  if (n === 4) return [tw / 2, th / 2];
  return [tw, th];
}

function ccValidFocalRange(h, sh, sv, rh, rv, d, nMin, targetW, targetH) {
  // Coverage needs W(f) >= targetW and H(f) >= targetH at the robot-top
  // plane, in whichever sensor orientation fits better; since W,H shrink as
  // f grows, this caps f from above.
  const fMaxCoverage = (h - CC_ROBOT_HEIGHT) * Math.max(Math.min(sh / targetW, sv / targetH),
                                          Math.min(sh / targetH, sv / targetW));
  // Density needs rho(f) >= nMin/d; since rho grows as f grows, this bounds
  // f from below.
  const fMinDensity = Math.max((nMin * h * sh) / (d * rh), (nMin * h * sv) / (d * rv));
  return { fMinDensity, fMaxCoverage, feasible: fMinDensity <= fMaxCoverage };
}

function ccRenderValidRange(range, n) {
  let html = '<dt>Valid Focal Length Range</dt>';
  if (range.feasible) {
    html += `<dd class="cc-pass">${range.fMinDensity.toFixed(2)}–${range.fMaxCoverage.toFixed(2)} mm `
          + `&mdash; any lens in this range covers its assigned tile (of ${n}) and meets pixel density</dd>`;
  } else {
    html += `<dd class="cc-fail">None &mdash; coverage needs f &le; ${range.fMaxCoverage.toFixed(2)} mm, but density `
          + `needs f &ge; ${range.fMinDensity.toFixed(2)} mm. No single focal length satisfies both; you need a `
          + `wider sensor, higher resolution, lower mount, or more cameras.</dd>`;
  }
  return html;
}

function ccRenderResult(r, nMin) {
  let html = '';
  html += `<dt>Field of View</dt><dd>${r.fovH.toFixed(1)}° &times; ${r.fovV.toFixed(1)}°</dd>`;
  html += `<dt>Ground Coverage</dt><dd>${r.W.toFixed(0)} &times; ${r.H.toFixed(0)} mm</dd>`;
  html += `<dt>Pixel Density</dt><dd>${r.rho.toFixed(4)} px/mm</dd>`;
  html += `<dt>Pixels Across Marker</dt><dd class="${r.passes ? 'cc-pass' : 'cc-fail'}">${r.pxAcross.toFixed(1)} px `
        + `(need &ge; ${nMin}) &mdash; ${r.passes ? 'PASS' : 'FAIL'}</dd>`;
  if (r.tile !== undefined) {
    const t = r.tile;
    html += `<dt>Per-Camera Tile</dt><dd>${t.tileW.toFixed(0)} &times; ${t.tileH.toFixed(0)} mm, `
          + `${t.rotated ? 'sensor rotated 90° (sensor width along field height)' : 'sensor width along field width'}</dd>`;
    html += `<dt>Tile Coverage (at robot tops)</dt><dd class="${r.coverageOk ? 'cc-pass' : 'cc-fail'}">`
          + `${t.alongW.toFixed(0)} &times; ${t.alongH.toFixed(0)} mm vs. tile `
          + `(${(t.alongW - t.tileW).toFixed(0)} / ${(t.alongH - t.tileH).toFixed(0)} mm slack) &mdash; `
          + `${r.coverageOk ? 'PASS' : 'FAIL'}</dd>`;
    html += `<dt>Minimum Mount Height</dt><dd class="${r.coverageOk ? 'cc-pass' : 'cc-fail'}">`
          + `${r.minMount.toFixed(0)} mm &mdash; limited by tile ${t.limitedBy}, no overlap between tiles</dd>`;
    html += `<dt>Area Ratio</dt><dd>${r.areaRatio.toFixed(0)}% &mdash; necessary, not sufficient; ignores aspect `
          + `ratio and tiling, use Tile Coverage above for pass/fail</dd>`;
  }
  return html;
}

document.getElementById('cc-calc').addEventListener('click', function () {
  const num = id => parseFloat(document.getElementById(id).value);
  const h = num('cc-h');
  const rh = num('cc-rh'), rv = num('cc-rv'), d = num('cc-d'), nMin = num('cc-nmin');
  const tw = num('cc-tw'), th = num('cc-th'), n = ccCameraCount();
  const sh = num('cc-sh'), sv = num('cc-sv');
  const lensMode = ccLensMode();

  let html = '';

  const haveTarget = !isNaN(tw) && !isNaN(th) && tw > 0 && th > 0;
  let range = null;
  if (haveTarget && lensMode !== 'fov') {
    const [targetW, targetH] = ccPerCameraTarget(n, tw, th);
    range = ccValidFocalRange(h, sh, sv, rh, rv, d, nMin, targetW, targetH);
    html += ccRenderValidRange(range, n);
  }

  if (lensMode === 'fov') {
    const r = ccComputeDiagonalFov(h, num('cc-fov-d'), rh, rv, d, nMin, tw, th, n);
    html += ccRenderResult(r, nMin);
  } else if (lensMode === 'focal') {
    const r = ccCompute(h, num('cc-f'), sh, sv, rh, rv, d, nMin, tw, th, n);
    html += ccRenderResult(r, nMin);
  } else {
    const fMin = num('cc-f-min'), fMax = num('cc-f-max');
    const rWide = ccCompute(h, fMin, sh, sv, rh, rv, d, nMin, tw, th, n);
    const rNarrow = ccCompute(h, fMax, sh, sv, rh, rv, d, nMin, tw, th, n);
    html += `<dt class="cc-subhead">At widest (${fMin} mm)</dt><dd></dd>`;
    html += ccRenderResult(rWide, nMin);
    html += `<dt class="cc-subhead">At narrowest (${fMax} mm)</dt><dd></dd>`;
    html += ccRenderResult(rNarrow, nMin);

    if (range) {
      const usableMin = Math.max(range.fMinDensity, fMin);
      const usableMax = Math.min(range.fMaxCoverage, fMax);
      html += '<dt class="cc-subhead">Usable dial range on this lens</dt><dd></dd>';
      if (usableMin <= usableMax) {
        html += `<dt>Dial to</dt><dd class="cc-pass">${usableMin.toFixed(2)}–${usableMax.toFixed(2)} mm on this `
              + `lens works</dd>`;
      } else {
        html += `<dt>Dial to</dt><dd class="cc-fail">No setting on this lens's ${fMin}–${fMax} mm range works `
              + `&mdash; see Valid Focal Length Range above for what would</dd>`;
      }
    }
  }

  document.getElementById('cc-output').innerHTML = html;
});

}
