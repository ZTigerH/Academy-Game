/* =========================================================
   PART TWO - COUNCIL INVESTIGATOR ARC
   4 chapters, 10 decisions each.
   ========================================================= */

Object.assign(SCENES, {

council_ch1_1: {
  chapter: "Council Ch.1 - The Assignment",
  text: () => [
    `The Council Investigations Office is smaller than you expected - a handful of desks, a wall of case files, and Director Voss, who looks up at you like you're either an asset or a liability and hasn't decided which yet.`,
    `"Your first case file's on your desk," she says. "Read it tonight, or trust your gut tomorrow. Your call."`
  ],
  choices: [
    { label: "Study the case files thoroughly overnight", next: "council_ch1_2", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Go in fresh and trust your instincts", next: "council_ch1_2", effect: (s) => bump(s, { luck: 1 }) }
  ]
},


council_ch1_2: {
  chapter: "Council Ch.1 - The Assignment",
  text: () => [
    `Voss studies you across her desk the next morning, unreadable. First impressions matter to her, clearly.`
  ],
  choices: [
    { label: "Project confidence - you know what you're doing", next: "council_ch1_3", effect: (s) => bump(s, { fame: 1, charisma: 1 }) },
    { label: "Stay deferential and cautious - you're still new here", next: "council_ch1_3", effect: (s) => bump(s, { honor: 1 }) }
  ]
},


council_ch1_3: {
  chapter: "Council Ch.1 - The Assignment",
  text: () => [
    `The case: a supply requisition officer suspected of skimming Resonance-tech shipments. Nothing like Vesk's operation - smaller, pettier - but real.`
  ],
  choices: [
    { label: "Visit the warehouse yourself, unannounced", next: "council_ch1_4", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Interview witnesses first, build a paper trail", next: "council_ch1_4", effect: (s) => bump(s, { honor: 1 }) }
  ]
},


council_ch1_4: {
  chapter: "Council Ch.1 - The Assignment",
  text: (s) => hasItem(s, 'Ridgeback Scale')
    ? [`A Council quartermaster spots the Ridgeback scale you've been carrying since your academy days. "That's worth something to the right collector," she says. "Trade it in for field credentials, or keep it as a trophy."`]
    : [`The quartermaster's office is quiet this morning - nothing of yours worth trading in today.`],
  choices: (s) => {
    if (!hasItem(s, 'Ridgeback Scale')) return [{ label: "Continue", next: "council_ch1_5" }];
    return [
      { label: "Trade the scale in for Council Field Credentials", next: "council_ch1_5", effect: (st) => {
          removeItem(st, 'Ridgeback Scale');
          addItem(st, 'Council Field Credentials');
        } },
      { label: "Keep it - it means more than the trade is worth", next: "council_ch1_5", effect: (st) => bump(st, { honor: 1 }) }
    ];
  }
},


council_ch1_5: {
  chapter: "Council Ch.1 - The Assignment",
  text: () => [
    `A clerk who worked under the suspected officer is clearly terrified of retaliation, and just as clearly knows more than she's saying.`
  ],
  choices: (s) => {
    const base = [
      { label: "Press her calmly, promise protection", next: "council_ch1_6", effect: (st) => bump(st, { empathy: 1 }) },
      { label: "Apply a little pressure - time is short", next: "council_ch1_6", effect: (st) => bump(st, { corruption: 1 }) }
    ];
    base.push({
      label: "Your reputation alone puts her at ease",
      requires: { stat: 'charisma', min: 7 },
      next: "council_ch1_6",
      effect: (st) => bump(st, { charisma: 1, empathy: 1 })
    });
    return base;
  }
},


council_ch1_6: {
  chapter: "Council Ch.1 - The Assignment",
  text: () => [
    `A rival investigator, Marchetti, makes a point of undercutting your read on the case in front of Voss - not the first time, apparently, and not subtle about it.`
  ],
  choices: [
    { label: "Confront him directly after the meeting", next: "council_ch1_7", effect: (s) => bump(s, { honor: 1, apathy: 1 }) },
    { label: "Let it go - the case matters more than the ego", next: "council_ch1_7", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Outmaneuver him quietly with better evidence", next: "council_ch1_7", effect: (s) => bump(s, { resonance: 1, corruption: 1 }) }
  ]
},


council_ch1_7: {
  chapter: "Council Ch.1 - The Assignment",
  text: () => [
    `The trail leads to a shipping yard at night. Backup is an hour out, if you call it in at all.`
  ],
  choices: [
    { label: "Go in alone now - the trail's going cold", next: "council_ch1_8", effect: (s) => bump(s, { resolve: 1, luck: -1 }) },
    { label: "Wait for backup, however long it takes", next: "council_ch1_8", effect: (s) => bump(s, { honor: 1 }) }
  ]
},


council_ch1_8: {
  chapter: "Council Ch.1 - The Assignment",
  text: (s) => {
    const success = performCheck(s, 'resonance', 14);
    const r = s.flags.lastRoll;
    if (!success) {
      applyCombatDamage(s, 15);
      return [renderDiceRollHtml(r), `The suspect bolts and doesn't go quietly - a scuffle at the yard's edge leaves you bruised before you get the cuffs on.`];
    }
    return [renderDiceRollHtml(r), `The suspect bolts, but you're faster, cutting him off clean before it turns into anything worse.`];
  },
  choices: (s) => s.hp <= 0 ? [{ label: "...", next: "game_over" }] : [{ label: "Continue", next: "council_ch1_9" }]
},


council_ch1_9: {
  chapter: "Council Ch.1 - The Assignment",
  text: () => [
    `Case closed, more or less. How you close it is still your call.`
  ],
  choices: [
    { label: "Full arrest, public credit for the Office", next: "council_ch1_10", effect: (s) => bump(s, { fame: 1, honor: 1 }) },
    { label: "Quiet plea deal - less noise, less glory", next: "council_ch1_10", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


council_ch1_10: {
  chapter: "Council Ch.1 - The Assignment",
  text: () => [
    `Voss reviews your closing report without much expression, which you're starting to realize is as close to approval as she gets.`
  ],
  choices: [
    { label: "Ask her directly what she thought of your work", next: "council_ch1_reveal", effect: (s) => { s.flags.vossTrust = (s.flags.vossTrust || 0) + 1; bump(s, { charisma: 1 }); } },
    { label: "Say nothing - let the report speak for itself", next: "council_ch1_reveal", effect: (s) => { s.flags.vossTrust = (s.flags.vossTrust || 0) + 1; bump(s, { resolve: 1 }); } }
  ]
},


council_hub_1: {
  chapter: "Council Office - Between Cases",
  text: (s) => [
    `A quiet stretch between assignments. Time to patch yourself up, spend what you've earned, and hear what's floating around the office.`,
    `<i>Rumor has it a Kingdom Guard recruit held a gate single-handedly last month. Someone else mentions a huntsman out at a frontier outpost nobody can quite name.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Heal to full HP", requiresGold: 50, next: "council_hub_1", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See a healer to cure Wounded", requiresGold: 30, next: "council_hub_1", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'council_hub_1'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'council_hub_1'; } });
    opts.push({ label: "Continue to Chapter 2", next: "council_ch2_1", effect: (st) => snapshot(st, 'snap_council2') });
    return opts;
  }
},


council_ch1_reveal: {
  chapter: "Council Ch.1 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_council1');
    bumpGold(s, 100);
    return [
      `Your first case is closed. Voss mentions, almost offhand, that something bigger has been flagged - a pattern of Resonance-tech irregularities with a signature that feels uncomfortably familiar.`,
      `<b>Chapter 1 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>Case closed. You've earned 100 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "council_hub_1" }
  ]
},

/* ---------------- CHAPTER 2: OLD THREADS ---------------- */


council_ch2_1: {
  chapter: "Council Ch.2 - Old Threads",
  text: () => [
    `The "irregularities" Voss mentioned turn out to be a resurfacing pattern - tech signatures matching the network Vesk once ran, under new hands.`
  ],
  choices: [
    { label: "Bring this to Voss immediately", next: "council_ch2_2", effect: (s) => { bump(s, { honor: 1 }); s.flags.vossTrust = (s.flags.vossTrust || 0) + 1; } },
    { label: "Quietly investigate further before involving anyone", next: "council_ch2_2", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


council_ch2_2: {
  chapter: "Council Ch.2 - Old Threads",
  text: () => [
    `You need an outside perspective - someone who actually understands how Vesk's old operation worked from the inside.`
  ],
  choices: [
    { label: "Reach out to your old teammate", next: "council_ch2_3", effect: (s) => bump(s, { empathy: 1 }) }
  ]
},


council_ch2_3: {
  chapter: "Council Ch.2 - Old Threads",
  text: (s) => {
    const cameo = pickCameo(s);
    s.flags.cameoName = cameo.name;
    s.flags.cameoKey = cameo.key;
    const lines = {
      sable: `Sable answers on the second ring, and there's real warmth in her voice under the surprise. "Council work? Look at you. What do you need?"`,
      thorne: `Thorne shows up in person rather than calling - some things don't change. "You could've just written," he says, setting down a bag of what turns out to be, unnecessarily, supplies.`,
      denna: `Denna already has three theories before you've finished explaining the case. "You're slower to call than I expected," she says, "but you called the right person."`
    };
    return [lines[cameo.key]];
  },
  choices: [
    { label: "Catch up properly before getting to business", next: "council_ch2_4", effect: (s) => bumpTrust(s, { [s.flags.cameoKey]: 1 }) },
    { label: "Get straight to the case", next: "council_ch2_4", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


council_ch2_4: {
  chapter: "Council Ch.2 - Old Threads",
  text: (s) => hasItem(s, "Vesk's Notes")
    ? [`You still have Vesk's actual notes, taken from the quarry all that time ago. ${s.flags.cameoName} recognizes the handwriting immediately.`]
    : [`Without hard documentation, ${s.flags.cameoName} is working from memory alone - still sharp, but incomplete.`],
  choices: (s) => {
    if (!hasItem(s, "Vesk's Notes")) return [{ label: "Continue", next: "council_ch2_5" }];
    return [
      { label: "Hand the notes over as evidence", next: "council_ch2_5", effect: (st) => {
          removeItem(st, "Vesk's Notes");
          bump(st, { honor: 1, resonance: 1 });
        } },
      { label: "Keep them - you're not ready to let them go", next: "council_ch2_5", effect: (st) => bump(st, { corruption: 1 }) }
    ];
  }
},


council_ch2_5: {
  chapter: "Council Ch.2 - Old Threads",
  text: () => [
    `Marchetti finds out about the outside consultation and reports it as a breach of protocol, whether or not that's really what it is.`
  ],
  choices: [
    { label: "Explain yourself to Voss directly, first", next: "council_ch2_6", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Let Marchetti's complaint fizzle on its own", next: "council_ch2_6", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


council_ch2_6: {
  chapter: "Council Ch.2 - Old Threads",
  text: () => [
    `The deeper thread points toward someone with real Council access - this isn't street-level anymore.`
  ],
  choices: (s) => {
    const base = [
      { label: "Push the investigation upward, regardless of rank", next: "council_ch2_7", effect: (st) => bump(st, { honor: 1 }) },
      { label: "Tread carefully - accusing the wrong person ends careers", next: "council_ch2_7", effect: (st) => bump(st, { corruption: 1 }) }
    ];
    base.push({
      label: "You've handled worse than Council politics",
      requires: { stat: 'resolve', min: 8 },
      next: "council_ch2_7",
      effect: (st) => bump(st, { resolve: 1, honor: 1 })
    });
    return base;
  }
},


council_ch2_7: {
  chapter: "Council Ch.2 - Old Threads",
  text: (s) => [
    `${s.flags.cameoName} agrees to help you check a lead in person - a records office that shouldn't be as guarded as it is.`
  ],
  choices: (s) => {
    const success = performCheck(s, 'resonance', 13);
    const r = s.flags.lastRoll;
    if (!success) {
      return [renderDiceRollHtml(r), `A guard nearly catches the two of you. ${s.flags.cameoName} covers for you smoothly, but it's closer than either of you would like.`];
    }
    return [renderDiceRollHtml(r), `You're in and out clean, ${s.flags.cameoName} keeping watch the whole time like old times.`];
  },
  choices: [{ label: "Continue", next: "council_ch2_8" }]
},


council_ch2_8: {
  chapter: "Council Ch.2 - Old Threads",
  text: () => [
    `The records point to a low-level clerk who's clearly just a pawn - scared, in over their head, not a real player in this.`
  ],
  choices: [
    { label: "Protect them - report the finding without naming them", next: "council_ch2_9", effect: (s) => bump(s, { empathy: 1, honor: 1 }) },
    { label: "Name them anyway - the record has to be complete", next: "council_ch2_9", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


council_ch2_9: {
  chapter: "Council Ch.2 - Old Threads",
  text: () => [
    `One name keeps surfacing above the clerk: Councilor Reyes. It's not proof yet. It's close.`
  ],
  choices: [
    { label: "Confront the possibility head-on with Voss", next: "council_ch2_10", effect: (s) => { bump(s, { honor: 1 }); s.flags.vossTrust = (s.flags.vossTrust || 0) + 1; } },
    { label: "Sit on it until you have more than a name", next: "council_ch2_10", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


council_ch2_10: {
  chapter: "Council Ch.2 - Old Threads",
  text: (s) => [
    `${s.flags.cameoName} heads home, the favor called in and repaid. "Be careful," they say, in a tone that means it. "Council or not, this is Vesk's shadow you're chasing."`
  ],
  choices: (s) => {
    if (s.flags.cameoKey === 'sable' && (s.trust.sable || 0) >= 6) {
      return [{ label: "Continue", next: "sidequest_sable_1", effect: (st) => bumpTrust(st, { sable: 1 }) }];
    }
    return [{ label: "Continue", next: "council_ch2_reveal", effect: (st) => bumpTrust(st, { [st.flags.cameoKey]: 1 }) }];
  }
},


council_ch2_reveal: {
  chapter: "Council Ch.2 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_council2');
    bumpGold(s, 125);
    return [
      `A name. Not proof. Councilor Reyes is about to become a very careful problem.`,
      `<b>Chapter 2 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>You've earned 125 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "council_hub_2" }
  ]
},


council_hub_2: {
  chapter: "Council Office - Between Cases",
  text: (s) => [
    `The pressure hasn't started yet, but you can feel it coming. Worth a moment to prepare.`,
    `<i>Word is an academy instructor turned around a struggling first-year this term. Somewhere out there, apparently, a mercenary is juggling two contracts on the same job.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Heal to full HP", requiresGold: 50, next: "council_hub_2", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See a healer to cure Wounded", requiresGold: 30, next: "council_hub_2", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'council_hub_2'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'council_hub_2'; } });
    opts.push({ label: "Continue to Chapter 3", next: "council_ch3_1", effect: (st) => snapshot(st, 'snap_council3') });
    return opts;
  }
},

/* ---------------- CHAPTER 3: THE PRESSURE ---------------- */


council_ch3_1: {
  chapter: "Council Ch.3 - The Pressure",
  text: (s) => {
    const lines = [`Word gets back to you fast - someone powerful wants this investigation quietly closed, and it isn't subtle about the pressure it's applying.`];
    if (shouldNemesisAppear(s)) {
      lines.push(`A name surfaces behind the pressure that you recognize with a cold feeling: Kestrel - someone who made the same kinds of compromises you did, once, and never stopped. "Funny seeing you on this side of it," they say, when you finally speak. "We're not so different, you and I."`);
    }
    return lines;
  },
  choices: [
    { label: "Push harder specifically because of the pressure", next: "council_ch3_2", effect: (s) => bump(s, { resolve: 1, honor: 1 }) },
    { label: "Slow down and reassess your approach", next: "council_ch3_2", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


council_ch3_2: {
  chapter: "Council Ch.3 - The Pressure",
  text: () => [
    `Marchetti, of all people, quietly warns you that Reyes has friends watching your every move now.`
  ],
  choices: [
    { label: "Thank him - maybe you misjudged him", next: "council_ch3_3", effect: (s) => bump(s, { charisma: 1 }) },
    { label: "Stay wary - this could easily be a setup", next: "council_ch3_3", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


council_ch3_3: {
  chapter: "Council Ch.3 - The Pressure",
  text: () => [
    `Your apartment's been searched. Nothing obviously missing. The message is clear regardless.`
  ],
  choices: (s) => {
    const base = [
      { label: "Report the break-in officially", next: "council_ch3_4", effect: (st) => bump(st, { honor: 1 }) },
      { label: "Handle it quietly - official channels might be compromised", next: "council_ch3_4", effect: (st) => bump(st, { corruption: 1 }) }
    ];
    base.push({
      label: "Use it - plant false leads for whoever's watching",
      requires: { stat: 'corruption', min: 6 },
      next: "council_ch3_4",
      effect: (st) => bump(st, { corruption: 1, resonance: 1 })
    });
    return base;
  }
},


council_ch3_4: {
  chapter: "Council Ch.3 - The Pressure",
  text: () => [
    `Voss calls you in. She's heard the pressure too, from higher up than you'd like. "I can shut this down for you," she says. "Or I can not hear you say you want to keep going. Your call."`
  ],
  choices: [
    { label: "Tell her plainly you're not stopping", next: "council_ch3_5", effect: (s) => { bump(s, { honor: 1, resolve: 1 }); s.flags.vossTrust = (s.flags.vossTrust || 0) + 2; } },
    { label: "Ask her to make the decision for you", next: "council_ch3_5", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


council_ch3_5: {
  chapter: "Council Ch.3 - The Pressure",
  text: () => [
    `An anonymous contact offers hard evidence against Reyes - for a price, or a favor to be named later.`
  ],
  choices: [
    { label: "Take the deal, whatever the future cost", next: "council_ch3_6", effect: (s) => bump(s, { corruption: 2, resolve: 1 }) },
    { label: "Refuse - build the case clean or not at all", next: "council_ch3_6", effect: (s) => bump(s, { honor: 2 }) }
  ]
},


council_ch3_6: {
  chapter: "Council Ch.3 - The Pressure",
  text: () => [
    `Reyes requests a meeting with you directly - cordial, on the surface, and clearly meant to feel like a warning underneath it.`
  ],
  choices: (s) => {
    const base = [
      { label: "Play along, gather what you can from the meeting", next: "council_ch3_7", effect: (st) => bump(st, { resolve: 1 }) },
      { label: "Decline the meeting entirely", next: "council_ch3_7", effect: (st) => bump(st, { honor: 1 }) }
    ];
    base.push({
      label: "Meet them and make it clear you're not intimidated",
      requires: { stat: 'charisma', min: 8 },
      next: "council_ch3_7",
      effect: (st) => bump(st, { charisma: 1, fame: 1 })
    });
    return base;
  }
},


council_ch3_7: {
  chapter: "Council Ch.3 - The Pressure",
  text: (s) => {
    const success = performCheck(s, 'resonance', 15);
    const r = s.flags.lastRoll;
    if (!success) {
      applyCombatDamage(s, 20);
      return [renderDiceRollHtml(r), `Someone tries to make sure this investigation ends with you, specifically - a close call in a parking structure that leaves no doubt how serious this has gotten.`];
    }
    return [renderDiceRollHtml(r), `Someone tries to make sure this investigation ends with you, specifically - you see it coming and get clear before it becomes a real problem.`];
  },
  choices: (s) => s.hp <= 0 ? [{ label: "...", next: "game_over" }] : [{ label: "Continue", next: "council_ch3_8" }]
},


council_ch3_8: {
  chapter: "Council Ch.3 - The Pressure",
  text: () => [
    `Whatever this was, it's now attempted intimidation at minimum, possibly worse. You have a real decision about how to use it.`
  ],
  choices: [
    { label: "Report the attack formally, on the record", next: "council_ch3_9", effect: (s) => bump(s, { honor: 1, fame: 1 }) },
    { label: "Keep it quiet and use the fear it gives you", next: "council_ch3_9", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


council_ch3_9: {
  chapter: "Council Ch.3 - The Pressure",
  text: () => [
    `The case is nearly airtight now. One final piece would make it undeniable - a testimony from someone inside Reyes' own office.`
  ],
  choices: [
    { label: "Offer them real protection in exchange for testimony", next: "council_ch3_10", effect: (s) => bump(s, { honor: 1, empathy: 1 }) },
    { label: "Pressure them - you don't have time to be gentle", next: "council_ch3_10", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


council_ch3_10: {
  chapter: "Council Ch.3 - The Pressure",
  text: () => [
    `The testimony comes through. Whatever happens next, this is no longer something that can be quietly buried.`
  ],
  choices: [
    { label: "Continue", next: "council_ch3_reveal" }
  ]
},


council_ch3_reveal: {
  chapter: "Council Ch.3 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_council3');
    bumpGold(s, 150);
    return [
      `The case is built. Reyes doesn't know it's finished yet. That won't last long.`,
      `<b>Chapter 3 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>You've earned 150 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "council_hub_3" }
  ]
},


council_hub_3: {
  chapter: "Council Office - Between Cases",
  text: (s) => [
    `One last quiet moment before Reyes. Use it well.`,
    `<i>Somewhere, apparently, a bandit crew leader is wrestling with a target too close to home. A black market dealer is being offered more money than they know what to do with.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Heal to full HP", requiresGold: 50, next: "council_hub_3", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See a healer to cure Wounded", requiresGold: 30, next: "council_hub_3", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'council_hub_3'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'council_hub_3'; } });
    opts.push({ label: "Continue to Chapter 4", next: "council_ch4_1", effect: (st) => snapshot(st, 'snap_council4') });
    return opts;
  }
},

/* ---------------- CHAPTER 4: EXPOSURE ---------------- */


council_ch4_1: {
  chapter: "Council Ch.4 - Exposure",
  text: () => [
    `You request the meeting this time. Reyes agrees, probably assuming they still have the upper hand.`
  ],
  choices: [
    { label: "Bring Voss with you, official and documented", next: "council_ch4_2", effect: (s) => { bump(s, { honor: 1 }); s.flags.vossTrust = (s.flags.vossTrust || 0) + 1; } },
    { label: "Go alone - this needs to be direct", next: "council_ch4_2", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


council_ch4_2: {
  chapter: "Council Ch.4 - Exposure",
  text: () => [
    `Reyes tries charm first, then thinly veiled threats, testing which one lands.`
  ],
  choices: (s) => {
    const base = [
      { label: "Stay silent and let the evidence do the talking", next: "council_ch4_3", effect: (st) => bump(st, { resolve: 1 }) },
      { label: "Match their tone exactly, point for point", next: "council_ch4_3", effect: (st) => bump(st, { charisma: 1, apathy: 1 }) }
    ];
    base.push({
      label: "Dismantle their composure with pure, plain honesty",
      requires: { stat: 'honor', min: 9 },
      next: "council_ch4_3",
      effect: (st) => bump(st, { honor: 2, fame: 1 })
    });
    return base;
  }
},


council_ch4_3: {
  chapter: "Council Ch.4 - Exposure",
  text: (s) => hasItem(s, 'Council Field Credentials')
    ? [`Your field credentials grant you access to a final sealed file Reyes clearly didn't expect you to reach.`]
    : [`Without deeper access, you're working with what you've already built - which, at this point, is substantial.`],
  choices: (s) => {
    if (!hasItem(s, 'Council Field Credentials')) return [{ label: "Continue", next: "council_ch4_4" }];
    return [{ label: "Pull the sealed file", next: "council_ch4_4", effect: (st) => bump(st, { resonance: 1, honor: 1 }) }];
  }
},


council_ch4_4: {
  chapter: "Council Ch.4 - Exposure",
  text: () => [
    `Reyes finally drops the pretense. "You understand this doesn't end with just me, if it goes public. The Council's credibility goes with it."`
  ],
  choices: [
    { label: "That's not your problem to solve for them", next: "council_boss_1", effect: (s) => { bump(s, { honor: 1 }); s.flags.bossSuccesses = 0; } },
    { label: "Consider what a full public collapse would actually cost", next: "council_boss_1", effect: (s) => { bump(s, { corruption: 1 }); s.flags.bossSuccesses = 0; } }
  ]
},


council_boss_1: {
  chapter: "Council Ch.4 - The Reckoning (1/3)",
  text: (s) => {
    const success = performCheck(s, 'charisma', 16);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses++; return [renderDiceRollHtml(r), `Reyes probes for a crack in your composure. There isn't one - not one they can find, anyway.`]; }
    return [renderDiceRollHtml(r), `Reyes finds exactly the crack they were looking for, and doesn't let you forget they saw it.`];
  },
  choices: [{ label: "Continue", next: "council_boss_2" }]
},


council_boss_2: {
  chapter: "Council Ch.4 - The Reckoning (2/3)",
  text: (s) => {
    const success = performCheck(s, 'resolve', 17);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses++; return [renderDiceRollHtml(r), `Reyes shifts to something more personal - a threat aimed at what you care about, not just your case. It doesn't land the way they hoped.`]; }
    return [renderDiceRollHtml(r), `Reyes shifts to something more personal, and this time it lands harder than you'd like to admit.`];
  },
  choices: [{ label: "Continue", next: "council_boss_3" }]
},


council_boss_3: {
  chapter: "Council Ch.4 - The Reckoning (3/3)",
  text: (s) => {
    const success = performCheck(s, 'honor', 18);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses++; return [renderDiceRollHtml(r), `Reyes makes one last, desperate gambit - a bribe dressed up as a favor. You don't even have to think about the answer.`]; }
    return [renderDiceRollHtml(r), `Reyes makes one last, desperate gambit, and for just a moment, you actually consider it before pushing it away.`];
  },
  choices: [{ label: "Continue", next: "council_boss_summary" }]
},


council_boss_summary: {
  chapter: "Council Ch.4 - Exposure",
  text: (s) => {
    const n = s.flags.bossSuccesses || 0;
    if (n === 3) return [`Three for three. Whatever Reyes was hoping to find in you to exploit, it isn't there.`];
    if (n === 2) return [`Two out of three. Reyes got under your skin once, but not enough to change anything that matters.`];
    if (n === 1) return [`Only once did you hold the line cleanly. Reyes noticed, and it shows in how they talk to you now.`];
    return [`Reyes got to you more than you'd like to admit tonight. That doesn't change what happens next, but it's not nothing.`];
  },
  choices: (s) => {
    const n = s.flags.bossSuccesses || 0;
    return [{
      label: "Continue",
      next: "council_ch4_5",
      effect: (st) => { if (n >= 2) bump(st, { honor: 1 }); else bump(st, { corruption: 1 }); }
    }];
  }
},


council_ch4_5: {
  chapter: "Council Ch.4 - Exposure",
  text: () => [
    `Reyes makes one last offer - a quiet resignation, a cover story, and a debt owed to you personally, permanently.`
  ],
  choices: [
    { label: "Refuse - this needs to be real, not quiet", next: "council_ch4_final", effect: (s) => bump(s, { honor: 2 }) },
    { label: "Take the deal - quiet resignation, real result", next: "council_ch4_final", effect: (s) => bump(s, { corruption: 2, resolve: 1 }) },
    { label: "Stall for time and bring Voss in to decide", next: "council_ch4_final", effect: (s) => { bump(s, { resolve: 1 }); s.flags.vossTrust = (s.flags.vossTrust || 0) + 1; } }
  ]
},


council_ch4_final: {
  chapter: "Council Ch.4 - Exposure",
  text: (s) => {
    const honor = effectiveStat(s, 'honor');
    const corruption = effectiveStat(s, 'corruption');
    const vossTrust = s.flags.vossTrust || 0;

    let tier;
    if (honor - corruption >= 6 && vossTrust >= 4) tier = 'clean';
    else if (honor - corruption <= -2) tier = 'buried';
    else tier = 'costly';
    s.flags.councilEnding = tier;
    bumpGold(s, 200);

    if (tier === 'clean') {
      return [
        `<b>ENDING: CLEAN EXPOSURE</b>`,
        `Reyes is removed publicly, fully, and the case holds up to every scrutiny thrown at it afterward. Voss puts your name on the report without hesitation - not something she does lightly.`,
        `The Council survives the scandal because the process visibly worked. That matters more than anyone expected it to.`,
        shouldNemesisAppear(s) ? `Kestrel watches the outcome from a distance, unreadable. Whatever they expected from you, this apparently wasn't it.` : ''
      ].filter(Boolean);
    } else if (tier === 'buried') {
      return [
        `<b>ENDING: BURIED TRUTH</b>`,
        `However this resolves on paper, the truth of it never quite reaches daylight. Reyes exits quietly, credibly denies everything, and resurfaces elsewhere within the year.`,
        `You did the work. Whether it mattered is a harder question than you'd like it to be.`,
        shouldNemesisAppear(s) ? `Kestrel sends word, after: "Told you. We're not so different." You don't have a good answer for that.` : ''
      ].filter(Boolean);
    } else {
      return [
        `<b>ENDING: COSTLY COMPROMISE</b>`,
        `Reyes is gone, one way or another, but the way it happened leaves a mark on the case and on you. Voss doesn't say much about it. Neither do you.`,
        `It's a win. It doesn't feel entirely like one.`,
        shouldNemesisAppear(s) ? `Kestrel doesn't reach out this time. You're not sure if that's relief or something else.` : ''
      ].filter(Boolean);
    }
  },
  choices: [
    { label: "The End - Restart", next: "__restart__" }
  ]
},
/* =========================================================
   PART TWO - BANDIT CREW LEADER ARC
   4 chapters, 10 decisions each, scaled-up skill checks,
   item trade-ins, and a Part One teammate cameo.
   ========================================================= */

/* ---------------- CHAPTER 1: THE CREW ---------------- */


});
