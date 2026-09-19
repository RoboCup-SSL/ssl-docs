# Venue Requirements Calculator

Sizes a venue for an SSL event: floor area, power, outlets, and network drops.

Start from the number of teams you expect. If you venue or event is different, check the "advanced configuration"
dropdown for each section to override any simplifying assumptions that don't work for you.

This calculator automatically uses [Venue Requirements](venuerequirements.md) to generate a summary document for you.
Defaults are sourced where a league document states the number and estimated where it doesn't. Values are rounded
conservatively. Open **Show calculations** under the results for any section for a more detail explanation of what's
going on. As always, feel free to reach out to the TC/OC for help using this page.

Results are planning figures for a venue conversation, not an electrical design. Have an electrician or the venue's own
facilities team confirm circuit counts and layout.

AI Disclosure: This calculator was built with the assistance of Claude Opus 5. Please verify any outputs before sending
to the venue.

<div class="venue-calc">
  <div class="venue-calc-scenarios">
    <span>Start from:</span>
    <button type="button" class="venue-calc-preset" data-vc-scenario="international">International event</button>
    <button type="button" class="venue-calc-preset" data-vc-scenario="regional-a">Division A regional</button>
    <button type="button" class="venue-calc-preset" data-vc-scenario="regional-b">Division B regional</button>
  </div>
  <p class="venue-calc-note">Each resets every section, including anything you changed under Advanced Configuration,
  and calculates straight away. Mains voltage and breaker rating are left alone, since those follow the country
  rather than the event.</p>
  <fieldset class="venue-calc-group">
    <legend>1. Teams</legend>
    <div class="venue-calc-radio">
      <label><input type="radio" name="vc-team-mode" value="average" checked autocomplete="off"> Average team size per division</label>
      <label><input type="radio" name="vc-team-mode" value="matrix" autocomplete="off"> Enumerate teams by size</label>
    </div>
    <table class="venue-calc-matrix" id="vc-avg-table">
      <thead>
        <tr><th></th><th>Division A</th><th>Division B</th></tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Teams</th>
          <td><input type="number" id="vc-teams-a" value="8" min="0" name="vc-teams-a" autocomplete="off"></td>
          <td><input type="number" id="vc-teams-b" value="12" min="0" name="vc-teams-b" autocomplete="off"></td>
        </tr>
        <tr>
          <th scope="row">Average members per team</th>
          <td><input type="number" id="vc-members-a" value="12" min="0" name="vc-members-a" autocomplete="off"></td>
          <td><input type="number" id="vc-members-b" value="7" min="0" name="vc-members-b" autocomplete="off"></td>
        </tr>
      </tbody>
      <tfoot>
        <tr><th>Competitors</th><th id="vc-avg-a-people">96</th><th id="vc-avg-b-people">84</th></tr>
      </tfoot>
    </table>
    <table class="venue-calc-matrix" id="vc-matrix">
      <thead>
        <tr>
          <th>Team size</th><th>Members assumed</th>
          <th>Division A</th><th>Division B</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1-3 members</th>
          <td id="vc-mem-disp-1">2</td>
          <td><input type="number" id="vc-mx-a-1" value="0" min="0" disabled name="vc-mx-a-1" autocomplete="off"></td>
          <td><input type="number" id="vc-mx-b-1" value="0" min="0" disabled name="vc-mx-b-1" autocomplete="off"></td>
        </tr>
        <tr>
          <th scope="row">4-10 members</th>
          <td id="vc-mem-disp-2">7</td>
          <td><input type="number" id="vc-mx-a-2" value="3" min="0" disabled name="vc-mx-a-2" autocomplete="off"></td>
          <td><input type="number" id="vc-mx-b-2" value="8" min="0" disabled name="vc-mx-b-2" autocomplete="off"></td>
        </tr>
        <tr>
          <th scope="row">11-18 members</th>
          <td id="vc-mem-disp-3">15</td>
          <td><input type="number" id="vc-mx-a-3" value="4" min="0" disabled name="vc-mx-a-3" autocomplete="off"></td>
          <td><input type="number" id="vc-mx-b-3" value="4" min="0" disabled name="vc-mx-b-3" autocomplete="off"></td>
        </tr>
        <tr>
          <th scope="row">19+ members</th>
          <td id="vc-mem-disp-4">22</td>
          <td><input type="number" id="vc-mx-a-4" value="1" min="0" disabled name="vc-mx-a-4" autocomplete="off"></td>
          <td><input type="number" id="vc-mx-b-4" value="0" min="0" disabled name="vc-mx-b-4" autocomplete="off"></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>Total teams</th><th></th>
          <th id="vc-mx-a-total">8</th><th id="vc-mx-b-total">12</th>
        </tr>
        <tr>
          <th>Competitors</th><th></th>
          <th id="vc-mx-a-people">96</th><th id="vc-mx-b-people">84</th>
        </tr>
      </tfoot>
    </table>
    <details class="venue-calc-details venue-calc-details-inline">
      <summary>Show calculations</summary>
      <table class="venue-calc-calcs venue-calc-calcs-2col">
      <tbody>
      <tr><th scope="row">Tables per team</th>
          <td>1 up to 3 members, 2 up to 10, 3 up to 18, then +1 per 8 more</td></tr>
      <tr><th scope="row">Pit area per team</th>
          <td>tables are 2 &times; 1 m, placed inline, with a shared 1 m buffer all round:<br>
          <strong>(2 &times; tables + 2) &times; 3 m&sup2;</strong><br>
          1 table &rarr; 4 &times; 3 = <strong>12 m&sup2;</strong><br>
          2 tables &rarr; 6 &times; 3 = <strong>18 m&sup2;</strong><br>
          3 tables &rarr; 8 &times; 3 = <strong>24 m&sup2;</strong><br>
          4 tables &rarr; 10 &times; 3 = <strong>30 m&sup2;</strong><br>
          <a href="venuerequirements.html#size">Published</a>, except the 19+ band</td></tr>
      <tr><th scope="row">Competitors</th>
          <td>teams &times; members per team, both divisions added together</td></tr>
      </tbody>
      </table>
      <p class="venue-calc-note">Competitors counts team members only. Referees, organizers, volunteers, and spectators
      are on top of it and aren't estimated anywhere on this page.</p>
    </details>
    <details class="venue-calc-details venue-calc-details-inline venue-calc-advanced">
      <summary>Advanced Configuration</summary>
      <div class="venue-calc-grid">
        <label><span>1-3 band, members assumed</span><input type="number" id="vc-adv-members-1" min="0" name="vc-adv-members-1" autocomplete="off"></label>
        <label><span>4-10 band, members assumed</span><input type="number" id="vc-adv-members-2" min="0" name="vc-adv-members-2" autocomplete="off"></label>
        <label><span>11-18 band, members assumed</span><input type="number" id="vc-adv-members-3" min="0" name="vc-adv-members-3" autocomplete="off"></label>
        <label><span>19+ band, members assumed</span><input type="number" id="vc-adv-members-4" min="0" name="vc-adv-members-4" autocomplete="off"></label>
      </div>
      <p class="venue-calc-note">Only affects the competitor estimate in enumerate mode. Pit tables and pit area depend on the band alone.</p>
      <div class="venue-calc-radio">
        <button type="button" class="venue-calc-preset" data-vc-adv-reset="teams">Restore defaults</button>
      </div>
    </details>
  </fieldset>

