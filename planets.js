// The worlds of Earth-616's universe, drawn around Earth-616 itself. Loaded by index.html after data.js.
// Planets come from the "All 43 Planets in the MCU" video and the "Marvel's cosmic connections" chart.
// [id, name, region, model, tint, size, note]
// region: sol | realms (hang from Yggdrasil above Earth) | kree | fornax | andromeda | deep (deep space, around the system)
// model: asgard | nidavellir | muspelheim | knowhere | sakaar | titan | ego (hand-built 3D models)
//        earth | rock | a texture in assets/textures/planets/ (without .jpg)
// A licensed 3D model at assets/models/<id>.glb replaces the built-in one: list its id in MODELS.
window.MULTIVERSE.REGIONS = {
  realms: "The Nine Realms · Yggdrasil",
  kree: "Kree Empire",
  fornax: "Fornax · Sakaar's space",
  andromeda: "Andromeda · Nova Empire",
  deep: "Deep space"
};
window.MULTIVERSE.PLANETS = [
  ["moon", "The Moon", "sol", "rock", "#dddddd", 2, "Earth's moon. The Blue Area hosts the Inhumans' city of Attilan in Marvel's Inhumans (2017)."],

  ["asgard", "Asgard", "realms", "asgard", "#ffd27a", 9, "Throne world of the Nine Realms: a flat continent with oceans pouring over its edge, Odin's golden palace and the Bifröst bridge. Destroyed by Surtur in Thor: Ragnarok; its people now live in New Asgard, Norway."],
  ["jotunheim", "Jotunheim", "realms", "haumea_fictional", "#bfe6ff", 5, "Frozen realm of the Frost Giants and Loki's birthplace (Thor, 2011)."],
  ["vanaheim", "Vanaheim", "realms", "earth", "#9dffb0", 4.5, "Realm of the Vanir. Thor ends a war here at the start of The Dark World."],
  ["alfheim", "Alfheim", "realms", "earth", "#e8fff4", 4, "Realm of the Light Elves, named in the Thor films."],
  ["svartalfheim", "Svartalfheim", "realms", "ceres_fictional", "#7a7f99", 4.5, "Dark Elf homeworld where Thor fights Malekith during the Convergence (The Dark World)."],
  ["nidavellir", "Nidavellir", "realms", "nidavellir", "#bfe3ff", 7, "Dwarven forge: giant rotating rings around a neutron star. Eitri made Mjölnir, the Infinity Gauntlet and Stormbreaker here (Infinity War)."],
  ["muspelheim", "Muspelheim", "realms", "muspelheim", "#ff6a33", 5, "Fire realm of Surtur, a world of lava and burning skies (opening of Thor: Ragnarok)."],
  ["niflheim", "Niflheim · Hel", "realms", "eris_fictional", "#9fb0b8", 4, "Realm of mist and the dead. Hela draws her power from Hel."],

  ["hala", "Hala", "kree", "earth", "#5fd7c8", 6, "Kree capital, ruled by the Supreme Intelligence (Captain Marvel)."],
  ["torfa", "Torfa", "kree", "makemake_fictional", "#c08b78", 3, "Kree outpost where Vers is captured by Skrulls (Captain Marvel)."],
  ["skrullos", "Skrull homeworld", "kree", "mars", "#7fd36f", 4.5, "Lost to the Kree–Skrull war, so the Skrulls hide on Earth (Captain Marvel, Secret Invasion)."],

  ["sakaar", "Sakaar", "fornax", "sakaar", "#e8b06a", 7, "Junk world surrounded by wormholes, ruled by the Grandmaster. The biggest wormhole is the 'Devil's Anus' (Thor: Ragnarok)."],

  ["xandar", "Xandar", "andromeda", "earth", "#8fd0ff", 6, "Capital of the Nova Empire. Thanos destroys it off screen for the Power Stone (Infinity War)."],
  ["morag", "Morag", "andromeda", "neptune", "#6fb7c4", 4.5, "Abandoned ocean world where Quill steals the Power Stone (Guardians of the Galaxy, 2014; Endgame)."],
  ["kyln", "The Kyln", "andromeda", "ceres_fictional", "#9aa0a8", 3, "Nova Corps prison where the Guardians first team up (2014)."],

  ["titan", "Titan", "deep", "titan", "#d08a5a", 6.5, "Thanos's ruined homeworld, circled by the wreckage of the moon he pulled down in Infinity War."],
  ["knowhere", "Knowhere", "deep", "knowhere", "#c9905a", 6, "Mining colony carved into the severed head of a Celestial. The Collector's home, later the Guardians' base."],
  ["ego", "Ego", "deep", "ego", "#c9a0ff", 7, "The living planet of the Celestial Ego, Peter Quill's father, built around a glowing brain. Destroyed (Guardians Vol. 2)."],
  ["vormir", "Vormir", "deep", "ceres_fictional", "#56607a", 4.5, "Where the Soul Stone demands a sacrifice: Gamora, then Natasha."],
  ["sovereign", "Sovereign", "deep", "venus_atmosphere", "#ffd84d", 4.5, "Golden, genetically perfect world of Ayesha (Guardians Vol. 2)."],
  ["contraxia", "Contraxia", "deep", "haumea_fictional", "#d8f2ff", 4, "Icy pleasure planet where Yondu's Ravagers drink (Guardians Vol. 2)."],
  ["berhert", "Berhert", "deep", "earth", "#8cff9a", 4, "Forest planet where the Milano crash-lands (Guardians Vol. 2)."],
  ["zenwhoberi", "Zen-Whoberi", "deep", "earth", "#a8c8ff", 4, "Gamora's homeworld; Thanos wiped out half its people (Infinity War flashback)."],
  ["counterearth", "Counter-Earth", "deep", "earth", "#ffe0f0", 5, "The High Evolutionary's copy of Earth (Guardians Vol. 3)."],
  ["halfworld", "Halfworld", "deep", "makemake_fictional", "#b9c27a", 3.5, "Rocket's lab world in Guardians tie-in material; Vol. 3 shows his origin aboard the High Evolutionary's ship."],
  ["aakon", "Aakon", "deep", "uranus", "#c9a0ff", 4, "Homeworld of the Aakon. Ego's seed sprouted here (Guardians Vol. 2)."],
  ["planetx", "Planet X", "deep", "earth", "#a7e07a", 4, "Homeworld of Groot's species, named in tie-in material."],
  ["kitson", "Kitson", "deep", "mars", "#e0a0b8", 3.5, "Gambling world in Agents of S.H.I.E.L.D. season 6."],
  ["maveth", "Maveth", "deep", "ceres_fictional", "#5a6a9a", 4, "Dead world reached through a Kree Monolith, where Hive was imprisoned (Agents of S.H.I.E.L.D. S3)."]
];
// ids with a licensed model in assets/models/<id>.glb, e.g. ["asgard", "nidavellir"]
window.MULTIVERSE.MODELS = [];
