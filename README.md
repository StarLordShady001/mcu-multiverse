# Multiverse Atlas — Road to Doomsday

Unofficial interactive 3D map of 101 MCU titles: which Earth/timeline each happens on, in-universe year, and where realities cross.

## Run
Serve the folder (textures can't load from a double-clicked file): `python3 -m http.server 8765` → http://localhost:8765
Deep link to a reality: `http://localhost:8765/#616`, `#828`, `#10005` …
(Three.js + fonts come from CDN; planet and sky textures are bundled in `assets/textures/`.)

## Controls
Scroll = zoom to cursor · drag = orbit · right-drag = pan · click a node/planet = fly to it · double-click empty space or Esc = overview.
Title and year labels, plus the hero (upper) and villain (lower) rings, appear when you zoom close to an Earth.
Pick a reality in the dropdown (or click a planet) to make it glow while everything else fades; choose "All realities" or press Esc to return to normal. Watched progress is saved in this browser.

## Layout: one universe
- Realities sit on four labelled rings around Loki's tree: Outside time (TVA, Void, Quantum Realm) → Sacred Timeline & its branches → Alternate Earths → What If. Ring radii are `TIERS` in `data.js`.
- **Earth-616 carries its own worlds** (`planets.js`): the Moon beside it; the Nine Realms hanging from Yggdrasil above it, with Asgard at the top; the Kree Empire, Sakaar's space and Andromeda (Xandar, Morag, the Kyln) as star clouds beyond it; and deep-space worlds (Titan, Knowhere, Ego, Vormir and more) on an arc around it. Planet names appear as you zoom toward Earth-616; click one for its story.
- Hand-built 3D models: Asgard (floating continent, ocean falls, Odin's palace, Bifröst and observatory), Nidavellir (rotating forge rings around a neutron star), Muspelheim (lava world), Knowhere (Celestial head with colony lights), Sakaar (wormholes, including the Devil's Anus), Titan (shattered-moon debris ring), Ego (glowing living planet). The other worlds use realistic textures.
- **Exact film models:** put a licensed `.glb` at `assets/models/<id>.glb` (e.g. `asgard.glb`) and add the id to `MODELS` in `planets.js`. It replaces the built-in model, scaled to fit.

## Add content
Everything comes from `data.js`:
- new film/series → append a row to `TITLES`
- new reality → add to `EARTHS` (orbit, angle, y, size, color)
- new crossover → add to `COLLISIONS`
- new planet → add a row to `PLANETS` in `planets.js`
- move a hero/villain or change alive/dead/captive → edit their row in `CHARACTERS`

Then run `node check.mjs` to catch broken references.

## Licensed images (drop-in, no code changes)
- Key art per title: `assets/art/001.jpg` … `101.jpg` (the watch-order number, 3 digits). Portrait 2:3, ~1000×1500.
- Character portraits (heroes and villains): `assets/characters/<id>.png` using the ids in `CHARACTERS` in `data.js` (e.g. `sam-wilson.png`, `kingpin.png`, `doom.png`). Square, ~512×512. Until a file exists, a coloured initials badge is shown (cyan hero, gold antihero, red villain, grey deceased).
- Missing files are simply skipped.
- Copyright line: set `LEGAL` in `data.js` to the licensor's approved text.

Planet/sky textures: Earth, Moon and sky are NASA Blue Marble–derived imagery redistributed with three.js (public domain / MIT). `assets/textures/planets/*` are from Solar System Scope (solarsystemscope.com/textures, **CC BY 4.0: credit "Solar System Scope" is required**). Confirm both with your licensor's legal team before merchandise use.

## Publishing
Use only images supplied or approved under your licence agreement, and replace `LEGAL` with the approved notice.