<fieldset class="venue-calc-group">
    <legend>2. Fields</legend>
    <p class="venue-calc-lede">How many fields you need follows from how many teams have to share one. Plan on at most
    <strong>10 Division A teams per match field</strong>, <strong>12 Division B teams per match field</strong>, and
    <strong>20 teams per practice field</strong>. If every match field ends up with 4 teams or fewer, no practice field
    is recommended, since the match fields already have enough idle time to practise on.</p>
    <div class="venue-calc-radio">
      <label><input type="radio" name="vc-field-mode" value="derive" checked autocomplete="off"> Derive field counts from teams</label>
      <label><input type="radio" name="vc-field-mode" value="manual" autocomplete="off"> Set field counts directly</label>
    </div>
    <div class="venue-calc-grid">
      <label><span>Division A match fields</span><input type="number" id="vc-div-a" value="1" min="0" disabled name="vc-div-a" autocomplete="off"></label>
      <label><span>Division B match fields</span><input type="number" id="vc-div-b" value="1" min="0" disabled name="vc-div-b" autocomplete="off"></label>
      <label><span>Division B practice fields</span><input type="number" id="vc-div-b-practice" value="1" min="0" disabled name="vc-div-b-practice" autocomplete="off"></label>
    </div>
    <div class="venue-calc-grid">
      <label><span>Buffer per side (m)</span><input type="number" id="vc-buffer" value="1.5" step="0.1" min="0" name="vc-buffer" autocomplete="off"></label>
    </div>
    <details class="venue-calc-details venue-calc-details-inline">
      <summary>Show calculations</summary>
      <p class="venue-calc-note"><strong>Field counts.</strong>
      Division A match fields = &lceil; Division A teams &divide; 10 &rceil;.
      Division B match fields = &lceil; Division B teams &divide; 12 &rceil;.
      Practice fields = &lceil; all teams &divide; 20 &rceil;, or zero when every match field carries 4 teams or fewer.
      That 4-team test uses the load each field actually ends up with after its division rounds up, so 5 Division B
      teams counts as one lightly loaded field rather than a full one. Practice fields are Division B sized. The three
      ratios are fixed, sized against what the international event runs, per
      <a href="../field/network/compnetwork.html">Competition Network</a>. Switch to <em>Set field counts directly</em>
      if your event doesn't fit them.</p>
      <p class="venue-calc-note"><strong>Field footprint.</strong> Field sizes are the SSL Rules field of play
      <em>including</em> the boundary margin, so 13.4 by 10.4m for Division A and 10.4 by 7.4m for Division B. The
      buffer is the space outside that for tables, cabling, and people, and tables will encroach on it. Footprint is
      exactly field plus twice the buffer, so at the recommended 1.5m that's 16.4 by 13.4m for Division A and 13.4 by
      10.4m for Division B. Areas are rounded up.</p>
    </details>
    <details class="venue-calc-details venue-calc-details-inline venue-calc-advanced">
      <summary>Advanced Configuration</summary>
      <div class="venue-calc-grid">
        <label><span>Division A teams per match field</span><input type="number" id="vc-adv-per-field-a" min="1" name="vc-adv-per-field-a" autocomplete="off"></label>
        <label><span>Division B teams per match field</span><input type="number" id="vc-adv-per-field-b" min="1" name="vc-adv-per-field-b" autocomplete="off"></label>
        <label><span>Teams per practice field</span><input type="number" id="vc-adv-per-practice" min="1" name="vc-adv-per-practice" autocomplete="off"></label>
        <label><span>Skip practice field at or below (teams per match field)</span><input type="number" id="vc-adv-practice-skip" min="0" name="vc-adv-practice-skip" autocomplete="off"></label>
      </div>
      <div class="venue-calc-radio">
        <button type="button" class="venue-calc-preset" data-vc-adv-reset="fields">Restore defaults</button>
      </div>
    </details>
  </fieldset>

