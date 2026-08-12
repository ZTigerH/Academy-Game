/* =========================================================
   ENGINE — game state, all helper/utility functions, the
   goTo() rendering engine, character sheet + panel UI, and
   all setup-screen / save-slot / settings event wiring.
   ========================================================= */


/* ============================== STATE ============================== */
const STAT_KEYS = ['fame','charisma','honor','luck','resolve','empathy','resonance','corruption','apathy'];

function freshStats() {
  const s = {};
  STAT_KEYS.forEach(k => s[k] = 0);
  return s;
}

let state = { name: "", resonanceType: "", origin: "", stats: freshStats(), flags: {}, hp: 100, maxHp: 100, inventory: [], trust: { sable: 0, thorne: 0, denna: 0 }, gold: 0, equipment: { weapon: null, helmet: null, chestplate: null, leggings: null, accessory: null }, companionCreature: null, durability: {} };

/* ---------------- Durability ---------------- */
function getDurability(s, item) {
  if (!item) return 100;
  return s.durability[item] !== undefined ? s.durability[item] : 100;
}
function damageDurability(s, item, amount) {
  if (!item) return;
  const cur = getDurability(s, item);
  s.durability[item] = Math.max(0, cur - amount);
}
function repairItem(s, item) {
  s.durability[item] = 100;
}
function isBroken(s, item) {
  return item && getDurability(s, item) <= 0;
}
/* Wears down whatever's equipped in the given slot(s) after a fight. */
function wearEquipment(s, slots, amount) {
  slots.forEach(slot => {
    const item = s.equipment && s.equipment[slot];
    if (item) damageDurability(s, item, amount);
  });
}
let currentSceneId = null;

const SAVE_SLOT_KEYS = ['aurelia_save_1', 'aurelia_save_2', 'aurelia_save_3'];
let currentSlot = SAVE_SLOT_KEYS[0];

