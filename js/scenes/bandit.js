/* =========================================================
   PART TWO - BANDIT CREW LEADER ARC
   4 chapters, 10 decisions each.
   ========================================================= */

Object.assign(SCENES, {

bandit_ch1_1: {
  chapter: "Bandit Ch.1 - The Crew",
  text: () => [
    `The crew's hideout is a converted grain silo two days from anywhere official. Rook's already up when you wake - always is. "Wagon's coming through the pass at midday," he says. "Yours to plan."`
  ],
  choices: [
    { label: "Plan it meticulously, every contingency covered", next: "bandit_ch1_2", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Keep it loose - improvise when it matters", next: "bandit_ch1_2", effect: (s) => bump(s, { luck: 1 }) }
  ]
},


bandit_ch1_2: {
  chapter: "Bandit Ch.1 - The Crew",
  text: () => [
    `Rook's been doing this longer than you've been alive, near enough. He doesn't need to be told what to do, but he waits to hear it from you anyway - testing, maybe, or just being thorough.`
  ],
  choices: [
    { label: "Ask for his read on the plan first", next: "bandit_ch1_3", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Lay out the plan and expect him to follow it", next: "bandit_ch1_3", effect: (s) => bump(s, { fame: 1 }) }
  ]
},


bandit_ch1_3: {
  chapter: "Bandit Ch.1 - The Crew",
  text: () => [
    `Fen's practically vibrating with energy, young and eager to prove himself, itching to take point on something bigger than he's ready for.`
  ],
  choices: [
    { label: "Rein him in - keep him on lookout duty", next: "bandit_ch1_4", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Let him take point - he'll learn faster that way", next: "bandit_ch1_4", effect: (s) => { bump(s, { luck: -1 }); } }
  ]
},


bandit_ch1_4: {
  chapter: "Bandit Ch.1 - The Crew",
  text: (s) => hasItem(s, 'Ridgeback Scale')
    ? [`Pockets, the crew's fence, spots the Ridgeback scale you've kept since your academy days. "Collectors pay stupid money for real Hollow trophies," he says. "Or keep it. Not my business."`]
    : [`Pockets doesn't have much worth your time today - no trades on offer.`],
  choices: (s) => {
    if (!hasItem(s, 'Ridgeback Scale')) return [{ label: "Continue", next: "bandit_ch1_5" }];
    return [
      { label: "Trade the scale for a Bandit's Cloak", next: "bandit_ch1_5", effect: (st) => {
          removeItem(st, 'Ridgeback Scale');
          addItem(st, "Bandit's Cloak");
        } },
      { label: "Keep it - it's not for sale", next: "bandit_ch1_5", effect: (st) => bump(st, { honor: 1 }) }
    ];
  }
},


bandit_ch1_5: {
  chapter: "Bandit Ch.1 - The Crew",
  text: () => [
    `Scouting the pass road, the wagon's guard detail is lighter than expected - an opportunity, or a trap being too obvious not to be one.`
  ],
  choices: (s) => {
    const base = [
      { label: "Trust it - hit the wagon as planned", next: "bandit_ch1_6", effect: (st) => bump(st, { resolve: 1 }) },
      { label: "Hold back and watch a while longer first", next: "bandit_ch1_6", effect: (st) => bump(st, { luck: 1 }) }
    ];
    base.push({
      label: "Your gut's never been wrong about this kind of thing",
      requires: { stat: 'luck', min: 7 },
      next: "bandit_ch1_6",
      effect: (st) => bump(st, { luck: 1, resolve: 1 })
    });
    return base;
  }
},


bandit_ch1_6: {
  chapter: "Bandit Ch.1 - The Crew",
  text: () => [
    `Fen wants to hit a second, bigger target the same day, riding the momentum. Rook's visibly against it without saying so directly.`
  ],
  choices: [
    { label: "Shut it down - one job a day, no exceptions", next: "bandit_ch1_7", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Let him make the case, hear him out", next: "bandit_ch1_7", effect: (s) => bump(s, { charisma: 1, corruption: 1 }) }
  ]
},


bandit_ch1_7: {
  chapter: "Bandit Ch.1 - The Crew",
  text: (s) => {
    const success = performCheck(s, 'resonance', 13);
    const r = s.flags.lastRoll;
    if (!success) {
      applyCombatDamage(s, 18);
      return [renderDiceRollHtml(r), `The wagon guards weren't as light as scouted after all - it was closer to a trap than an opportunity, and you take a real hit getting clear with anything at all.`];
    }
    return [renderDiceRollHtml(r), `The hit goes clean, faster than the guards can properly react. Rook's already loading the take before the dust settles.`];
  },
  choices: (s) => s.hp <= 0 ? [{ label: "...", next: "game_over" }] : [{ label: "Continue", next: "bandit_ch1_8" }]
},


bandit_ch1_8: {
  chapter: "Bandit Ch.1 - The Crew",
  text: () => [
    `Back at the silo, it's time to split what you took. The crew's watching to see how you handle it.`
  ],
  choices: [
    { label: "Split it evenly, yourself included", next: "bandit_ch1_9", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Take a leader's cut off the top first", next: "bandit_ch1_9", effect: (s) => bump(s, { corruption: 1, fame: 1 }) }
  ]
},


bandit_ch1_9: {
  chapter: "Bandit Ch.1 - The Crew",
  text: () => [
    `A rider watches the silo from the ridgeline for longer than feels casual before finally moving on - someone else's crew, marking territory or just curious.`
  ],
  choices: [
    { label: "Send someone to find out who that was", next: "bandit_ch1_10", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Let it go - probably nothing", next: "bandit_ch1_10", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


bandit_ch1_10: {
  chapter: "Bandit Ch.1 - The Crew",
  text: () => [
    `Around the fire that night, the crew's looser than usual, the day's take putting everyone in a good mood. Rook raises a cup in your direction, quiet approval more than celebration.`
  ],
  choices: [
    { label: "Sit with the crew, let the night be what it is", next: "bandit_ch1_reveal", effect: (s) => bump(s, { charisma: 1 }) },
    { label: "Keep watch yourself - someone should", next: "bandit_ch1_reveal", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


bandit_ch1_reveal: {
  chapter: "Bandit Ch.1 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_bandit1');
    bumpGold(s, 100);
    return [
      `The wagon's cargo turns out to be worth more than expected once Pockets moves it - and word of the rider on the ridge doesn't sit right with Rook, whatever he says out loud.`,
      `<b>Chapter 1 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>You've earned 100 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "bandit_hub_1" }
  ]
},


bandit_hub_1: {
  chapter: "The Silo - Between Jobs",
  text: (s) => [
    `A quiet stretch before the next move. Time to patch up, spend what you've got, and hear what's floating around the camp.`,
    `<i>Word is a Council investigator cracked a corruption case wide open somewhere north. Somewhere else, a mercenary's stuck juggling two contracts on the same job.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Patch yourself up to full HP", requiresGold: 50, next: "bandit_hub_1", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See the crew's healer to cure Wounded", requiresGold: 30, next: "bandit_hub_1", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'bandit_hub_1'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'bandit_hub_1'; } });
    opts.push({ label: "Continue to Chapter 2", next: "bandit_ch2_1", effect: (st) => snapshot(st, 'snap_bandit2') });
    return opts;
  }
},

/* ---------------- CHAPTER 2: OLD DEBTS ---------------- */


bandit_ch2_1: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: () => [
    `A messenger finds the silo, not easy to do, carrying word of a debt you thought was long buried, from someone who apparently disagrees.`
  ],
  choices: [
    { label: "Face it head-on, whatever it costs", next: "bandit_ch2_2", effect: (s) => bump(s, { resolve: 1, honor: 1 }) },
    { label: "Try to make it quietly disappear instead", next: "bandit_ch2_2", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


bandit_ch2_2: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: () => [
    `Rook's dealt with debt collectors before. His advice is blunt: "Pay it, run from it, or end it. Anything else just delays which one you pick."`
  ],
  choices: [
    { label: "Take his advice seriously", next: "bandit_ch2_3", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Tell him you've got your own plan", next: "bandit_ch2_3", effect: (s) => bump(s, { charisma: 1 }) }
  ]
},


bandit_ch2_3: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: () => [
    `Whatever this debt actually is, you want a second opinion - someone from before all this, who knew you when things were simpler.`
  ],
  choices: [
    { label: "Reach out to your old teammate", next: "bandit_ch2_4", effect: (s) => bump(s, { empathy: 1 }) }
  ]
},


bandit_ch2_4: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: (s) => {
    const cameo = pickCameo(s);
    s.flags.cameoName = cameo.name;
    s.flags.cameoKey = cameo.key;
    const lines = {
      sable: `Sable doesn't hesitate to come, which somehow makes it worse. "You could've called sooner," she says, taking in the silo, the crew, all of it without much judgment in her face. "So what did you get yourself into?"`,
      thorne: `Thorne shows up armed, which is either concerning or exactly right given where you live now. "Whatever this is," he says, "I'm not leaving until it's handled."`,
      denna: `Denna surveys the whole operation with open academic interest before getting to the point. "This debt," she says. "Tell me everything. I'll tell you if it's actually as bad as it sounds."`
    };
    return [lines[cameo.key]];
  },
  choices: [
    { label: "Let them see this life honestly, no performance", next: "bandit_ch2_5", effect: (s) => bumpTrust(s, { [s.flags.cameoKey]: 1 }) },
    { label: "Downplay how deep you're actually in", next: "bandit_ch2_5", effect: (s) => { bump(s, { corruption: 1 }); bumpTrust(s, { [s.flags.cameoKey]: -1 }); } }
  ]
},


bandit_ch2_5: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: (s) => hasItem(s, "Vesk's Notes")
    ? [`You still have Vesk's actual notes from the quarry, all this time later. Turns out they're worth something concrete here - leverage against the very network this debt traces back to.`]
    : [`Without hard proof of anything, you're negotiating from a weaker position than you'd like.`],
  choices: (s) => {
    if (!hasItem(s, "Vesk's Notes")) return [{ label: "Continue", next: "bandit_ch2_6" }];
    return [
      { label: "Use the notes as leverage against the debt", next: "bandit_ch2_6", effect: (st) => {
          removeItem(st, "Vesk's Notes");
          bump(st, { resonance: 1, resolve: 1 });
        } },
      { label: "Keep them hidden - too valuable to spend yet", next: "bandit_ch2_6", effect: (st) => bump(st, { corruption: 1 }) }
    ];
  }
},


bandit_ch2_6: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: () => [
    `Fen's been listening to more than he should, and he's decided the debt collector needs a message sent instead of a negotiation.`
  ],
  choices: (s) => {
    const base = [
      { label: "Shut that down before it becomes a real problem", next: "bandit_ch2_7", effect: (st) => bump(st, { honor: 1 }) },
      { label: "Let his loyalty burn a little hotter, unchecked", next: "bandit_ch2_7", effect: (st) => bump(st, { corruption: 1 }) }
    ];
    base.push({
      label: "Talk him down - he'll actually listen to you",
      requires: { stat: 'charisma', min: 7 },
      next: "bandit_ch2_7",
      effect: (st) => bump(st, { charisma: 1, honor: 1 })
    });
    return base;
  }
},


bandit_ch2_7: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: (s) => {
    const success = performCheck(s, 'charisma', 14);
    const r = s.flags.lastRoll;
    if (!success) {
      return [renderDiceRollHtml(r), `The debt collector isn't interested in reason today, and the meeting goes worse than planned - nothing physical, but the terms on the table afterward are harsher than they should be.`];
    }
    return [renderDiceRollHtml(r), `You talk the collector down further than you had any right to expect. Rook looks almost impressed, which for him is a lot.`];
  },
  choices: [{ label: "Continue", next: "bandit_ch2_8" }]
},


bandit_ch2_8: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: () => [
    `Turns out someone else got caught in the middle of this debt - a bystander who owes nothing but ended up on the collector's list anyway, through no fault of their own.`
  ],
  choices: [
    { label: "Cover their share too, whatever the cost", next: "bandit_ch2_9", effect: (s) => bump(s, { honor: 1, empathy: 1 }) },
    { label: "Not your problem to solve - focus on your own", next: "bandit_ch2_9", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


bandit_ch2_9: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: () => [
    `The debt's settled, one way or another. What's left is deciding how to talk about it afterward, to the crew and to yourself.`
  ],
  choices: [
    { label: "Be straight with the crew about what it cost", next: "bandit_ch2_10", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Let them believe it was cleaner than it was", next: "bandit_ch2_10", effect: (s) => bump(s, { corruption: 1, fame: 1 }) }
  ]
},


bandit_ch2_10: {
  chapter: "Bandit Ch.2 - Old Debts",
  text: (s) => [
    `${s.flags.cameoName} heads out before dawn. "This life's going to catch up with you eventually," they say - not a threat, just an honest read. "Just make sure it's on your terms when it does."`
  ],
  choices: [
    { label: "Continue", next: "bandit_ch2_reveal", effect: (s) => bumpTrust(s, { [s.flags.cameoKey]: 1 }) }
  ]
},


bandit_ch2_reveal: {
  chapter: "Bandit Ch.2 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_bandit2');
    bumpGold(s, 125);
    return [
      `The debt's closed, for now. But word of it traveled further than you'd like - including, apparently, to a rival crew leader named Silt who's been expanding into territory that used to be nobody's.`,
      `<b>Chapter 2 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>You've earned 125 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "bandit_hub_2" }
  ]
},


bandit_hub_2: {
  chapter: "The Silo - Between Jobs",
  text: (s) => [
    `Silt's name keeps coming up. Worth preparing before it becomes unavoidable.`,
    `<i>Somewhere, apparently, an academy instructor turned around a struggling first-year this term. A frontier huntsman is holding an undersupplied outpost together through sheer stubbornness.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Patch yourself up to full HP", requiresGold: 50, next: "bandit_hub_2", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See the crew's healer to cure Wounded", requiresGold: 30, next: "bandit_hub_2", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'bandit_hub_2'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'bandit_hub_2'; } });
    opts.push({ label: "Continue to Chapter 3", next: "bandit_ch3_1", effect: (st) => snapshot(st, 'snap_bandit3') });
    return opts;
  }
},

/* ---------------- CHAPTER 3: THE SQUEEZE ---------------- */


bandit_ch3_1: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `Silt's people hit one of your usual routes - not a raid exactly, more a message: this territory has a new owner now, if you let it.`
  ],
  choices: [
    { label: "Send a message back just as clear", next: "bandit_ch3_2", effect: (s) => bump(s, { resolve: 1, resonance: 1 }) },
    { label: "Reach out to negotiate territory instead", next: "bandit_ch3_2", effect: (s) => bump(s, { charisma: 1 }) }
  ]
},


bandit_ch3_2: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `Rook wants to talk this through properly before anyone does anything permanent. Fen wants to hit Silt's people before they finish organizing.`
  ],
  choices: [
    { label: "Side with Rook - talk first", next: "bandit_ch3_3", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Side with Fen - strike first", next: "bandit_ch3_3", effect: (s) => bump(s, { corruption: 1, resonance: 1 }) }
  ]
},


bandit_ch3_3: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `One of your crew's been quietly talking to Silt's people - whether out of fear, ambition, or a genuine belief the writing's on the wall, it's hard to say yet.`
  ],
  choices: (s) => {
    const base = [
      { label: "Confront them directly, give them a chance to explain", next: "bandit_ch3_4", effect: (st) => bump(st, { honor: 1 }) },
      { label: "Cut them loose immediately, no discussion", next: "bandit_ch3_4", effect: (st) => bump(st, { apathy: 1, corruption: 1 }) }
    ];
    base.push({
      label: "Win them back - you know exactly what to say",
      requires: { stat: 'charisma', min: 8 },
      next: "bandit_ch3_4",
      effect: (st) => bump(st, { charisma: 2 })
    });
    return base;
  }
},


bandit_ch3_4: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `Silt agrees to a sit-down, on neutral ground, ostensibly to talk terms. Rook doesn't trust it. You're not sure you do either.`
  ],
  choices: [
    { label: "Go in with the whole crew behind you", next: "bandit_ch3_5", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Go in alone - shows confidence, or foolishness", next: "bandit_ch3_5", effect: (s) => bump(s, { fame: 1, luck: -1 }) }
  ]
},


bandit_ch3_5: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `Silt turns out to be sharper than the reputation suggested - calm, precise, testing you the entire conversation without ever quite showing a hand.`
  ],
  choices: (s) => {
    const success = performCheck(s, 'charisma', 15);
    const r = s.flags.lastRoll;
    if (!success) {
      return [renderDiceRollHtml(r), `Silt reads you better than you read them. The terms that come out of this sit-down favor Silt more than you'd like.`];
    }
    return [renderDiceRollHtml(r), `You hold your own, giving away less than Silt was hoping for. The terms end up closer to even than Silt expected.`];
  },
  choices: [{ label: "Continue", next: "bandit_ch3_6" }]
},


bandit_ch3_6: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `The talks break down anyway - Silt was never going to settle for even. It's going to come to a real fight, sooner rather than later.`
  ],
  choices: [
    { label: "Prepare the crew properly, no shortcuts", next: "bandit_ch3_7", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Move fast - hit Silt before Silt hits you", next: "bandit_ch3_7", effect: (s) => bump(s, { resonance: 1, corruption: 1 }) }
  ]
},


bandit_ch3_7: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: (s) => {
    const success = performCheck(s, 'resonance', 15);
    const r = s.flags.lastRoll;
    if (!success) {
      applyCombatDamage(s, 25);
      return [renderDiceRollHtml(r), `The first real clash with Silt's crew goes badly - you hold the line, barely, but it costs more than it should have.`];
    }
    return [renderDiceRollHtml(r), `The first real clash with Silt's crew goes your way, decisively enough that word of it spreads fast.`];
  },
  choices: (s) => s.hp <= 0 ? [{ label: "...", next: "game_over" }] : [{ label: "Continue", next: "bandit_ch3_8" }]
},


bandit_ch3_8: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `In the aftermath, Fen wants to press the advantage immediately. Rook wants to consolidate what you've got before doing anything else.`
  ],
  choices: [
    { label: "Consolidate first - Rook's right", next: "bandit_ch3_9", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Press on while you've got momentum", next: "bandit_ch3_9", effect: (s) => bump(s, { corruption: 1, fame: 1 }) }
  ]
},


bandit_ch3_9: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `Word comes back: Silt is regrouping at an old depot, gathering whoever's left willing to keep fighting. This is close to over, one way or another.`
  ],
  choices: [
    { label: "Plan the final move carefully", next: "bandit_ch3_10", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Trust the crew to improvise when it counts", next: "bandit_ch3_10", effect: (s) => bump(s, { charisma: 1 }) }
  ]
},


bandit_ch3_10: {
  chapter: "Bandit Ch.3 - The Squeeze",
  text: () => [
    `Whatever happens at the depot decides this. The crew's ready, or as ready as they're going to get.`
  ],
  choices: [
    { label: "Continue", next: "bandit_ch3_reveal" }
  ]
},


bandit_ch3_reveal: {
  chapter: "Bandit Ch.3 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_bandit3');
    bumpGold(s, 150);
    return [
      `The depot waits. So does whatever comes after it - Silt gone, or you gone, or something in between neither of you planned for.`,
      `<b>Chapter 3 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>You've earned 150 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "bandit_hub_3" }
  ]
},


bandit_hub_3: {
  chapter: "The Silo - Between Jobs",
  text: (s) => [
    `One last quiet stretch before the depot. Use it well.`,
    `<i>Somewhere, apparently, a Council investigator is closing in on someone powerful. A bounty hunter is reconsidering what the job's actually supposed to mean.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Patch yourself up to full HP", requiresGold: 50, next: "bandit_hub_3", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See the crew's healer to cure Wounded", requiresGold: 30, next: "bandit_hub_3", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'bandit_hub_3'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'bandit_hub_3'; } });
    opts.push({ label: "Continue to Chapter 4", next: "bandit_ch4_1", effect: (st) => snapshot(st, 'snap_bandit4') });
    return opts;
  }
},

/* ---------------- CHAPTER 4: THE CHOICE ---------------- */


bandit_ch4_1: {
  chapter: "Bandit Ch.4 - The Choice",
  text: () => [
    `The depot's quiet when you arrive - too quiet. Silt's people are dug in, waiting, more organized than the last clash suggested they'd be.`
  ],
  choices: [
    { label: "Trust your crew completely, whatever comes", next: "bandit_ch4_2", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Keep a personal exit plan, just in case", next: "bandit_ch4_2", effect: (s) => bump(s, { corruption: 1, luck: 1 }) }
  ]
},


bandit_ch4_2: {
  chapter: "Bandit Ch.4 - The Choice",
  text: () => [
    `Fen, before it starts, asks you straight: was any of this worth it? He means it, not looking for reassurance.`
  ],
  choices: (s) => {
    const base = [
      { label: "Give him a real, honest answer", next: "bandit_ch4_3", effect: (st) => bump(st, { honor: 1, empathy: 1 }) },
      { label: "Tell him what he needs to hear right now", next: "bandit_ch4_3", effect: (st) => bump(st, { charisma: 1, corruption: 1 }) }
    ];
    base.push({
      label: "Tell him the truth is complicated and let him sit with that",
      requires: { stat: 'resolve', min: 8 },
      next: "bandit_ch4_3",
      effect: (st) => bump(st, { resolve: 1, honor: 1 })
    });
    return base;
  }
},


bandit_ch4_3: {
  chapter: "Bandit Ch.4 - The Choice",
  text: (s) => hasItem(s, "Bandit's Cloak")
    ? [`The cloak Pockets traded you blends you into the depot's shadows better than you expected - a small edge, but a real one.`]
    : [`No shadows to hide in tonight - just you, the crew, and whatever Silt's prepared.`],
  choices: (s) => {
    if (!hasItem(s, "Bandit's Cloak")) return [{ label: "Continue", next: "bandit_boss_1" }];
    return [{ label: "Use the cloak to scout in closer, unseen", next: "bandit_boss_1", effect: (st) => bump(st, { resonance: 1, luck: 1 }) }];
  }
},


bandit_boss_1: {
  chapter: "Bandit Ch.4 - The Reckoning (1/3)",
  text: (s) => {
    const success = performCheck(s, 'resonance', 16);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses = (s.flags.bossSuccesses || 0) + 1; return [renderDiceRollHtml(r), `The opening exchange with Silt's people goes clean - you set the terms of the fight, not them.`]; }
    return [renderDiceRollHtml(r), `The opening exchange goes to Silt's people first - you're on the back foot before you've fully settled in.`];
  },
  choices: [{ label: "Continue", next: "bandit_boss_2" }]
},


bandit_boss_2: {
  chapter: "Bandit Ch.4 - The Reckoning (2/3)",
  text: (s) => {
    const success = performCheck(s, 'charisma', 17);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses = (s.flags.bossSuccesses || 0) + 1; return [renderDiceRollHtml(r), `Silt tries to peel off a piece of your crew mid-fight with a shouted offer. Nobody takes it.`]; }
    return [renderDiceRollHtml(r), `Silt's offer lands with at least one of your crew, and you feel the formation waver because of it.`];
  },
  choices: [{ label: "Continue", next: "bandit_boss_3" }]
},


bandit_boss_3: {
  chapter: "Bandit Ch.4 - The Reckoning (3/3)",
  text: (s) => {
    const success = performCheck(s, 'resolve', 18);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses = (s.flags.bossSuccesses || 0) + 1; return [renderDiceRollHtml(r), `Silt goes for broke with everything left - and it's not enough. Not against you, not tonight.`]; }
    applyCombatDamage(s, 25);
    return [renderDiceRollHtml(r), `Silt goes for broke, and it costs you - a real, bad hit right at the end, when you'd started to think it was over.`];
  },
  choices: (s) => s.hp <= 0 ? [{ label: "...", next: "game_over" }] : [{ label: "Continue", next: "bandit_boss_summary" }]
},