<fieldset class="venue-calc-group">
    <legend>3. Field Equipment</legend>
    <p class="venue-calc-lede">Defaults reflect the equipment the league ships in its
    <a href="travelcases.html">travel cases</a>.
    <button type="button" class="venue-calc-preset" id="vc-equip-reset">Restore default equipment</button></p>
    <div class="venue-calc-grid">
      <label><span>Division A camera config</span><select id="vc-cfg-a" name="vc-cfg-a" autocomplete="off">
        <option value="nuc2" selected>2 cameras + 2 truss NUCs</option>
        <option value="direct4">4 cameras, direct wired</option>
      </select></label>
      <label><span>Division B camera config</span><select id="vc-cfg-b" name="vc-cfg-b" autocomplete="off">
        <option value="nuc1" selected>1 camera + 1 truss NUC</option>
        <option value="nuc2">2 cameras + 2 truss NUCs</option>
        <option value="direct4">4 cameras, direct wired</option>
      </select></label>
    </div>
    <table class="venue-calc-matrix" id="vc-field-equip">
      <thead>
        <tr><th></th><th>Division A</th><th>Division B</th><th>Practice</th></tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Remote controls (2 per field)</th>
          <td><input type="checkbox" id="vc-remotes-a" checked name="vc-remotes-a" autocomplete="off"></td>
          <td><input type="checkbox" id="vc-remotes-b" checked name="vc-remotes-b" autocomplete="off"></td>
          <td><input type="checkbox" id="vc-remotes-p" name="vc-remotes-p" autocomplete="off"></td>
        </tr>
        <tr>
          <th scope="row">Status boards per field</th>
          <td><input type="number" id="vc-status-a" value="2" min="0" max="3" name="vc-status-a" autocomplete="off"></td>
          <td><input type="number" id="vc-status-b" value="2" min="0" max="3" name="vc-status-b" autocomplete="off"></td>
          <td><input type="number" id="vc-status-p" value="0" min="0" max="3" name="vc-status-p" autocomplete="off"></td>
        </tr>
        <tr>
          <th scope="row">Audio referee</th>
          <td><input type="checkbox" id="vc-audio-a" checked name="vc-audio-a" autocomplete="off"></td>
          <td><input type="checkbox" id="vc-audio-b" checked name="vc-audio-b" autocomplete="off"></td>
          <td><input type="checkbox" id="vc-audio-p" name="vc-audio-p" autocomplete="off"></td>
        </tr>
        <tr>
          <th scope="row">Streaming computer</th>
          <td><input type="checkbox" id="vc-stream-a" checked name="vc-stream-a" autocomplete="off"></td>
          <td><input type="checkbox" id="vc-stream-b" checked name="vc-stream-b" autocomplete="off"></td>
          <td><input type="checkbox" id="vc-stream-p" name="vc-stream-p" autocomplete="off"></td>
        </tr>
      </tbody>
    </table>
    <div class="venue-calc-radio">
      <label><input type="checkbox" id="vc-poe-status" name="vc-poe-status" autocomplete="off"> Status board computers powered over Ethernet</label>
    </div>
    <details class="venue-calc-details venue-calc-details-inline">
      <summary>Show calculations</summary>
      <p class="venue-calc-note"><strong>Per-field equipment.</strong> Every field gets a vision computer, a game
      controller computer, and its own switch and router regardless of camera config. In the direct wired config the
      cameras land on the vision computer's PoE host adapter rather than the field switch, so they consume neither a
      switch port nor switch PoE budget. See
      <a href="../field/network/compnetwork.html">Competition Network</a>.</p>
      <p class="venue-calc-note"><strong>Remote controls.</strong> One per team at the field, so a field has either
      two or none. There's no configuration where one team gets a remote and the other doesn't. They need PoE+, per
      <a href="../field/network/compute.html#remote-controls">Compute Resources</a>.</p>
      <p class="venue-calc-note"><strong>Tables at the field.</strong> Two for the field's own equipment, then one per
      team the field serves, capped at 8 tables around a Division A field and 6 around a Division B one. A field past
      its cap means teams share a table between matches. Each table takes an outlet, and each team table takes a switch
      port; the equipment tables' machines are counted individually instead.</p>
      <p class="venue-calc-note"><strong>Streaming computers.</strong> One per field that streams, not one for the
      event, since each rig switches between that field's cameras and overlays that field's game state. Each takes a
      port on its own field's switch and is the only machine guaranteed an internet drop, per
      <a href="../field/complayout.html#streaming-computer-optional">Competition Field</a>.</p>
      <p class="venue-calc-note"><strong>League cameras.</strong> The league owns 8 camera systems, enough for 4
      Division A fields or 8 Division B fields, and ships them in its
      <a href="travelcases.html">travel cases</a>. Anything past that has to be sourced locally, as do PoE cameras for
      a direct wired configuration, which the league doesn't own. Both show a warning in the results.</p>
      <p class="venue-calc-note"><strong>Why Division A has no single-camera option.</strong> One camera can't cover a
      Division A field: it would need close to four times the resolution and a mount higher than most venues can
      provide, so the league doesn't run that configuration. See
      <a href="../field/complayout.html#international-event-division-a">Competition Field</a>.</p>
    </details>
    <details class="venue-calc-details venue-calc-details-inline venue-calc-advanced">
      <summary>Advanced Configuration</summary>
      <div class="venue-calc-grid">
        <label><span>Remote controls per field</span><input type="number" id="vc-adv-remotes-per-field" min="0" name="vc-adv-remotes-per-field" autocomplete="off"></label>
        <label><span>Monitors per field (vision, GC)</span><input type="number" id="vc-adv-monitors-per-field" min="0" name="vc-adv-monitors-per-field" autocomplete="off"></label>
        <label><span>Chairs per table at the field</span><input type="number" id="vc-adv-chairs-per-field-table" min="0" step="0.5" name="vc-adv-chairs-per-field-table" autocomplete="off"></label>
        <label><span>Field equipment tables</span><input type="number" id="vc-adv-field-equip-tables" min="0" name="vc-adv-field-equip-tables" autocomplete="off"></label>
        <label><span>Max tables, Division A field</span><input type="number" id="vc-adv-field-tables-max-a" min="1" name="vc-adv-field-tables-max-a" autocomplete="off"></label>
        <label><span>Max tables, Division B field</span><input type="number" id="vc-adv-field-tables-max-b" min="1" name="vc-adv-field-tables-max-b" autocomplete="off"></label>
      </div>
      <div class="venue-calc-radio">
        <button type="button" class="venue-calc-preset" data-vc-adv-reset="equipment">Restore defaults</button>
      </div>
    </details>
  </fieldset>