function saveGame(s, sceneId) {
  try {
    const chapterLabel = (SCENES[sceneId] && (typeof SCENES[sceneId].chapter === 'function' ? SCENES[sceneId].chapter(s) : SCENES[sceneId].chapter)) || '';
    localStorage.setItem(currentSlot, JSON.stringify({ state: s, sceneId, savedAt: Date.now(), name: s.name, chapterLabel }));
  } catch (e) { /* ignore */ }
}
function loadSlot(slotKey) {
  try {
    const raw = localStorage.getItem(slotKey);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function loadSavedGame() {
  return loadSlot(currentSlot);
}
function clearSlot(slotKey) {
  try { localStorage.removeItem(slotKey); } catch (e) { /* ignore */ }
}
function clearSavedGame() {
  clearSlot(currentSlot);
}
function anySaveExists() {
  return SAVE_SLOT_KEYS.some(k => loadSlot(k));
}

/* Chapter Select checkpoints — separate from save slots, persist across restarts,
   capture a full state snapshot at the start of each major chapter/part. */
const CHECKPOINT_KEYS = {
  ch1: 'aurelia_checkpoint_ch1',
  ch2: 'aurelia_checkpoint_ch2',
  ch3: 'aurelia_checkpoint_ch3',
  ch4: 'aurelia_checkpoint_ch4',
  parttwo: 'aurelia_checkpoint_parttwo'
};
const CHECKPOINT_LABELS = {
  ch1: 'Chapter 1 — Initiation',
  ch2: 'Chapter 2 — Cracks',
  ch3: 'Chapter 3 — The Signal',
  ch4: 'Chapter 4 — The Weight of It',
  parttwo: 'Part Two — Graduation'
};

function saveCheckpoint(key, s, sceneId) {
  try { localStorage.setItem(CHECKPOINT_KEYS[key], JSON.stringify({ state: s, sceneId, savedAt: Date.now() })); } catch (e) { /* ignore */ }
}
function loadCheckpoint(key) {
  try {
    const raw = localStorage.getItem(CHECKPOINT_KEYS[key]);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function anyCheckpointExists() {
  return Object.keys(CHECKPOINT_KEYS).some(k => loadCheckpoint(k));
}

const ITEM_BONUSES = {
  'Stolen Blade': { resonance: 1 },
  'Looted Supplies': { luck: 1 },
  "Villager's Keepsake": { luck: 1, fame: 1 },
  'Bribe Money': { corruption: 1 },
  'Ridgeback Scale': { fame: 1 },
  'Field Journal': { resolve: 1 },
  "Vesk's Notes": { resonance: 1, corruption: 1 },
  'Academy Commendation Pin': { fame: 1, charisma: 1 },
  'Masterwork Blade': { resonance: 2 },
  'Reinforced Chestplate': { resolve: 2 },
  'Quartz-Lined Vest': { honor: 1, corruption: -1 },
  'Academy Guard Helmet': { honor: 1, resolve: 1 },
  'Ceremonial Circlet': { charisma: 2, fame: 1 },
  'Traveling Leggings': { luck: 1 },
  "Villager's Guard Vest": { honor: 1, resolve: 1 },
  "Sable's Keepsake Charm": { luck: 1, empathy: 1 },
  "Bandit's Cloak": { luck: 1, resonance: 1 },
  "Captain's Insignia": { honor: 1, fame: 1 }
};

/* Which equipment slot each item occupies. Items without an entry (Ridgeback Scale, Vesk's Notes,
   Bribe Money, Council Field Credentials, etc.) are trade/key items — carried but not equipped. */
const ITEM_SLOT = {
  'Stolen Blade': 'weapon',
  'Masterwork Blade': 'weapon',
  'Reinforced Chestplate': 'chestplate',
  'Quartz-Lined Vest': 'chestplate',
  'Academy Guard Helmet': 'helmet',
  'Ceremonial Circlet': 'helmet',
  'Traveling Leggings': 'leggings',
  "Villager's Guard Vest": 'chestplate',
  "Sable's Keepsake Charm": 'accessory',
  "Bandit's Cloak": 'accessory',
  "Captain's Insignia": 'accessory',
  'Looted Supplies': 'accessory',
  "Villager's Keepsake": 'accessory',
  'Field Journal': 'accessory',
  'Academy Commendation Pin': 'accessory'
};

const EQUIPMENT_SLOTS = ['weapon', 'helmet', 'chestplate', 'leggings', 'accessory'];
const SLOT_LABELS = { weapon: 'Weapon', helmet: 'Helmet', chestplate: 'Chestplate', leggings: 'Leggings', accessory: 'Accessory' };

const SHOP_ITEMS = [
  { name: 'Masterwork Blade', cost: 120 },
  { name: 'Reinforced Chestplate', cost: 80 },
  { name: 'Quartz-Lined Vest', cost: 90 },
  { name: 'Academy Guard Helmet', cost: 60 },
  { name: 'Ceremonial Circlet', cost: 100 },
  { name: 'Traveling Leggings', cost: 50 },
  { name: "Villager's Guard Vest", cost: 65 }
];

/* What each equippable item sells back for — shop gear sells at half its buy price,
   story-found items get a flat value since they weren't bought with gold. */
const SELL_VALUES = {
  'Stolen Blade': 25,
  'Looted Supplies': 15,
  "Villager's Keepsake": 20,
  'Field Journal': 15,
  'Academy Commendation Pin': 20,
  'Masterwork Blade': 60,
  'Reinforced Chestplate': 40,
  'Quartz-Lined Vest': 45,
  'Academy Guard Helmet': 30,
  'Ceremonial Circlet': 50,
  'Traveling Leggings': 25,
  "Villager's Guard Vest": 32
};

function bump(s, deltas) {
  Object.keys(deltas).forEach(k => { s.stats[k] = (s.stats[k] || 0) + deltas[k]; });
}

function bumpTrust(s, deltas) {
  Object.keys(deltas).forEach(k => { s.trust[k] = (s.trust[k] || 0) + deltas[k]; });
}

function bumpRapport(s, delta) {
  s.flags.rivalRapport = (s.flags.rivalRapport || 0) + delta;
}

function bumpGold(s, delta) {
  s.gold = Math.max(0, (s.gold || 0) + delta);
}

/* 30% chance of a brief optional encounter before continuing to the next chapter. */
function maybeEncounter(s, normalNext) {
  if (Math.random() < 0.3) {
    s.flags.encounterVariant = Math.floor(Math.random() * 3);
    s.flags.encounterTarget = normalNext;
    return 'random_encounter';
  }
  return normalNext;
}

const COMPANION_BONUSES = {
  'Loyal Hollow-Hound': { resolve: 1, luck: 1 }
};

function equipmentBonus(s, statKey) {
  let total = 0;
  if (!s.equipment) return total;
  EQUIPMENT_SLOTS.forEach(slot => {
    const item = s.equipment[slot];
    if (!item || isBroken(s, item)) return;
    const b = ITEM_BONUSES[item];
    if (b && b[statKey]) total += b[statKey];
  });
  if (s.companionCreature && COMPANION_BONUSES[s.companionCreature]) {
    const cb = COMPANION_BONUSES[s.companionCreature];
    if (cb[statKey]) total += cb[statKey];
  }
  return total;
}

function effectiveStat(s, statKey) {
  let val = (s.stats[statKey] || 0) + equipmentBonus(s, statKey);
  if (hasStatus(s, 'shaken') && (statKey === 'empathy' || statKey === 'honor')) val -= 1;
  return val;
}

function addItem(s, name) {
  if (!s.inventory.includes(name)) s.inventory.push(name);
  const slot = ITEM_SLOT[name];
  if (slot && !s.equipment[slot]) s.equipment[slot] = name;
}
function removeItem(s, name) {
  s.inventory = s.inventory.filter(i => i !== name);
  const slot = ITEM_SLOT[name];
  if (slot && s.equipment[slot] === name) s.equipment[slot] = null;
}
function hasItem(s, name) {
  return s.inventory.includes(name);
}
function equipItem(s, slot, name) {
  s.equipment[slot] = name || null;
}

function damage(s, amount) {
  s.hp = Math.max(0, s.hp - amount);
}
function heal(s, amount) {
  s.hp = Math.min(s.maxHp, s.hp + amount);
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}
function statMod(value) {
  return Math.floor(value / 2);
}

/* ---------------- Status effects ---------------- */
function addStatus(s, name) {
  if (!s.status) s.status = {};
  s.status[name] = true;
}
function removeStatus(s, name) {
  if (s.status) s.status[name] = false;
}
function hasStatus(s, name) {
  return !!(s.status && s.status[name]);
}
const STATUS_INFO = {
  wounded: { icon: '🩹', label: 'Wounded', desc: '-2 to all rolls until you rest or recover' },
  inspired: { icon: '✨', label: 'Inspired', desc: '+3 to your next roll (one-time)' },
  shaken: { icon: '😟', label: 'Shaken', desc: '-1 Empathy, -1 Honor while active' }
};

/* Class-based combat modifier: Ember hits harder in a fight, Bastion shrugs off damage, Wraith rolls more reliably. */
function classCheckModifier(s) {
  if (s.resonanceType === 'Ember') return 1;
  if (s.resonanceType === 'Wraith') return 1;
  return 0;
}
function classDamageReduction(s) {
  return s.resonanceType === 'Bastion' ? 5 : 0;
}

/* Performs a dice check, stores the result in state.flags.lastRoll for the next scene to narrate. */
function performCheck(s, statKey, dc) {
  const roll = rollD20();
  let mod = statMod(effectiveStat(s, statKey)) + classCheckModifier(s);
  if (hasStatus(s, 'wounded')) mod -= 2;
  let inspiredUsed = false;
  if (hasStatus(s, 'inspired')) { mod += 3; inspiredUsed = true; }
  const total = roll + mod;
  const success = total >= dc;
  if (inspiredUsed) removeStatus(s, 'inspired');
  s.flags.lastRoll = { statKey, roll, mod, total, dc, success };
  return success;
}
function applyCombatDamage(s, baseDamage) {
  const reduced = Math.max(0, baseDamage - classDamageReduction(s));
  damage(s, reduced);
  if (reduced > 0) {
    addStatus(s, 'wounded');
    wearEquipment(s, ['weapon'], 15);
    wearEquipment(s, ['helmet', 'chestplate', 'leggings'], 8);
  }
  if (s.hp > 0 && s.hp <= 20 && !s.flags.hasScar) {
    s.flags.hasScar = true;
    bump(s, { resolve: 1 });
  }
}
function renderDiceRollHtml(r) {
  if (!r) return '';
  const cls = r.success ? 'success' : 'fail';
  const modSign = r.mod >= 0 ? '+' : '';
  return `<div class="diceRoll ${cls}">🎲 Rolled ${r.roll} ${modSign}${r.mod} (${STAT_LABELS[r.statKey]}) = ${r.total} vs DC ${r.dc} — <b>${r.success ? 'Success' : 'Failure'}</b></div>`;
}

/* The Chapter 3 fight with Corin: harder DC if the team split up earlier, damage reduced if carrying the Stolen Blade. */
function resolveCorinFight(s) {
  const dc = s.flags.roughFight ? 14 : 10;
  const success = performCheck(s, 'resonance', dc);
  if (!success) {
    let dmg = s.flags.roughFight ? 35 : 20;
    if (hasItem(s, 'Stolen Blade')) dmg -= 5;
    applyCombatDamage(s, dmg);
    s.flags.deathContext = "the fight in Rangeholt's granary turns out to be more than you can handle";
  }
}

function snapshot(s, key) {
  s.flags[key] = { ...s.stats };
}

function deltaSince(s, key) {
  const snap = s.flags[key] || freshStats();
  const out = {};
  STAT_KEYS.forEach(k => out[k] = (s.stats[k] || 0) - (snap[k] || 0));
  return out;
}

const STAT_LABELS = {
  fame: 'Fame', charisma: 'Charisma', honor: 'Honor', luck: 'Luck', resolve: 'Resolve',
  empathy: 'Empathy', resonance: 'Resonance', corruption: 'Corruption', apathy: 'Apathy'
};

const PORTRAITS = {
  sable: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#3a1520"/>
    <circle cx="30" cy="34" r="14" fill="#e8b48c"/>
    <path d="M14 28 Q18 6 30 10 Q42 6 46 28 Q40 16 30 18 Q20 16 14 28 Z" fill="#c0203a"/>
    <path d="M8 22 Q6 34 14 40" stroke="#c0203a" stroke-width="4" fill="none"/>
    <path d="M52 22 Q54 34 46 40" stroke="#c0203a" stroke-width="4" fill="none"/>
    <circle cx="24" cy="34" r="2" fill="#2a1810"/><circle cx="36" cy="34" r="2" fill="#2a1810"/>
  </svg>`,
  thorne: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#12202e"/>
    <circle cx="30" cy="34" r="14" fill="#d8a878"/>
    <path d="M16 24 Q30 10 44 24 Q44 16 30 14 Q16 16 16 24 Z" fill="#5a4530"/>
    <path d="M30 46 L20 50 L20 40 L30 44 L40 40 L40 50 Z" fill="#4a6fa5"/>
    <circle cx="24" cy="34" r="2" fill="#2a1810"/><circle cx="36" cy="34" r="2" fill="#2a1810"/>
  </svg>`,
  denna: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#221530"/>
    <circle cx="30" cy="34" r="14" fill="#e0b090"/>
    <path d="M12 26 Q20 8 30 12 Q40 8 48 26 Q42 14 30 16 Q18 14 12 26 Z" fill="#3a2050"/>
    <path d="M12 26 L6 20 M48 26 L54 20" stroke="#3a2050" stroke-width="3"/>
    <circle cx="24" cy="34" r="2" fill="#2a1810"/><circle cx="36" cy="34" r="2" fill="#2a1810"/>
  </svg>`
};

const ACHIEVEMENTS = [
  { id: 'united', name: 'United', desc: 'Complete the story with the United ending.', check: (s) => s.flags.endingTier === 'united' },
  { id: 'costly', name: 'Costly Victory', desc: 'Complete the story with the Costly Victory ending.', check: (s) => s.flags.endingTier === 'costly' },
  { id: 'lost', name: 'What We Lost', desc: 'Complete the story with the What We Lost ending.', check: (s) => s.flags.endingTier === 'lost' },
  { id: 'fallen', name: 'Fallen', desc: 'Die in the field.', check: (s) => s.hp <= 0 },
  { id: 'packrat', name: 'Pack Rat', desc: 'Collect 4 or more items in a single playthrough.', check: (s) => s.inventory.length >= 4 },
  { id: 'completionist', name: 'Completionist', desc: 'Collect every optional item in a single playthrough.', check: (s) => s.inventory.length >= 8 },
  { id: 'silvertongue', name: 'Silver Tongue', desc: 'Reach Charisma 6 or higher.', check: (s) => effectiveStat(s, 'charisma') >= 6 },
  { id: 'truestrength', name: 'True Strength', desc: 'Reach Resonance 8 or higher.', check: (s) => effectiveStat(s, 'resonance') >= 8 },
  { id: 'untouchable', name: 'Untouchable', desc: 'Finish Chapter 4 without ever losing HP.', check: (s) => s.flags.endingTier && s.hp === s.maxHp },
  { id: 'honorbound', name: 'Honor Bound', desc: 'Reach Honor 8 or higher.', check: (s) => effectiveStat(s, 'honor') >= 8 },
  { id: 'corrupted', name: 'Corrupted', desc: 'Reach Corruption 6 or higher.', check: (s) => effectiveStat(s, 'corruption') >= 6 },
  { id: 'jobdone', name: 'Found Your Path', desc: 'Complete any Part Two career chapter.', check: (s) => !!s.flags.jobChoice2 },
  { id: 'closebond', name: 'Close Bond', desc: 'Reach Trust 5+ with any single teammate.', check: (s) => Object.values(s.trust || {}).some(v => v >= 5) },
];

function loadUnlockedAchievements() {
  try {
    const raw = localStorage.getItem('aurelia_achievements');
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function saveUnlockedAchievements(list) {
  try { localStorage.setItem('aurelia_achievements', JSON.stringify(list)); } catch (e) { /* ignore */ }
}
function checkAchievements(s) {
  const unlocked = new Set(loadUnlockedAchievements());
  let changed = false;
  ACHIEVEMENTS.forEach(a => {
    if (!unlocked.has(a.id) && a.check(s)) { unlocked.add(a.id); changed = true; }
  });
  if (changed) saveUnlockedAchievements([...unlocked]);
  return [...unlocked];
}

function renderRevealHtml(deltas) {
  return STAT_KEYS.map(k => {
    const v = deltas[k];
    const cls = v > 0 ? 'pos' : v < 0 ? 'neg' : 'zero';
    const sign = v > 0 ? '+' : '';
    return `<div class="statRow"><span class="statName">${STAT_LABELS[k]}</span><span class="statDelta ${cls}">${sign}${v}</span></div>`;
  }).join('');
}

/* Party banter — occasional short flavor lines from companions, purely cosmetic, no mechanical effect. */
const PARTY_BANTER = [
  `Sable: "You ever notice Thorne narrates his own fights under his breath? I timed it once. Very dramatic."`,
  `Thorne: "Denna's read the same field manual four times this week. I checked."`,
  `Denna: "Sable's 'foolproof plan' success rate is currently at thirty percent. I'm keeping a log."`,
  `Sable, to no one in particular: "I could take Thorne in a fair fight. Emphasis on 'fair.'"`,
  `Thorne: "I don't think Denna sleeps. I think she just recharges standing up, like a lamp."`,
  `Denna: "For the record, I said this exact plan would work three days ago. Nobody listened."`
];

function maybeBanter() {
  if (Math.random() < 0.25) {
    return PARTY_BANTER[Math.floor(Math.random() * PARTY_BANTER.length)];
  }
  return null;
}

/* Nemesis system — if corruption/apathy runs high enough by the end of Part One,
   a recurring antagonist starts appearing across Part Two, remembering who you became. */
function shouldNemesisAppear(s) {
  return (effectiveStat(s, 'corruption') + effectiveStat(s, 'apathy')) >= 8;
}

/* Companion reactions — teammates notice and comment on your accumulated stat profile.
   Thresholds are on cumulative totals, checked fresh at the end of every chapter. */
function getCompanionReaction(s) {
  const st = s.stats;
  const lines = [];

  if (st.corruption >= 5) {
    lines.push(`Denna pulls you aside, quiet, not accusing exactly. "You've been cutting corners. I've noticed. I'm not saying anything to Ashworth — yet. But I'm watching."`);
  } else if (st.corruption >= 2 && st.honor < st.corruption) {
    lines.push(`Denna watches you a beat too long during debrief, like she's recalculating something about you she hasn't said out loud.`);
  }

  if (st.apathy >= 5) {
    lines.push(`Thorne, of all people, is the one who says something. "You've gone quiet lately. Not in the good way." He doesn't push it further, but he doesn't look away either.`);
  } else if (st.apathy >= 2 && st.empathy < st.apathy) {
    lines.push(`Sable jokes less around you than she used to. You're not sure if you've noticed that, or just now let yourself.`);
  }

  if (st.empathy >= 6) {
    lines.push(`Sable bumps your shoulder on the way out. "You've got a soft spot under all that huntsman posturing. Don't lose it, okay?"`);
  }

  if (st.honor < -2) {
    lines.push(`Nobody says it outright, but the team's formation has shifted, subtly, over the past stretch — you're not quite in the center of it anymore.`);
  } else if (st.honor >= 6) {
    lines.push(`Thorne, unprompted, says: "People end up trusting you fast. I get why."`);
  }

  if (st.charisma >= 6) {
    lines.push(`The easy banter with your team has only gotten easier — half the jokes in the barracks these days somehow trace back to you.`);
  }

  if (st.resonance >= 6) {
    lines.push(`Denna clocks the shift in your Resonance work before you do. "You've gotten stronger. Noticeably. Careful with that."`);
  }

  if (st.corruption >= 5 && st.empathy >= 5) {
    lines.push(`It's a strange combination, the team's noticed — capable of real warmth, and also willing to cut corners nobody else would. They haven't decided yet what that adds up to.`);
  }

  if (s.flags.liedAboutBlade && (s.trust.denna || 0) < 0) {
    lines.push(`Denna still remembers that blade, and the lie that came with it. She's never said anything more about it — she also never fully let it go.`);
  }

  if (s.flags.hasScar) {
    lines.push(`Thorne's noticed the scar you've been carrying since that close call. He doesn't ask about it directly, but you catch him checking on you a little more carefully than before.`);
  }

  if (lines.length === 0) {
    lines.push(`The team doesn't say much about how you've been lately — steady, unremarkable, the kind of consistency nobody thinks to comment on.`);
  }

  return lines;
}

const storyEl = document.getElementById('story');
const chapterLabelEl = document.getElementById('chapterLabel');
const textAreaEl = document.getElementById('textArea');
const choicesEl = document.getElementById('choices');
const setupWrap = document.getElementById('setupWrap');
const restartRow = document.getElementById('restartRow');

const sheetToggle = document.getElementById('sheetToggle');
const sheetPanel = document.getElementById('sheetPanel');
const hpBarFill = document.getElementById('hpBarFill');
const hpText = document.getElementById('hpText');
const goldText = document.getElementById('goldText');
const statBarsList = document.getElementById('statBarsList');
const equipmentList = document.getElementById('equipmentList');
const companionCreatureText = document.getElementById('companionCreatureText');
const traitsList = document.getElementById('traitsList');
const statusList = document.getElementById('statusList');
const inventoryList = document.getElementById('inventoryList');
const companionsList = document.getElementById('companionsList');

const achievementsToggle = document.getElementById('achievementsToggle');
const achievementsPanel = document.getElementById('achievementsPanel');
const achievementsListEl = document.getElementById('achievementsList');

sheetToggle.addEventListener('click', () => sheetPanel.classList.toggle('open'));

/* ---------------- Settings ---------------- */
function loadSettings() {
  try {
    const raw = localStorage.getItem('aurelia_settings');
    return raw ? JSON.parse(raw) : { theme: 'dark', fontSize: 17 };
  } catch (e) { return { theme: 'dark', fontSize: 17 }; }
}
function saveSettings(settings) {
  try { localStorage.setItem('aurelia_settings', JSON.stringify(settings)); } catch (e) { /* ignore */ }
}
function applySettings(settings) {
  document.body.classList.toggle('light-theme', settings.theme === 'light');
  document.getElementById('themeToggleBtn').textContent = settings.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  document.getElementById('textArea').style.fontSize = settings.fontSize + 'px';
  document.getElementById('fontSizeSlider').value = settings.fontSize;
}

let currentSettings = loadSettings();
applySettings(currentSettings);

document.getElementById('settingsToggle').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.toggle('open');
});
document.getElementById('themeToggleBtn').addEventListener('click', () => {
  currentSettings.theme = currentSettings.theme === 'light' ? 'dark' : 'light';
  saveSettings(currentSettings);
  applySettings(currentSettings);
});
document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
  currentSettings.fontSize = parseInt(e.target.value, 10);
  saveSettings(currentSettings);
  applySettings(currentSettings);
});

