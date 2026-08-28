# Aurelia Academy: A Huntsman's Path

An original interactive text-adventure RPG, built entirely in vanilla HTML/CSS/JS with no build step, no dependencies. Open `index.html` in a browser and play.

Inspired by the "huntsmen at a combat academy" aesthetic (aura/semblance style powers, a Hollow hunting world), but with an entirely original cast, world, and story.

## How to play

Just open `index.html` in Chrome or Firefox. The game should run client side once you do that.

If you'd rather not download anything, you can also host this repo on **GitHub Pages** (Settings → Pages → deploy from the `main` branch) and play it straight from a URL.

## What's in it

- **Part One** - a 4-chapter original story (40 decisions) with hidden stat tracking across 9 stats (Fame, Charisma, Honor, Luck, Resolve, Empathy, Resonance, Corruption, Apathy), 3 playable classes with real mechanical differences, dice-roll combat, a full companion trust/romance-adjacent system, a recurring rival, an adoptable companion creature, and 3 distinct endings.
- **Part Two** - your ending unlocks a career. Three jobs currently have full 4-chapter arcs of their own (**Council Investigator**, **Bandit Crew Leader**, **Kingdom Guard Elite**), each with scaled-up skill checks, item trade-ins, a returning Part One teammate as a cameo, a 3-stage boss encounter, and 3 unique endings. The other 6 jobs (Instructor, Frontier Huntsman, Mercenary, Security, Dealer, Bounty Hunter) currently have a shorter single-chapter epilogue, with more arcs planned.
- **RPG systems** - HP, equipment slots (weapon/helmet/chestplate/leggings/accessory) with durability and repair, a gold economy with a shop and a gambling den, save slots (3, with a Chapter Select checkpoint system), achievements, a settings panel, and more.

## File structure

```
index.html              - page shell, loads everything below in order
css/
  style.css              - all styling
js/
  engine.js              - game state, all core helper functions, the
                           rendering engine, and all UI/panel wiring
  scenes/
    part-one.js           - Chapters 1–4, side quests, job selection
    jobs-shared.js        - shop, gambling den, generic job-epilogue flow
    council.js            - Council Investigator arc
    bandit.js              - Bandit Crew Leader arc
    guard.js                - Kingdom Guard Elite arc
  jobs-data.js            - ending-tier logic + the 6 shorter jobs' data
```

Everything is loaded as plain `<script>` tags (no bundler, no modules) so the whole thing works by just opening the HTML file — no server required. `js/engine.js` must load first since it declares the shared `SCENES` object that each `js/scenes/*.js` file adds to.

## Contributing / extending

The remaining 6 jobs are built out to the same "single epilogue chapter" depth as the original design; expanding any of them to a full 4-chapter arc just means following the pattern already established in `js/scenes/council.js` (the smallest/cleanest of the three full arcs to use as a template).