<fieldset class="venue-calc-group">
    <legend>4. Team Area / The Pits</legend>
    <div class="venue-calc-grid">
      <label><span>Organizer tables</span><input type="number" id="vc-organizer-tables" value="2" min="1" name="vc-organizer-tables" autocomplete="off"></label>
    </div>
    <p class="venue-calc-lede">Each team's pit is sized from the size band you gave it in section 1:</p>
    <table class="venue-calc-matrix">
      <thead>
        <tr><th>Team size</th><th>Pit tables</th><th>Pit area</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">1-3 members</th><td>1</td><td>12 m&sup2;</td></tr>
        <tr><th scope="row">4-10 members</th><td>2</td><td>18 m&sup2;</td></tr>
        <tr><th scope="row">11-18 members</th><td>3</td><td>24 m&sup2;</td></tr>
        <tr><th scope="row">19+ members</th><td>4</td><td>30 m&sup2;</td></tr>
      </tbody>
    </table>
    <details class="venue-calc-details venue-calc-details-inline">
      <summary>Show calculations</summary>
      <p class="venue-calc-note"><strong>Pit area.</strong> Tables are 2 &times; 1 m, placed inline, with a shared 1 m
      buffer all round: <strong>(2 &times; tables + 2) &times; 3 m&sup2;</strong>. Organizer tables form one more
      cluster on the same formula. The bands and their areas are
      <a href="venuerequirements.html#size">published</a>, except the 19+ band, which extends the same formula.</p>
      <p class="venue-calc-note"><strong>Circulation.</strong> A fixed 30% is added on top of all pit footprints for
      aisles between rows. That allowance is <strong>not</strong> in the published figures, which are pit footprint
      only with no room to walk between them.</p>
      <p class="venue-calc-note"><strong>Chairs.</strong> One per competitor, so everyone has somewhere to sit at
      their own bench, plus one per organizer table and one per table at the field. Chairs don't affect the pit area,
      which is set by the tables.</p>
      <p class="venue-calc-note"><strong>Not counted.</strong> Spectator seating, stage, and registration are no part
      of this total. Add them to whatever the venue quotes you separately.</p>
    </details>
    <details class="venue-calc-details venue-calc-details-inline venue-calc-advanced">
      <summary>Advanced Configuration</summary>
      <div class="venue-calc-grid">
        <label><span>Chairs per competitor</span><input type="number" id="vc-adv-chairs-per-competitor" min="0" step="0.5" name="vc-adv-chairs-per-competitor" autocomplete="off"></label>
        <label><span>Circulation / aisles (%)</span><input type="number" id="vc-adv-circulation" min="0" name="vc-adv-circulation" autocomplete="off"></label>
        <label><span>Other area, such as spectators, stage, registration (m&sup2;)</span><input type="number" id="vc-adv-other-area" min="0" name="vc-adv-other-area" autocomplete="off"></label>
      </div>
      <div class="venue-calc-radio">
        <button type="button" class="venue-calc-preset" data-vc-adv-reset="pits">Restore defaults</button>
      </div>
    </details>
  </fieldset>