document.getElementById('saveGameBtn').addEventListener('click', () => {
  saveGame(state, currentSceneId);
  const toast = document.getElementById('saveToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1400);
});
achievementsToggle.addEventListener('click', () => {
  renderAchievementsPanel();
  achievementsPanel.classList.toggle('open');
});

function renderAchievementsPanel() {
  const unlocked = new Set(loadUnlockedAchievements());
  achievementsListEl.innerHTML = ACHIEVEMENTS.map(a => {
    const isUnlocked = unlocked.has(a.id);
    return `<div class="achRow ${isUnlocked ? '' : 'locked'}">
      <div class="achIcon">${isUnlocked ? '🏆' : '🔒'}</div>
      <div>
        <div class="achName">${a.name}</div>
        <div class="achDesc">${a.desc}</div>
      </div>
    </div>`;
  }).join('');
}

function statBarPercent(value) {
  return Math.max(0, Math.min(100, ((value + 10) / 25) * 100));
}

function refreshCharacterSheet(s) {
  const hpPct = Math.max(0, Math.min(100, (s.hp / s.maxHp) * 100));
  hpBarFill.style.width = hpPct + '%';
  hpText.textContent = `${s.hp} / ${s.maxHp}`;
  goldText.textContent = `${s.gold || 0} 🪙`;

  const miniHud = document.getElementById('miniHud');
  miniHud.style.display = 'flex';
  miniHud.innerHTML = `
    <div class="hudItem">❤️ <div class="hudHpBarWrap"><div class="hudHpBarFill" style="width:${hpPct}%"></div></div> ${s.hp}/${s.maxHp}</div>
    <div class="hudItem">🪙 ${s.gold || 0}</div>
    <div class="hudItem">✨ ${s.resonanceType || ''}</div>
  `;

  statBarsList.innerHTML = STAT_KEYS.map(k => {
    const v = effectiveStat(s, k);
    const pct = statBarPercent(v);
    return `<div class="miniStatRow">
      <div class="miniStatLabel">${STAT_LABELS[k]}</div>
      <div class="miniStatBarWrap"><div class="miniStatBarFill" style="width:${pct}%"></div></div>
      <div class="miniStatVal">${v}</div>
    </div>`;
  }).join('');

  inventoryList.innerHTML = s.inventory.length
    ? s.inventory.map(item => `<div>${item}${ITEM_SLOT[item] ? '' : ' <span style="color:var(--muted);font-size:11px;">(trade item)</span>'}</div>`).join('')
    : `<div class="emptyNote">Nothing yet</div>`;

  companionCreatureText.innerHTML = s.companionCreature
    ? `<div>${s.companionCreature} <span style="color:var(--muted);font-size:11px;">(+1 Resolve, +1 Luck)</span></div>`
    : `<div class="emptyNote">None yet</div>`;

  traitsList.innerHTML = s.flags.hasScar
    ? `<div>Battle-Scarred <span style="color:var(--muted);font-size:11px;">(survived a near-death moment; +1 Resolve, permanent)</span></div>`
    : `<div class="emptyNote">None yet</div>`;

  equipmentList.innerHTML = '';
  EQUIPMENT_SLOTS.forEach(slot => {
    const owned = s.inventory.filter(i => ITEM_SLOT[i] === slot);
    const row = document.createElement('div');
    row.className = 'equipRow';
    const select = document.createElement('select');
    select.className = 'equipSelect';
    const noneOpt = document.createElement('option');
    noneOpt.value = '';
    noneOpt.textContent = '(empty)';
    select.appendChild(noneOpt);
    owned.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item;
      const dur = getDurability(s, item);
      opt.textContent = `${item} (${dur}%${dur <= 0 ? ' BROKEN' : ''})`;
      if (s.equipment[slot] === item) opt.selected = true;
      select.appendChild(opt);
    });
    if (!s.equipment[slot]) noneOpt.selected = true;
    select.addEventListener('change', () => {
      equipItem(s, slot, select.value);
      refreshCharacterSheet(s);
      saveGame(s, currentSceneId);
    });
    row.innerHTML = `<div class="equipSlotLabel">${SLOT_LABELS[slot]}</div>`;
    row.appendChild(select);
    equipmentList.appendChild(row);
  });

  const activeStatuses = Object.keys(STATUS_INFO).filter(k => hasStatus(s, k));
  statusList.innerHTML = activeStatuses.length
    ? activeStatuses.map(k => `<div class="statusBadge"><span class="icon">${STATUS_INFO[k].icon}</span><div><div class="label">${STATUS_INFO[k].label}</div><div class="desc">${STATUS_INFO[k].desc}</div></div></div>`).join('')
    : `<div class="emptyNote">None active</div>`;

  const companions = [
    { key: 'sable', name: 'Sable' },
    { key: 'thorne', name: 'Thorne' },
    { key: 'denna', name: 'Denna' }
  ];
  companionsList.innerHTML = companions.map(c => {
    const trustVal = (s.trust && s.trust[c.key]) || 0;
    const pct = statBarPercent(trustVal);
    return `<div class="companionCard">
      <div class="companionPortrait">${PORTRAITS[c.key]}</div>
      <div class="companionInfo">
        <div class="companionName">${c.name}</div>
        <div class="companionTrustBarWrap"><div class="companionTrustBarFill" style="width:${pct}%"></div></div>
      </div>
    </div>`;
  }).join('');
}

