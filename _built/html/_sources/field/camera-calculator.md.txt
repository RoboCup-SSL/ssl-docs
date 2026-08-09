# Camera Field of View Calculator

Helps sanity check a given camera configuration for a desired field size.

Enter numbers instead of doing the arithmetic in
[Steps 1-5 of Cameras and Lenses](cameras.md#calculating-major-factors-for-your-lab) by hand.

<div class="camera-calc">
  <fieldset class="camera-calc-group">
    <legend>Physical Space</legend>
    <div class="camera-calc-grid">
      <label><span>Mounting height <span class="math notranslate nohighlight">\(h\)</span> (mm)</span><input type="number" id="cc-h" value="6000"></label>
      <label><span>Field width (mm, optional)</span><input type="number" id="cc-tw"></label>
      <label><span>Field height (mm, optional)</span><input type="number" id="cc-th"></label>
    </div>
    <div class="camera-calc-radio">
      <button type="button" class="camera-calc-preset" id="cc-preset-a">Load Division A (13400 &times; 10400 mm)</button>
      <button type="button" class="camera-calc-preset" id="cc-preset-b">Load Division B (10400 &times; 7400 mm)</button>
    </div>
    <p class="camera-calc-note">Use the full area the cameras need to see, not just the field lines — include the
    surrounding margin (see the <a href="https://robocup-ssl.github.io/ssl-rules/sslrules.html#_dimensions">SSL
    Rules</a>). The preset buttons above load the field of play size including that margin, per the SSL Rules.</p>
    <div class="camera-calc-radio">
      <label><input type="radio" name="cc-n" value="1" checked> 1 camera (full coverage)</label>
      <label><input type="radio" name="cc-n" value="2"> 2 cameras (half field)</label>
      <label><input type="radio" name="cc-n" value="4"> 4 cameras (quadrants)</label>
    </div>
    <p class="camera-calc-note">Other camera counts aren't supported by the league vision software.</p>
  </fieldset>

<fieldset class="camera-calc-group">
    <legend>Camera Parameters</legend>
    <div class="camera-calc-grid">
      <label><span>Resolution width <span class="math notranslate nohighlight">\(R_h\)</span> (px)</span><input type="number" id="cc-rh" value="2448"></label>
      <label><span>Resolution height <span class="math notranslate nohighlight">\(R_v\)</span> (px)</span><input type="number" id="cc-rv" value="2048"></label>
    </div>
    <div class="camera-calc-radio">
      <label><input type="radio" name="cc-sensor-mode" value="size" checked> Specify sensor size</label>
      <label><input type="radio" name="cc-sensor-mode" value="pixel"> Specify pixel size</label>
    </div>
    <div class="camera-calc-grid">
      <label><span>Sensor width <span class="math notranslate nohighlight">\(s_h\)</span> (mm)</span><input type="number" id="cc-sh" value="8.45"></label>
      <label><span>Sensor height <span class="math notranslate nohighlight">\(s_v\)</span> (mm)</span><input type="number" id="cc-sv" value="7.07"></label>
    </div>
    <div class="camera-calc-grid">
      <label><span>Pixel size (µm, assumes square pixels)</span><input type="number" id="cc-px" value="3.45" disabled></label>
    </div>
    <p class="camera-calc-note">One of sensor size or pixel size is computed from the other and resolution, based on
    the mode selected above — the greyed-out field isn't editable while its value is derived.</p>
  </fieldset>

<fieldset class="camera-calc-group">
    <legend>Lens Parameters</legend>
    <div class="camera-calc-radio">
      <label><input type="radio" name="cc-lens-mode" value="focal" checked> Fixed focal length</label>
      <label><input type="radio" name="cc-lens-mode" value="varifocal"> Varifocal (zoom range)</label>
      <label><input type="radio" name="cc-lens-mode" value="fov"> Field of view</label>
    </div>
    <p class="camera-calc-note">Webcam spec sheets often publish a single diagonal field of view instead of focal
    length. Horizontal/vertical split is derived from the resolution's aspect ratio above. Field of view mode only
    supports a fixed lens; the greyed-out fields below aren't editable until you pick the mode that uses them.</p>

<div class="camera-calc-grid">
      <label><span>Focal length <span class="math notranslate nohighlight">\(f\)</span> (mm)</span><input type="number" id="cc-f" value="5"></label>
    </div>
    <div class="camera-calc-grid">
      <label><span>Widest focal length (mm)</span><input type="number" id="cc-f-min" value="3.9" disabled></label>
      <label><span>Narrowest focal length (mm)</span><input type="number" id="cc-f-max" value="10" disabled></label>
    </div>
    <div class="camera-calc-grid">
      <label><span>Diagonal FoV (deg)</span><input type="number" id="cc-fov-d" value="78" disabled></label>
    </div>
    <p class="camera-calc-note">Fixed mode mirrors the single focal length into both ends of the varifocal range.
    Varifocal mode derives the greyed-out focal length as the range's midpoint — a display convenience, not a real
    setting; results are computed at both actual ends of the range. An unmarked dial has no fixed setting in
    between; see <a href="cameras.html#peachtree-open-cameras-and-lenses-division-b">Peachtree Open</a> for how to
    reason about the range when the dial can't be read directly.</p>
    <p class="camera-calc-note" id="cc-valid-range-note" hidden>Valid Focal Length Range (below) only applies in
    focal length mode — there's no single focal length to solve for once you've specified FoV directly.</p>
  </fieldset>

<fieldset class="camera-calc-group">
    <legend>Marker Detection</legend>
    <div class="camera-calc-radio">
      <label><input type="radio" name="cc-marker-mode" value="league" checked> League defaults</label>
      <label><input type="radio" name="cc-marker-mode" value="custom"> Custom</label>
    </div>
    <div class="camera-calc-grid">
      <label><span>Marker diameter <span class="math notranslate nohighlight">\(d\)</span> (mm)</span><input type="number" id="cc-d" value="40" disabled></label>
      <label><span>Min px across marker</span><input type="number" id="cc-nmin" value="6" disabled></label>
    </div>
    <p class="camera-calc-note">League defaults: 40 mm ID dot (the smaller, limiting marker per the
    <a href="https://ssl.robocup.org/rules/">SSL Rules</a> vision pattern), 6 px minimum (see
    <a href="cameras.html#step-4-check-against-the-marker-size">Step 4</a>).</p>
  </fieldset>

<button type="button" id="cc-calc">Calculate</button>

<dl id="cc-output" class="camera-calc-output"></dl>
</div>