<fieldset class="venue-calc-group">
    <legend>5. Power</legend>
    <p class="venue-calc-lede">Only the supply matters here. Everything the league plugs into it is a fixed
    estimate, listed under <em>Show calculations</em>.</p>
    <div class="venue-calc-grid">
      <label><span>Mains voltage (V)</span><input type="number" id="vc-voltage" value="120" min="1" name="vc-voltage" autocomplete="off"></label>
      <label><span>Breaker rating (A)</span><input type="number" id="vc-amps" value="20" min="1" name="vc-amps" autocomplete="off"></label>
    </div>
    <div class="venue-calc-radio">
      <button type="button" class="venue-calc-preset" id="vc-preset-na">North America (120 V / 20 A)</button>
      <button type="button" class="venue-calc-preset" id="vc-preset-eu">Europe &amp; most of the world (230 V / 16 A)</button>
      <button type="button" class="venue-calc-preset" id="vc-preset-jp">Japan (100 V / 15 A)</button>
    </div>
    <details class="venue-calc-details venue-calc-details-inline">
      <summary>Show calculations</summary>
      <table class="venue-calc-calcs venue-calc-calcs-2col">
      <tbody>
      <tr><th scope="row">Usable per circuit</th>
          <td>volts &times; amps &times; <strong>80%</strong>. The derate is the standard continuous-load allowance,
          set by wiring regulation rather than by preference</td></tr>
      <tr><th scope="row">Per team</th>
          <td><strong>1500 W</strong> provisioned, <strong>750 W</strong> expected draw, per
          <a href="venuerequirements.html#power">Venue Requirements</a></td></tr>
      <tr><th scope="row">Field diversity</th>
          <td>field nameplate load &times; <strong>0.5</strong> for expected draw, reusing the published 1500 / 750
          team ratio, since no equivalent average is published for field equipment</td></tr>
      <tr><th scope="row">Mains-powered, per field</th>
          <td>vision + game controller computers together <strong>500 W</strong>, plus a
          <strong>45 W</strong> monitor each<br>
          field switch <strong>30 W</strong> &middot; field router <strong>30 W</strong><br>
          status board display <strong>45 W</strong> each, always mains, since PoE powers the board and never the
          screen hanging off it<br>
          status board computer <strong>15 W</strong> each, when not on PoE<br>
          audio referee <strong>100 W</strong> &middot; supplemental lighting <strong>0 W</strong></td></tr>
      <tr><th scope="row">Mains-powered, elsewhere</th>
          <td>truss NUC <strong>90 W</strong> each, at mounting height. Truss cameras draw from their NUC<br>
          streaming computer <strong>750 W</strong> each</td></tr>
      <tr><th scope="row">PoE-powered</th>
          <td>remote control <strong>25.5 W</strong> (PoE+) &middot; camera <strong>8 W</strong> &middot;
          status board <strong>15 W</strong> when on PoE</td></tr>
      </tbody>
      </table>
      <p class="venue-calc-note">Device figures are nameplate / PSU-rating estimates against the minimum specs on
      <a href="../field/network/compute.html">Compute Resources</a>, not measured draw. Vision and game controller are
      one combined 500 W figure because they're always deployed as a pair; they still count as two machines for outlets
      and switch ports.</p>
    </details>
    <details class="venue-calc-details venue-calc-details-inline venue-calc-advanced">
      <summary>Advanced Configuration</summary>
      <div class="venue-calc-grid">
        <label><span>Continuous derate (%)</span><input type="number" id="vc-adv-derate" min="1" max="100" name="vc-adv-derate" autocomplete="off"></label>
        <label><span>Field diversity factor</span><input type="number" id="vc-adv-diversity" min="0" max="1" step="0.05" name="vc-adv-diversity" autocomplete="off"></label>
        <label><span>Team drop capacity (W)</span><input type="number" id="vc-adv-team-drop" min="0" name="vc-adv-team-drop" autocomplete="off"></label>
        <label><span>Team average draw (W)</span><input type="number" id="vc-adv-team-avg" min="0" name="vc-adv-team-avg" autocomplete="off"></label>
        <label><span>Vision + game controller (W)</span><input type="number" id="vc-adv-w-visiongc" min="0" name="vc-adv-w-visiongc" autocomplete="off"></label>
        <label><span>Streaming computer (W)</span><input type="number" id="vc-adv-w-stream" min="0" name="vc-adv-w-stream" autocomplete="off"></label>
        <label><span>Truss NUC (W)</span><input type="number" id="vc-adv-w-nuc" min="0" name="vc-adv-w-nuc" autocomplete="off"></label>
        <label><span>Field switch (W)</span><input type="number" id="vc-adv-w-switch" min="0" name="vc-adv-w-switch" autocomplete="off"></label>
        <label><span>Field router (W)</span><input type="number" id="vc-adv-w-router" min="0" name="vc-adv-w-router" autocomplete="off"></label>
        <label><span>Monitor, vision/GC (W)</span><input type="number" id="vc-adv-w-monitor" min="0" name="vc-adv-w-monitor" autocomplete="off"></label>
        <label><span>Status board display (W)</span><input type="number" id="vc-adv-w-status-display" min="0" name="vc-adv-w-status-display" autocomplete="off"></label>
        <label><span>Status board computer (W)</span><input type="number" id="vc-adv-w-status-board" min="0" name="vc-adv-w-status-board" autocomplete="off"></label>
        <label><span>Audio referee (W)</span><input type="number" id="vc-adv-w-audio" min="0" name="vc-adv-w-audio" autocomplete="off"></label>
        <label><span>Supplemental lighting per field (W)</span><input type="number" id="vc-adv-w-lighting" min="0" name="vc-adv-w-lighting" autocomplete="off"></label>
        <label><span>Remote control, PoE+ (W)</span><input type="number" id="vc-adv-poe-remote" min="0" step="0.5" name="vc-adv-poe-remote" autocomplete="off"></label>
        <label><span>Camera, PoE (W)</span><input type="number" id="vc-adv-poe-camera" min="0" name="vc-adv-poe-camera" autocomplete="off"></label>
        <label><span>Status board, PoE (W)</span><input type="number" id="vc-adv-poe-status" min="0" name="vc-adv-poe-status" autocomplete="off"></label>
      </div>
      <div class="venue-calc-radio">
        <button type="button" class="venue-calc-preset" data-vc-adv-reset="power">Restore defaults</button>
      </div>
    </details>
  </fieldset>