/* ============================== SETUP ============================== */
document.getElementById('nameNextBtn').addEventListener('click', () => {
  const val = document.getElementById('nameInput').value.trim();
  state.name = val || "the recruit";
  document.getElementById('setupStep1').style.display = 'none';
  document.getElementById('setupStepOrigin').style.display = 'block';
});

const ORIGIN_BONUSES = {
  streets: { luck: 1, charisma: 1 },
  village: { empathy: 1, honor: 1 },
  caravan: { charisma: 1, resolve: 1 },
  military: { resolve: 1, honor: 1 }
};

document.querySelectorAll('.resOption[data-origin]').forEach(el => {
  el.addEventListener('click', () => {
    state.origin = el.dataset.origin;
    bump(state, ORIGIN_BONUSES[state.origin]);
    document.getElementById('setupStepOrigin').style.display = 'none';
    document.getElementById('setupStep2').style.display = 'block';
  });
});

document.querySelectorAll('.resOption[data-res]').forEach(el => {
  el.addEventListener('click', () => {
    state.resonanceType = el.dataset.res;
    if (state.resonanceType === 'Ember') bump(state, { resonance: 2 });
    else if (state.resonanceType === 'Bastion') { bump(state, { resolve: 2, honor: 1 }); }
    else if (state.resonanceType === 'Wraith') { bump(state, { luck: 2, charisma: 1 }); }
    snapshot(state, 'snap_ch1');
    saveCheckpoint('ch1', state, 'c1_1');
    setupWrap.style.display = 'none';
    storyEl.style.display = 'block';
    restartRow.style.display = 'block';
    goTo('c1_1');
  });
});