bandit_boss_summary: {
  chapter: "Bandit Ch.4 - The Choice",
  text: (s) => {
    const n = s.flags.bossSuccesses || 0;
    if (n === 3) return [`Three for three. Silt's crew breaks first, and it isn't close.`];
    if (n === 2) return [`Two out of three. Costly, but the depot's yours by the end of it.`];
    if (n === 1) return [`Only one clean moment in the whole fight. You win, technically. It doesn't feel like winning.`];
    return [`None of it went cleanly. You're standing at the end of it, which is more than can be said for the alternative - but only just.`];
  },
  choices: (s) => {
    const n = s.flags.bossSuccesses || 0;
    return [{
      label: "Continue",
      next: "bandit_ch4_final_setup",
      effect: (st) => { if (n >= 2) bump(st, { resonance: 1 }); else bump(st, { corruption: 1 }); }
    }];
  }
},


bandit_ch4_final_setup: {
  chapter: "Bandit Ch.4 - The Choice",
  text: () => [
    `Silt's gone, one way or another, and the territory's yours if you want it. Rook's waiting for a word from you on what happens next. So is everyone else.`
  ],
  choices: [
    { label: "Continue", next: "bandit_ch4_final" }
  ]
},


bandit_ch4_final: {
  chapter: "Bandit Ch.4 - The Choice",
  text: (s) => {
    const d = deltaSince(s, 'snap_bandit1');
    const honorGain = d.honor;
    const corruptionGain = d.corruption;

    let tier;
    if (honorGain - corruptionGain >= 8) tier = 'straight';
    else if (honorGain - corruptionGain <= -6) tier = 'crimelord';
    else tier = 'survivor';
    s.flags.banditEnding = tier;
    bumpGold(s, 200);

    if (tier === 'straight') {
      return [
        `<b>ENDING: GOING STRAIGHT</b>`,
        `You use the territory and the leverage it buys to actually get the crew out - Rook first, then, slower, the rest. It's not a clean redemption. It's a real one, which is rarer.`,
        `Fen, of everyone, takes longest to believe it's real. He gets there eventually.`
      ];
    } else if (tier === 'crimelord') {
      return [
        `<b>ENDING: WHAT'S LEFT STANDING</b>`,
        `You take the territory and everything that comes with it, fully, without looking back at what it cost to get here. The crew that's left is loyal because you're what's left standing, not because of who you were.`,
        `It's power. It's not much else.`
      ];
    } else {
      return [
        `<b>ENDING: SURVIVOR'S TERMS</b>`,
        `You hold the territory, mostly intact, the crew mostly together. It's not redemption and it's not total ruin - just the messy middle, which is where most people who do this actually end up living.`,
        `Rook seems satisfied enough with that. You're still deciding if you are.`
      ];
    }
  },
  choices: [
    { label: "The End - Restart", next: "__restart__" }
  ]
},
/* =========================================================
   PART TWO - KINGDOM GUARD ELITE ARC
   4 chapters, 10 decisions each, scaled-up skill checks,
   item trade-ins, and a Part One teammate cameo.
   ========================================================= */

/* ---------------- CHAPTER 1: THE GATE ---------------- */


});