<fieldset class="venue-calc-group">
    <legend>6. Network</legend>
    <div class="venue-calc-grid">
      <label><span>Venue drops per team in the pits</span><input type="number" id="vc-pits-drops" value="1" min="0" name="vc-pits-drops" autocomplete="off"></label>
    </div>
    <details class="venue-calc-details venue-calc-details-inline">
      <summary>Show calculations</summary>
      <p class="venue-calc-note"><strong>Ports versus drops.</strong> Field switch ports are what the field's own
      switch must have. Venue drops are what the venue or its networking contractor has to physically pull: one uplink
      per field, plus pits and internet. Set pits drops to 0 if the pits get no wired network.</p>
      <p class="venue-calc-note"><strong>Switches.</strong> Every field gets the same 24-port switch whatever it
      actually needs, so one spare on the shelf fits any field. No configuration the league runs comes close to
      filling it. A field only gets a second switch if its ports plus headroom exceed 24.</p>
      <p class="venue-calc-note"><strong>VLANs.</strong> One per field, plus an optional one for the pits. Per-field
      isolation is a hard requirement, because vision and referee traffic is multicast and two fields sharing a
      broadcast domain will consume each other's game state. A networking contractor will usually quote virtual
      isolation more cheaply than a router per field; see
      <a href="../field/network/compnetwork.html#networking-equipment">Competition Network</a>. The pits VLAN carries
      no league traffic and is a convenience only.</p>
      <p class="venue-calc-note"><strong>Addressing.</strong> The suggested VLAN ids and subnets are a convention
      rather than a rule, and a contractor with an existing numbering plan should use theirs. What matters is that each
      field lands in its own VLAN and its own subnet. Layout follows
      <a href="../field/network/compnetwork.html#lan-config">Competition Network</a>, holding back .0.2 through .0.50
      for the gateway, switch, router and anything else wanting a fixed address.</p>
    </details>
    <details class="venue-calc-details venue-calc-details-inline venue-calc-advanced">
      <summary>Advanced Configuration</summary>
      <div class="venue-calc-grid">
        <label><span>Spare switch port headroom (%)</span><input type="number" id="vc-adv-spare-ports" min="0" name="vc-adv-spare-ports" autocomplete="off"></label>
        <label><span>Internet drops (streaming, organizers)</span><input type="number" id="vc-adv-internet-drops" min="0" name="vc-adv-internet-drops" autocomplete="off"></label>
      </div>
      <div class="venue-calc-radio">
        <button type="button" class="venue-calc-preset" data-vc-adv-reset="network">Restore defaults</button>
      </div>
    </details>
  </fieldset>