document.getElementById('restartBtn').addEventListener('click', () => { clearSavedGame(); location.reload(); });

function formatSavedAt(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* Renders the 3 save slots into a container. mode 'initial' = pre-game screen (Load / New Game Here).
   mode 'mid' = in-game management panel (Save Here / Load / Delete). */
function renderSlotRows(container, mode) {
  container.innerHTML = '';
  SAVE_SLOT_KEYS.forEach((key, i) => {
    const data = loadSlot(key);
    const row = document.createElement('div');
    row.className = 'slotRow';
    if (data) {
      row.innerHTML = `<div class="slotTitle">Slot ${i + 1}: ${data.name || 'Unnamed'}</div>
        <div class="slotMeta">${data.chapterLabel || ''}${data.savedAt ? ' • ' + formatSavedAt(data.savedAt) : ''}</div>`;
      const btns = document.createElement('div');
      btns.className = 'slotBtns';
      const loadBtn = document.createElement('button');
      loadBtn.textContent = 'Load';
      loadBtn.addEventListener('click', () => {
        currentSlot = key;
        state = data.state;
        setupWrap.style.display = 'none';
        storyEl.style.display = 'block';
        restartRow.style.display = 'block';
        goTo(data.sceneId);
      });
      btns.appendChild(loadBtn);
      if (mode === 'mid') {
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Here';
        saveBtn.addEventListener('click', () => {
          currentSlot = key;
          saveGame(state, currentSceneId);
          renderSlotRows(container, mode);
        });
        btns.appendChild(saveBtn);
      }
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.className = 'danger';
      delBtn.addEventListener('click', () => {
        clearSlot(key);
        renderSlotRows(container, mode);
        if (mode === 'initial') maybeShowContinueScreen();
      });
      btns.appendChild(delBtn);
      row.appendChild(btns);
    } else {
      row.innerHTML = `<div class="slotTitle">Slot ${i + 1}: Empty</div>`;
      const btns = document.createElement('div');
      btns.className = 'slotBtns';
      if (mode === 'initial') {
        const newBtn = document.createElement('button');
        newBtn.textContent = 'New Game Here';
        newBtn.addEventListener('click', () => {
          currentSlot = key;
          document.getElementById('continueScreen').style.display = 'none';
          document.getElementById('setupStep1').style.display = 'block';
        });
        btns.appendChild(newBtn);
      } else {
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Here';
        saveBtn.addEventListener('click', () => {
          currentSlot = key;
          saveGame(state, currentSceneId);
          renderSlotRows(container, mode);
        });
        btns.appendChild(saveBtn);
      }
      row.appendChild(btns);
    }
    container.appendChild(row);
  });
}

function renderChapterSelectList() {
  const container = document.getElementById('chapterSelectList');
  const wrap = document.getElementById('chapterSelectWrap');
  const keys = Object.keys(CHECKPOINT_KEYS);
  const available = keys.filter(k => loadCheckpoint(k));
  if (available.length === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  container.innerHTML = '';
  available.forEach(key => {
    const data = loadCheckpoint(key);
    const row = document.createElement('div');
    row.className = 'slotRow';
    row.innerHTML = `<div class="slotTitle">${CHECKPOINT_LABELS[key]}</div>
      <div class="slotMeta">${data.name ? 'as ' + data.state.name : ''}${data.savedAt ? ' • reached ' + formatSavedAt(data.savedAt) : ''}</div>`;
    const btns = document.createElement('div');
    btns.className = 'slotBtns';
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play From Here';
    playBtn.addEventListener('click', () => {
      currentSlot = SAVE_SLOT_KEYS[0];
      state = JSON.parse(JSON.stringify(data.state));
      setupWrap.style.display = 'none';
      storyEl.style.display = 'block';
      restartRow.style.display = 'block';
      goTo(data.sceneId);
    });
    btns.appendChild(playBtn);
    row.appendChild(btns);
    container.appendChild(row);
  });
}

function maybeShowContinueScreen() {
  const hasSaves = anySaveExists();
  const hasCheckpoints = anyCheckpointExists();
  if (hasSaves || hasCheckpoints) {
    renderSlotRows(document.getElementById('slotList'), 'initial');
    renderChapterSelectList();
    document.getElementById('continueScreen').style.display = 'block';
    document.getElementById('setupStep1').style.display = 'none';
  } else {
    document.getElementById('continueScreen').style.display = 'none';
    document.getElementById('setupStep1').style.display = 'block';
  }
}
maybeShowContinueScreen();

const saveSlotsToggle = document.getElementById('saveSlotsToggle');
const saveSlotsPanel = document.getElementById('saveSlotsPanel');
saveSlotsToggle.addEventListener('click', () => {
  renderSlotRows(document.getElementById('saveSlotsPanelList'), 'mid');
  saveSlotsPanel.classList.toggle('open');
});

/* ============================== ENGINE ============================== */
function goTo(sceneId) {
  if (sceneId === "__restart__") { clearSavedGame(); location.reload(); return; }
  const scene = SCENES[sceneId];
  if (!scene) { console.error('Missing scene', sceneId); return; }
  currentSceneId = sceneId;
  chapterLabelEl.textContent = typeof scene.chapter === 'function' ? scene.chapter(state) : (scene.chapter || '');
  const paragraphs = typeof scene.text === 'function' ? scene.text(state) : scene.text;
  textAreaEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
  choicesEl.innerHTML = '';
  const choices = typeof scene.choices === 'function' ? scene.choices(state) : scene.choices;
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choiceBtn';

    const statLocked = choice.requires && effectiveStat(state, choice.requires.stat) < choice.requires.min;
    const classLocked = choice.requiresClass && state.resonanceType !== choice.requiresClass;
    const goldLocked = choice.requiresGold && (state.gold || 0) < choice.requiresGold;
    const originLocked = choice.requiresOrigin && state.origin !== choice.requiresOrigin;
    const locked = statLocked || classLocked || goldLocked || originLocked;

    if (locked) {
      btn.classList.add('locked');
      if (statLocked) {
        btn.innerHTML = `${choice.label}<span class="lockNote">🔒 Requires ${STAT_LABELS[choice.requires.stat]} ${choice.requires.min}+ (you have ${effectiveStat(state, choice.requires.stat)})</span>`;
      } else if (classLocked) {
        btn.innerHTML = `${choice.label}<span class="lockNote">🔒 Requires ${choice.requiresClass} Resonance</span>`;
      } else if (originLocked) {
        btn.innerHTML = `${choice.label}<span class="lockNote">🔒 Requires a different upbringing</span>`;
      } else {
        btn.innerHTML = `${choice.label}<span class="lockNote">🔒 Requires ${choice.requiresGold} gold (you have ${state.gold || 0})</span>`;
      }
    } else {
      btn.textContent = choice.label;
      btn.addEventListener('click', () => {
        if (choice.effect) choice.effect(state);
        refreshCharacterSheet(state);
        goTo(typeof choice.next === 'function' ? choice.next(state) : choice.next);
      });
    }
    choicesEl.appendChild(btn);
  });
  refreshCharacterSheet(state);
  checkAchievements(state);
  saveGame(state, currentSceneId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function N() { return state.name; }

/* Picks a companion solo scene based on whoever's trust is highest and above threshold; ties broken Sable > Thorne > Denna. */
function pickSoloScene(s) {
  const t = s.trust || {};
  const candidates = [
    { key: 'sable', scene: 'c2_solo_sable', val: t.sable || 0 },
    { key: 'thorne', scene: 'c2_solo_thorne', val: t.thorne || 0 },
    { key: 'denna', scene: 'c2_solo_denna', val: t.denna || 0 }
  ];
  const eligible = candidates.filter(c => c.val >= 4).sort((a, b) => b.val - a.val);
  return eligible.length ? eligible[0].scene : 'c3_1';
}

/* Picks which former teammate cameos in a Part Two job arc, based on whoever had highest Part One trust.
   Falls back to Denna if all trust is flat (fits her analytical/investigative skill set). */
function pickCameo(s) {
  const t = s.trust || {};
  const candidates = [
    { key: 'sable', name: 'Sable', val: t.sable || 0 },
    { key: 'thorne', name: 'Thorne', val: t.thorne || 0 },
    { key: 'denna', name: 'Denna', val: t.denna || 0 }
  ];
  candidates.sort((a, b) => b.val - a.val);
  return candidates[0].val > 0 ? candidates[0] : { key: 'denna', name: 'Denna', val: 0 };
}
function teamName(s) {
  const playerInitial = (s.name || '').trim().charAt(0).toUpperCase() || 'X';
  return 'SDT' + playerInitial;
}

/* ============================== SCENES ============================== */

/* The SCENES object is populated by js/scenes/*.js, loaded after this file. */
const SCENES = {};