<div class="venue-calc-actions">
  <button type="button" id="vc-calc">Calculate</button>
  <button type="button" id="vc-copy" disabled>Copy Summary</button>
  <button type="button" id="vc-download-md" disabled>Download Summary Markdown</button>
  <button type="button" id="vc-download" disabled>Download Full CSV</button>
</div>

<div id="vc-output" class="venue-calc-output" role="region" aria-live="polite" aria-label="Results"></div>

<details class="venue-calc-details">
<summary>Show calculations</summary>

<p class="venue-calc-note">Every formula this page uses, and where each number comes from. "Published" means a league
document states it, so follow the link and cite it to your venue. "Estimated" means this calculator picked it, and you
should replace it with a real figure once you have one.</p>

<h3 class="venue-calc-calc-head">Teams and pits</h3>
<table class="venue-calc-calcs">
<tbody>
<tr><th scope="row">Pit tables per team</th>
    <td>1 table to 3 members, 2 to 10, 3 to 18, then +1 per 8 members</td>
    <td><a href="venuerequirements.html#size">Published</a>, 19+ band estimated</td></tr>
<tr><th scope="row">Pit area per team</th>
    <td>(2 &times; tables + 2) &times; 3 m&sup2;, from 2 by 1m tables inline sharing a 1m buffer</td>
    <td><a href="venuerequirements.html#size">Published</a></td></tr>
<tr><th scope="row">Competitors, average mode</th>
    <td>teams &times; average members, per division</td>
    <td>Your input</td></tr>
<tr><th scope="row">Competitors, enumerate mode</th>
    <td>&Sigma; (teams in band &times; band midpoint), using 2, 7, 15, 22</td>
    <td>Estimated. No league document states a roster size</td></tr>
</tbody>
</table>

<h3 class="venue-calc-calc-head">Fields</h3>
<table class="venue-calc-calcs">
<tbody>
<tr><th scope="row">Match fields</th>
    <td>&lceil; division teams &divide; teams per match field &rceil;, at 10 Division A / 12 Division B per field</td>
    <td>Estimated, sized against the international event's field mix</td></tr>
<tr><th scope="row">Practice fields</th>
    <td>&lceil; total teams &divide; 20 &rceil;, or none at all when every match field carries 4 teams or fewer</td>
    <td>Estimated</td></tr>
</tbody>
</table>

<h3 class="venue-calc-calc-head">Floor area</h3>
<table class="venue-calc-calcs">
<tbody>
<tr><th scope="row">Field of play</th>
    <td>13.4 &times; 10.4 m Division A, 10.4 &times; 7.4 m Division B, boundary margin included</td>
    <td><a href="https://robocup-ssl.github.io/ssl-rules/sslrules.html#_dimensions">Published</a></td></tr>
<tr><th scope="row">Field footprint</th>
    <td>each dimension plus twice the buffer, so 16.4 by 13.4m for Division A and 13.4 by 10.4m for Division B at
    the recommended 1.5m</td>
    <td><a href="venuerequirements.html#size">Published</a> at a 1.5 m buffer</td></tr>
<tr><th scope="row">Pits</th>
    <td>(&Sigma; team pit areas + organizer pit area) &times; 1.30</td>
    <td>Areas published. The 30% circulation is estimated, since the published figures have no aisles</td></tr>
<tr><th scope="row">Total</th>
    <td>all field footprints + pits; sq.ft = m&sup2; &times; 10.764. Both are rounded up to whole units for display,
    never down. Spectator seating, stage, and registration are not included</td>
    <td></td></tr>
<tr><th scope="row">Per competitor</th>
    <td>total area &divide; competitors, to compare against the venue's occupancy limit</td>
    <td>Sanity check, not a code requirement</td></tr>
</tbody>
</table>

<h3 class="venue-calc-calc-head">Power</h3>
<table class="venue-calc-calcs">
<tbody>
<tr><th scope="row">Per field, floor level</th>
    <td>vision and game controller together 500 W, + switch 30 W + router 30 W + lighting, plus 60 W per status board
    not on PoE, plus 100 W audio referee where present</td>
    <td>Devices <a href="../field/network/compnetwork.html">published</a>, wattages estimated</td></tr>
<tr><th scope="row">Per field, truss level</th>
    <td>truss NUCs &times; 90 W. Truss cameras draw from their NUC</td>
    <td>Config <a href="../field/network/compnetwork.html#cameras">published</a>, wattage estimated</td></tr>
<tr><th scope="row">Field expected draw</th>
    <td>connected load &times; 0.5 diversity</td>
    <td>Estimated, taken from the published 1500 / 750 team ratio</td></tr>
<tr><th scope="row">Pits capacity</th>
    <td>teams &times; 1500 W provisioned; teams &times; 750 W expected</td>
    <td><a href="venuerequirements.html#power">Published</a></td></tr>
<tr><th scope="row">Where the figures live</th>
    <td>none of the above are on the form, since they're regulatory, published, or nameplate estimates. All of them
    sit in one <code>VC_POWER</code> structure in the page's script, and the Power section lists them</td>
    <td>Estimated against the minimum specs on
    <a href="../field/network/compute.html">Compute Resources</a>, not measured</td></tr>
</tbody>
</table>

<h3 class="venue-calc-calc-head">Circuits</h3>
<table class="venue-calc-calcs">
<tbody>
<tr><th scope="row">Usable per circuit</th>
    <td>volts &times; amps &times; derate</td>
    <td>Estimated. 80% is the usual continuous load derate</td></tr>
<tr><th scope="row">Pits circuits</th>
    <td>whole team drops packed per circuit, never split, so a circuit holding 1.9 drops still takes one team</td>
    <td>Estimated</td></tr>
<tr><th scope="row">Field circuits</th>
    <td>counted per field, floor and truss separately, since separated fields can't share a breaker</td>
    <td>Estimated</td></tr>
</tbody>
</table>

<h3 class="venue-calc-calc-head">Outlets and network drops</h3>
<table class="venue-calc-calcs">
<tbody>
<tr><th scope="row">Pits outlets</th>
    <td>one per team, one per organizer table. Teams bring their own power strip</td>
    <td><a href="venuerequirements.html#power">Published</a></td></tr>
<tr><th scope="row">Chairs</th>
    <td>one per competitor, one per organizer table, one per table at the field</td>
    <td>Estimated. No league document covers seating</td></tr>
<tr><th scope="row">Field outlets</th>
    <td>one per table at the field, which covers the vision and game controller computers and their monitors on a
    strip, plus one for the switch and router, one per status board whether or not the board is on PoE, one for the
    audio referee, one for the streaming rig where a field has one, and one for lighting if any. Totalled as field
    floor, field truss and pits floor, since those are three separate asks of the venue</td>
    <td><a href="../field/complayout.html#tables">Published</a>, one outlet per table</td></tr>
<tr><th scope="row">Truss outlets</th>
    <td>one per truss NUC, at mounting height. Budget rigging for these rather than floor outlets</td>
    <td>Follows from the <a href="../field/network/compnetwork.html#cameras">published</a> camera config</td></tr>
<tr><th scope="row">Field switch ports</th>
    <td>truss NUCs + vision + game controller + remote controls + status boards + field team tables + audio referee +
    uplink. Every field gets the same 24-port switch, so one spare fits any field; the headroom allowance only decides
    whether a field needs a second one</td>
    <td>Devices published; headroom and the 24-port standard estimated</td></tr>
<tr><th scope="row">Switch PoE budget</th>
    <td>remote controls &times; 25.5 W, plus status boards if on PoE. Cameras are never on the field switch</td>
    <td><a href="../field/network/compute.html#remote-controls">Published</a>, remotes need PoE+</td></tr>
<tr><th scope="row">Venue drops</th>
    <td>one uplink per field + pits drops per team + organizer tables + internet drops</td>
    <td>Estimated. League documentation sets no pits network requirement</td></tr>
<tr><th scope="row">VLANs</th>
    <td>one per field, required for isolation, plus one optional VLAN covering the pits</td>
    <td>Per-field isolation
    <a href="../field/network/compnetwork.html#networking-equipment">published</a>; the pits VLAN is estimated</td></tr>
<tr><th scope="row">Addressing</th>
    <td>field <em>N</em> gets VLAN 10<em>N</em> on 10.(10<em>N</em>).0.0/16, so the VLAN id and second octet match;
    pits take VLAN 200. Gateway .0.1, reserved .0.2 through .0.50, DHCP from .0.51, broadcast .255.255</td>
    <td>Subnet layout <a href="../field/network/compnetwork.html#lan-config">published</a>; the numbering scheme is
    this calculator's suggestion</td></tr>
</tbody>
</table>

<p class="venue-calc-note">Not counted anywhere above: referees, organizers, volunteers, and spectators, along with
whatever space, seating, and facilities they need. Competitor count covers teams only.</p>

</details>
</div>
