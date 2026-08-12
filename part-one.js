/* =========================================================
   PART ONE — main story (Chapters 1-4) plus shared routing
   scenes: game_over, random_encounter, Sable side-quest,
   graduation bridge, and job selection.
   ========================================================= */

Object.assign(SCENES, {

random_encounter: {
  chapter: "On the Road",
  text: (s) => {
    const variants = [
      { text: `A traveling merchant waves you down, more curious than persistent. "Not often I see a huntsman out this way," she says, and presses a small lucky coin into your hand before you can even answer. "For the road."`, effect: (st) => bump(st, { luck: 1 }) },
      { text: `You pass a shrine, old and mostly forgotten, tucked just off the path. Something about stopping for a moment feels right.`, effect: (st) => bump(st, { resolve: 1 }) },
      { text: `A group of local kids dare each other to approach you, then lose their nerve at the last second. You wave, and one of them waves back like it's the best thing that's happened all week.`, effect: (st) => bump(st, { charisma: 1 }) }
    ];
    const v = variants[s.flags.encounterVariant || 0];
    s.flags._encounterEffect = v.effect;
    return [v.text];
  },
  choices: (s) => [{
    label: "Continue",
    next: (st) => st.flags.encounterTarget,
    effect: (st) => { if (st.flags._encounterEffect) st.flags._encounterEffect(st); }
  }]
},


game_over: {
  chapter: "Fallen",
  text: (s) => [
    `Everything goes white, then dark, then quiet — ${s.flags.deathContext || 'the fight goes badly wrong'}.`,
    `You don't walk away from this one. Whatever Team ${teamName(s)} becomes after this, it becomes it without you.`
  ],
  choices: [ { label: "Restart Story", next: "__restart__" } ]
},

/* =========================================================
   CHAPTER 1 — INITIATION (10 choices)
   ========================================================= */


c1_1: {
  chapter: "Chapter 1 — Initiation",
  text: (s) => [
    `The cliffside launch pads hum beneath your feet. Around you, a dozen other first-years wait their turn, nerves dressed up as bravado.`,
    `${N()}, your Resonance — ${s.resonanceType} — settles under your skin like a held breath. Professor Ashworth's voice cuts through the wind: "Land, find a relic, return to the cliffs. Partners are whoever you meet first. Go."`,
    `The pad launches you into open sky, and for one long second there's nothing under you at all.`
  ],
  choices: [
    { label: "Stay calm — control the fall", next: "c1_2", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Let instinct take over and flail through it", next: "c1_2", effect: (s) => bump(s, { luck: 1, resolve: -1 }) }
  ]
},


c1_2: {
  chapter: "Chapter 1 — Initiation",
  text: () => [
    `You land hard, roll, come up swinging out of habit — and nearly clip a girl with a shock of red-dyed hair who's already got her weapon drawn.`,
    `"Whoa — friendly!" she says, lowering it. "I'm Sable. That was almost embarrassing for both of us."`
  ],
  choices: [
    { label: "Laugh it off — no harm done", next: "c1_3", effect: (s) => { bump(s, { charisma: 1 }); bumpTrust(s, { sable: 1 }); } },
    { label: "Call her out for nearly getting hit", next: "c1_3", effect: (s) => { bump(s, { honor: 1, charisma: -1 }); bumpTrust(s, { sable: -1 }); } }
  ]
},


c1_3: {
  chapter: "Chapter 1 — Initiation",
  text: () => [
    `Before you can say much else, two more recruits emerge from the treeline — a tall, quiet boy with an oversized shield strapped to his back, and a sharp-eyed girl already reading the terrain like a puzzle.`,
    `"Denna," she says. "That's Thorne. I take it we're a team now." They both look to you, waiting to see how you introduce yourself.`
  ],
  choices: (s) => {
    const base = [
      { label: "Introduce yourself with confidence", next: "c1_4", effect: (st) => { bump(st, { fame: 1 }); bumpTrust(st, { denna: 1 }); } },
      { label: "Keep it humble and brief", next: "c1_4", effect: (st) => { bump(st, { honor: 1 }); bumpTrust(st, { thorne: 1 }); } },
      { label: "Make a joke to break the tension", next: "c1_4", effect: (st) => { bump(st, { charisma: 2 }); bumpTrust(st, { sable: 1 }); } }
    ];
    base.push({
      label: "Read them both instantly, street-smart instincts kicking in",
      requiresOrigin: 'streets',
      next: "c1_4",
      effect: (st) => { bump(st, { charisma: 1, luck: 1 }); bumpTrust(st, { denna: 1, thorne: 1 }); }
    });
    return base;
  }
},


c1_4: {
  chapter: "Chapter 1 — Initiation",
  text: () => [
    `A distant howl rolls through the trees — something Hollow, and close. Thorne grips his shield. "Relic's this way. So is that."`
  ],
  choices: (s) => {
    const base = [
      { label: "Push forward and fight through whatever's there", next: "c1_5", effect: (st) => { bump(st, { resonance: 1 }); st.flags.ch1Approach = 'fight'; } },
      { label: "Circle around and avoid the fight", next: "c1_5", effect: (st) => { bump(st, { luck: 1 }); st.flags.ch1Approach = 'sneak'; } }
    ];
    base.push({
      label: "Meet it head-on with raw Resonance fire",
      requiresClass: 'Ember',
      next: "c1_5",
      effect: (st) => { bump(st, { resonance: 2, fame: 1 }); st.flags.ch1Approach = 'fight'; addStatus(st, 'inspired'); }
    });
    return base;
  }
},


c1_5: {
  chapter: "Chapter 1 — Initiation",
  text: (s) => s.flags.ch1Approach === 'fight'
    ? [
        `The Hollow that meets you is a Ridgeback — low, armored, built like a battering ram. Thorne plants his shield, and for a moment it looks like the fight might swing wide of him.`
      ]
    : [
        `You skirt the treeline instead, quiet. A Ridgeback prowls just past the brush — close enough that one wrong step puts Thorne right in its path.`
      ],
  choices: [
    { label: "Pull Thorne clear, take the risk yourself", next: (s) => s.hp <= 0 ? 'game_over' : 'c1_6', effect: (s) => {
        bump(s, { honor: 1, empathy: 1 });
        bumpTrust(s, { thorne: 2 });
        const success = performCheck(s, 'resonance', 10);
        if (!success) { applyCombatDamage(s, 20); s.flags.deathContext = "the Ridgeback's charge catches you square on"; }
        else { bump(s, { luck: 1 }); }
      } },
    { label: "Trust him to handle it, focus on the bigger threat", next: "c1_6", effect: (s) => { bump(s, { resonance: 1, empathy: -1 }); bumpTrust(s, { thorne: -1 }); } }
  ]
},


c1_6: {
  chapter: "Chapter 1 — Initiation",
  text: (s) => {
    const r = s.flags.lastRoll;
    const rollHtml = r ? renderDiceRollHtml(r) : '';
    const base = `Past the fight, you find a small Hollow-touched fawn tangled in old fencing wire, too frightened to free itself, too Hollow-warped to be fully harmless either.`;
    if (r && !r.success) {
      return [rollHtml, `The Ridgeback's charge clips you before Thorne's shield fully closes the gap — a real hit, one you'll feel for days. You shake it off and keep moving.`, base];
    } else if (r && r.success) {
      return [rollHtml, `You pull Thorne clear cleanly, taking the Ridgeback's charge on your own guard instead — a solid, controlled block. Nobody's hurt.`, base];
    }
    return [base];
  },
  choices: [
    { label: "Carefully free it and let it go", next: "c1_7", effect: (s) => bump(s, { empathy: 2 }) },
    { label: "Leave it — not your problem right now", next: "c1_7", effect: (s) => bump(s, { apathy: 1 }) },
    { label: "Use its distress to lure other Hollow off your path", next: "c1_7", effect: (s) => bump(s, { corruption: 1, luck: 1 }) },
    { label: "Take a scale from the fallen Ridgeback as proof", next: "c1_7", effect: (s) => { bump(s, { fame: 1 }); addItem(s, 'Ridgeback Scale'); } }
  ]
},


c1_7: {
  chapter: "Chapter 1 — Initiation",
  text: () => [
    `Further on, you come across gear abandoned by another team — a decent blade, still sharp, dropped in what looks like a hurried retreat.`
  ],
  choices: [
    { label: "Take it — it's fair game out here", next: "c1_8", effect: (s) => { bump(s, { corruption: 1, luck: 1 }); addItem(s, 'Stolen Blade'); } },
    { label: "Leave it — it's not yours", next: "c1_8", effect: (s) => bump(s, { honor: 1 }) }
  ]
},


c1_8: {
  chapter: "Chapter 1 — Initiation",
  text: () => [
    `At a river crossing, a rival team's leader — a lean, confident recruit named Kade — catches sight of you and can't resist a jab about how long you're taking.`
  ],
  choices: [
    { label: "Snap back — let them know you heard that", next: "c1_9", effect: (s) => { bump(s, { apathy: 1, charisma: -1 }); bumpRapport(s, -1); } },
    { label: "Ignore them and keep moving", next: "c1_9", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Fire back a joke that actually lands", next: "c1_9", effect: (s) => { bump(s, { charisma: 2 }); bumpRapport(s, 1); } }
  ]
},


c1_9: {
  chapter: "Chapter 1 — Initiation",
  text: () => [
    `The relic comes into view at last — a small carved piece, humming faintly with old Resonance work. Someone has to decide how it's carried back.`
  ],
  choices: (s) => {
    const base = [
      { label: "Insist on carrying it yourself", next: "c1_10", effect: (st) => bump(st, { fame: 1, charisma: -1 }) },
      { label: "Let a teammate carry it", next: "c1_10", effect: (st) => bump(st, { honor: 1 }) },
      { label: "Suggest everyone take hold of it together", next: "c1_10", effect: (st) => bump(st, { empathy: 1, charisma: 1 }) }
    ];
    base.push({
      label: "Your reputation alone settles the question — no one objects",
      requires: { stat: 'fame', min: 3 },
      next: "c1_10",
      effect: (st) => bump(st, { fame: 1 })
    });
    return base;
  }
},


c1_10: {
  chapter: "Chapter 1 — Initiation",
  text: () => [
    `On the way back to the cliffs, you pass a classmate from another team, injured and struggling to walk, clearly falling behind their own group.`
  ],
  choices: [
    { label: "Help them, even though it slows you down", next: "c1_reveal", effect: (s) => bump(s, { empathy: 2, honor: 1 }) },
    { label: "Leave them — focus on your own team's return", next: "c1_reveal", effect: (s) => bump(s, { apathy: 1, corruption: 1 }) }
  ]
},


c1_reveal: {
  chapter: "Chapter 1 — Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_ch1');
    const banter = maybeBanter();
    return [
      `Back at the cliffs, Professor Ashworth reads out the team name: Team ${teamName(s)} — one initial from each of you, Sable, Denna, Thorne, and yours closing it out.`,
      `That night, alone for a moment, you find yourself turning over everything that happened today — how you handled it, what it might mean about who you're becoming.`,
      `<b>Chapter 1 — how you changed:</b>`,
      renderRevealHtml(d),
      `<b>Your team notices:</b>`,
      ...getCompanionReaction(s),
      ...(banter ? [banter] : [])
    ];
  },
  choices: [
    { label: "Begin Chapter 2", next: (s) => hasItem(s, 'Stolen Blade') ? 'c1_blade_confront' : 'c2_1', effect: (s) => { snapshot(s, 'snap_ch2'); saveCheckpoint('ch2', s, 'c2_1'); } }
  ]
},


c1_blade_confront: {
  chapter: "Chapter 1 — Interlude",
  text: () => [
    `During gear inspection, Denna's eyes catch on the blade at your hip — the one you picked up out in the Wildwood. She turns it over once in her hands, checking the maker's mark.`,
    `"This isn't academy-issued," she says. Not an accusation exactly. Not not one, either. "Where'd you get it?"`
  ],
  choices: [
    { label: "Admit you took it from an abandoned camp", next: "c2_1", effect: (s) => { bump(s, { honor: 1 }); bumpTrust(s, { denna: 1 }); } },
    { label: "Lie and say you've always had it", next: "c2_1", effect: (s) => { bump(s, { corruption: 1 }); bumpTrust(s, { denna: -1 }); s.flags.liedAboutBlade = true; } },
    { label: "Brush it off — refuse to explain", next: "c2_1", effect: (s) => { bump(s, { apathy: 1 }); bumpTrust(s, { denna: -2 }); } }
  ]
},

/* =========================================================
   CHAPTER 2 — CRACKS (10 choices)
   ========================================================= */


c2_1: {
  chapter: "Chapter 2 — Cracks",
  text: () => [
    `Weeks pass. Combat drills, Resonance theory, the slow grind of becoming what you're supposed to become.`,
    `Late one night you notice Sable slipping out past curfew, tense, careful not to be seen.`
  ],
  choices: [
    { label: "Follow quietly to see where she's going", next: "c2_2", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Let her go — it's not urgent yet", next: "c2_2", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


c2_2: {
  chapter: "Chapter 2 — Cracks",
  text: () => [
    `Kade, from the rival team, requests you specifically for the next sparring match — a chance to settle whatever's left over from the river crossing.`
  ],
  choices: [
    { label: "Ease off — let them save some dignity", next: "c2_3", effect: (s) => { bump(s, { empathy: 1 }); bumpRapport(s, 1); } },
    { label: "Go all out — this is how you get noticed", next: "c2_3", effect: (s) => { bump(s, { fame: 1, apathy: 1 }); bumpRapport(s, -1); } }
  ]
},


c2_3: {
  chapter: "Chapter 2 — Cracks",
  text: () => [
    `Professor Ashworth asks for volunteers for an unglamorous night patrol shift — thankless, but useful.`
  ],
  choices: (s) => {
    const base = [
      { label: "Volunteer", next: "c2_4", effect: (st) => bump(st, { resolve: 1, fame: 1 }) },
      { label: "Let someone else take it this time", next: "c2_4", effect: (st) => bump(st, { luck: 1 }) }
    ];
    base.push({
      label: "Volunteer for a second shift too — you can handle it",
      requires: { stat: 'resolve', min: 4 },
      next: "c2_4",
      effect: (st) => { bump(st, { resolve: 2, fame: 1 }); addItem(st, 'Academy Commendation Pin'); }
    });
    return base;
  }
},


c2_4: {
  chapter: "Chapter 2 — Cracks",
  text: () => [
    `The third time you catch Sable leaving, she notices you noticing.`
  ],
  choices: [
    { label: "Confront her directly — ask what's going on", next: "c2_5", effect: (s) => { bump(s, { honor: 2, empathy: 1 }); s.flags.teammateTrust = 'high'; bumpTrust(s, { sable: 2 }); } },
    { label: "Report the curfew violations to a teacher", next: "c2_5", effect: (s) => { bump(s, { honor: 1 }); s.flags.teammateTrust = 'medium'; bumpTrust(s, { sable: -1 }); } },
    { label: "Say nothing — it's probably not your business", next: "c2_5", effect: (s) => { bump(s, { apathy: 1 }); s.flags.teammateTrust = 'low'; bumpTrust(s, { sable: -2 }); } }
  ]
},


c2_5: {
  chapter: "Chapter 2 — Cracks",
  text: (s) => {
    if (s.flags.teammateTrust === 'high') {
      return [`"Sable. What's going on."`, `For a second she looks like she'll bolt — then her shoulders drop. "My brother," she says quietly. "He's mixed up in something in the lower town. I've been trying to talk him out of it."`];
    } else if (s.flags.teammateTrust === 'medium') {
      return [`You bring it to Professor Ashworth quietly. Sable gets pulled aside two days later. She won't quite meet your eyes afterward.`];
    } else {
      return [`You let it go. Sable keeps slipping out, keeps coming back tenser each time. You tell yourself it's not your business, and mostly believe it.`];
    }
  },
  choices: [
    { label: "Continue on patrol into the lower town", next: "c2_6" }
  ]
},


c2_6: {
  chapter: "Chapter 2 — Cracks",
  text: () => [
    `A figure bursts from an alley ahead — disheveled, breathing hard, flinching at every sound. Could be a threat. Could just be someone terrified.`
  ],
  choices: [
    { label: "Attack immediately — they look hostile", next: "c2_7", effect: (s) => { bump(s, { corruption: 2, honor: -2 }); s.flags.attackedInnocent = true; } },
    { label: "Draw your weapon, demand they identify themselves", next: "c2_7", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Approach calmly, hands visible", next: "c2_7", effect: (s) => bump(s, { empathy: 2, honor: 1 }) }
  ]
},


c2_7: {
  chapter: "Chapter 2 — Cracks",
  text: (s) => {
    if (s.flags.attackedInnocent) {
      return [
        `It's over before you realize your mistake — the "threat" was just a frightened dock worker who'd stumbled onto something he shouldn't have seen. He's hurt. Badly.`,
        `Your team goes quiet. Thorne puts himself slightly between you and the man on the ground, more instinct than accusation, but you feel it all the same.`
      ];
    }
    return [
      `The disheveled man turns out to be a dock worker, terrified — he'd stumbled onto something he shouldn't have seen: men moving crates that hummed faintly, wrongly.`,
      `Your team listens, and for once nobody's in a hurry to move on before he's finished talking.`
    ];
  },
  choices: (s) => s.flags.attackedInnocent ? [
    { label: "Own it — apologize and get him help", next: "c2_8", effect: (s) => { bump(s, { honor: 1, corruption: -1 }); removeStatus(s, 'shaken'); } },
    { label: "Justify it — he shouldn't have run", next: "c2_8", effect: (s) => { bump(s, { corruption: 1, apathy: 1 }); addStatus(s, 'shaken'); } }
  ] : [
    { label: "Continue", next: "c2_8" }
  ]
},


c2_8: {
  chapter: "Chapter 2 — Cracks",
  text: () => [
    `Word of the humming crates lines up with a rumor already circulating — stolen Resonance tech, moving through the lower town.`
  ],
  choices: (s) => {
    const base = [
      { label: "Investigate further yourself, off the books", next: (st) => st.hp <= 0 ? 'game_over' : 'c2_smuggler_fight', effect: (st) => bump(st, { resolve: 1, luck: -1 }) },
      { label: "Report it up the proper chain instead", next: "c2_9", effect: (st) => bump(st, { honor: 1 }) }
    ];
    base.push({
      label: "Trust your gut — you already half-know where this leads",
      requires: { stat: 'luck', min: 4 },
      next: (st) => st.hp <= 0 ? 'game_over' : 'c2_smuggler_fight',
      effect: (st) => bump(st, { luck: 1, resolve: 1 })
    });
    base.push({
      label: "Pocket the abandoned field journal you noticed nearby",
      next: "c2_9",
      effect: (st) => { bump(st, { resolve: 1 }); addItem(st, 'Field Journal'); }
    });
    return base;
  }
},


c2_smuggler_fight: {
  chapter: "Chapter 2 — Cracks",
  text: (s) => {
    const success = performCheck(s, 'resonance', 11);
    const r = s.flags.lastRoll;
    if (!success) {
      applyCombatDamage(s, 12);
      return [renderDiceRollHtml(r), `Going in alone off the books turns out to be exactly as reckless as it sounds — the smugglers themselves aren't willing to talk quietly, and it takes a real fight to get clear with what you came for.`];
    }
    return [renderDiceRollHtml(r), `You catch the smugglers off guard, and it's over before it becomes the fight it could have been.`];
  },
  choices: [{ label: "Continue", next: "c2_9" }]
},


c2_9: {
  chapter: "Chapter 2 — Cracks",
  text: () => [
    `A merchant, nervous about what you might have seen near his warehouse, quietly offers you money to forget about it.`
  ],
  choices: (s) => {
    const base = [
      { label: "Take the money", next: "c2_10", effect: (st) => { bump(st, { corruption: 2 }); addItem(st, 'Bribe Money'); } },
      { label: "Refuse", next: "c2_10", effect: (st) => bump(st, { honor: 1 }) }
    ];
    base.push({
      label: "Report him for even attempting this",
      requires: { stat: 'honor', min: 4 },
      next: "c2_10",
      effect: (st) => bump(st, { honor: 2, fame: 1 })
    });
    return base;
  }
},


c2_10: {
  chapter: "Chapter 2 — Cracks",
  text: () => [
    `The night before your team ships out on the mission Ashworth's been building toward, you have one more night to spend however you choose.`
  ],
  choices: [
    { label: "Get proper rest", next: "c2_reveal", effect: (s) => { bump(s, { resolve: 1 }); heal(s, 20); removeStatus(s, 'wounded'); } },
    { label: "Stay up training obsessively instead", next: "c2_reveal", effect: (s) => bump(s, { resonance: 1, resolve: -1 }) }
  ]
},


c2_reveal: {
  chapter: "Chapter 2 — Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_ch2');
    const banter = maybeBanter();
    return [
      `Word comes down the next morning: a village called Rangeholt has gone dark. Your team is being sent to find out why.`,
      `<b>Chapter 2 — how you changed:</b>`,
      renderRevealHtml(d),
      `<b>Your team notices:</b>`,
      ...getCompanionReaction(s),
      ...(banter ? [banter] : [])
    ];
  },
  choices: [
    { label: "Begin Chapter 3", next: (s) => maybeEncounter(s, pickSoloScene(s)), effect: (s) => { snapshot(s, 'snap_ch3'); saveCheckpoint('ch3', s, 'c3_1'); } }
  ]
},


c2_solo_sable: {
  chapter: "Chapter 2 — A Quiet Moment",
  text: () => [
    `Sable finds you alone in the courtyard, uncharacteristically quiet. "My brother's out for good now," she says. "Thanks to you, honestly. I don't say that kind of thing a lot."`,
    `She hesitates, like there's more she wants to say and isn't sure how.`
  ],
  choices: [
    { label: "Offer to help however you concretely can", next: "c3_1", effect: (s) => { bumpTrust(s, { sable: 2 }); bump(s, { empathy: 1 }); addStatus(s, 'inspired'); } },
    { label: "Just listen — she doesn't need you to fix anything", next: "c3_1", effect: (s) => { bumpTrust(s, { sable: 2 }); bump(s, { empathy: 1 }); addStatus(s, 'inspired'); } }
  ]
},


c2_solo_thorne: {
  chapter: "Chapter 2 — A Quiet Moment",
  text: () => [
    `Thorne catches you after drills, shield still on his back out of habit. "Can I ask you something," he says, then doesn't wait for an answer. "Do you ever worry you're not going to be strong enough when it actually matters?"`,
    `It's not a rhetorical question. He means it.`
  ],
  choices: [
    { label: "Reassure him — he's already proven himself", next: "c3_1", effect: (s) => { bumpTrust(s, { thorne: 2 }); bump(s, { honor: 1 }); addStatus(s, 'inspired'); } },
    { label: "Tell him the fear never fully goes away, and that's fine", next: "c3_1", effect: (s) => { bumpTrust(s, { thorne: 2 }); bump(s, { resolve: 1 }); addStatus(s, 'inspired'); } }
  ]
},


c2_solo_denna: {
  chapter: "Chapter 2 — A Quiet Moment",
  text: () => [
    `Denna corners you over maps of Rangeholt, more unsettled than her usual composure lets on. "I keep running the numbers on this mission and not liking what I get," she admits. "Tell me I'm wrong to be worried."`,
  ],
  choices: [
    { label: "Back her judgment — her instincts have earned trust", next: "c3_1", effect: (s) => { bumpTrust(s, { denna: 2 }); bump(s, { resolve: 1 }); addStatus(s, 'inspired'); } },
    { label: "Push back gently — worrying this much isn't like her", next: "c3_1", effect: (s) => { bumpTrust(s, { denna: 2 }); bump(s, { charisma: 1 }); addStatus(s, 'inspired'); } }
  ]
},

/* =========================================================
   CHAPTER 3 — THE SIGNAL (10 choices)
   ========================================================= */


c3_1: {
  chapter: "Chapter 3 — The Signal",
  text: () => [
    `Rangeholt is a day out. As you approach, the terrain grows tangled and unfamiliar.`
  ],
  choices: (s) => {
    const base = [
      { label: "Scout ahead alone to get a clearer picture", next: "c3_2", effect: (st) => { bump(st, { resonance: 1, luck: -1 }); bumpTrust(st, { denna: -1 }); } },
      { label: "Keep the team together the whole approach", next: "c3_2", effect: (st) => { bump(st, { empathy: 1 }); bumpTrust(st, { denna: 1 }); } }
    ];
    base.push({
      label: "Slip the whole team past unseen using Wraith illusion",
      requiresClass: 'Wraith',
      next: "c3_2",
      effect: (st) => { bump(st, { resonance: 1, luck: 1 }); bumpTrust(st, { denna: 1 }); }
    });
    return base;
  }
},


c3_2: {
  chapter: "Chapter 3 — The Signal",
  text: () => [
    `You find the village's outer edge — belongings scattered, abandoned in a hurry. Some of it still useful.`
  ],
  choices: [
    { label: "Search respectfully, disturb as little as possible", next: "c3_3", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Take what's useful for your team", next: "c3_3", effect: (s) => { bump(s, { corruption: 1 }); addItem(s, 'Looted Supplies'); } }
  ]
},


c3_3: {
  chapter: "Chapter 3 — The Signal",
  text: () => [
    `Rangeholt comes into full view at dusk — wrong before you're close enough to say why. No smoke, no lantern light, Hollow tracks arranged with unnatural order.`,
    `"That's not natural behavior," Denna says. "Something's directing them." The village is large enough that searching it properly will take time you may not have.`
  ],
  choices: [
    { label: "Stay together and clear the village as one team", next: "c3_4", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Split up to cover more ground faster", next: "c3_4", effect: (s) => { bump(s, { resonance: 1 }); s.flags.roughFight = true; } }
  ]
},


c3_4: {
  chapter: "Chapter 3 — The Signal",
  text: () => [
    `In the granary doorway, a Hollow-touched dog blocks your path, more frightened than aggressive, teeth bared out of panic rather than hunger.`
  ],
  choices: (s) => {
    const base = [
      { label: "Put it down quickly — no time to spare", next: (st) => st.hp <= 0 ? 'game_over' : 'c3_5', effect: (st) => {
          bump(st, { apathy: 1, resonance: 1 });
          const success = performCheck(st, 'resonance', 8);
          if (!success) { applyCombatDamage(st, 8); st.flags.deathContext = "the panicked dog gets a piece of you before it's over"; }
        } },
      { label: "Coax it gently out of the way", next: "c3_5", effect: (st) => { bump(st, { empathy: 1 }); st.flags.dogCompanion = true; } }
    ];
    base.push({
      label: "Raise a barrier to calmly contain it, unharmed",
      requiresClass: 'Bastion',
      next: "c3_5",
      effect: (st) => { bump(st, { empathy: 1, honor: 1 }); addStatus(st, 'inspired'); st.flags.dogCompanion = true; }
    });
    return base;
  }
},


c3_5: {
  chapter: "Chapter 3 — The Signal",
  text: (s) => {
    const lines = [];
    if (s.flags.dogCompanion && !s.flags.dogCompanionIntroduced) {
      s.flags.dogCompanionIntroduced = true;
      s.companionCreature = 'Loyal Hollow-Hound';
      lines.push(`The dog doesn't wander off once you're past it — it falls into step beside you instead, like it's decided you're its problem now.`);
    }
    lines.push(`Past the dog, you find them — a figure crouched at the center of a Hollow nest, hands wrapped in crackling, wrong-colored light.`);
    return lines;
  },
  choices: [
    { label: "Shout a warning first", next: (s) => s.hp <= 0 ? 'game_over' : 'c3_choice2', effect: (s) => { bump(s, { honor: 1 }); resolveCorinFight(s); } },
    { label: "Attack immediately to stop them", next: (s) => s.hp <= 0 ? 'game_over' : 'c3_choice2', effect: (s) => { bump(s, { corruption: 1, resonance: 1 }); resolveCorinFight(s); } },
    { label: "Watch a moment first to understand what they're doing", next: (s) => s.hp <= 0 ? 'game_over' : 'c3_choice2', effect: (s) => { bump(s, { empathy: 1, resolve: 1 }); resolveCorinFight(s); } }
  ]
},


c3_choice2: {
  chapter: "Chapter 3 — The Signal",
  text: (s) => {
    const r = s.flags.lastRoll;
    const rollHtml = r ? renderDiceRollHtml(r) : '';
    const bladeNote = (r && !r.success && hasItem(s, 'Stolen Blade')) ? `<i>The stolen blade in your hand takes the worst of it — could've been much worse without it.</i>` : '';
    if (r && !r.success) {
      return [rollHtml, bladeNote, `The fight is harder than it should be — genuinely dangerous, and you take a real hit before it's over. You win, but it costs you.`];
    } else if (r && r.success) {
      return [rollHtml, `The fight breaks quickly and cleanly. The figure — young, barely older than you — realizes they're outmatched and stops resisting.`];
    }
    return [`The fight resolves. The figure — young, barely older than you — realizes they're outmatched and stops resisting.`];
  },
  choices: [
    { label: "Take them in — this needs to be answered for", next: "c3_7", effect: (s) => { bump(s, { honor: 1 }); s.flags.suspect = 'captured'; } },
    { label: "Let them go for information about who taught them this", next: "c3_7", effect: (s) => { s.flags.suspect = 'released'; } }
  ]
},


c3_7: {
  chapter: "Chapter 3 — The Signal",
  text: (s) => {
    const trustworthy = s.stats.honor >= s.stats.corruption;
    if (s.flags.suspect === 'captured') {
      return trustworthy
        ? [`Their name is Corin. Something about how you've carried yourself so far puts them at ease enough to actually talk. "Vesk," they say. "Lower city. I'm not the only one."`]
        : [`Their name is Corin. They watch you carefully, clearly deciding how much they can safely admit. What you get is thin, evasive. "...Someone in the lower city," is all they'll confirm.`];
    } else {
      return trustworthy
        ? [`"Who taught you this," you ask, and something in how you've handled tonight makes them actually answer honestly. "Vesk," they say. "Lower city. There are others."`]
        : [`"Who taught you this," you ask. They read you carefully first — and give you the bare minimum. "Someone in the lower city," they mutter, clearly holding back more.`];
    }
  },
  choices: (s) => {
    const base = [
      { label: "Press harder for more information", next: "c3_8", effect: (st) => bump(st, { corruption: 1, resolve: 1 }) },
      { label: "Let them speak at their own pace", next: "c3_8", effect: (st) => bump(st, { empathy: 1 }) }
    ];
    base.push({
      label: "Win them over with genuine warmth",
      requires: { stat: 'charisma', min: 5 },
      next: "c3_8",
      effect: (st) => bump(st, { charisma: 1, empathy: 1 })
    });
    return base;
  }
},


c3_8: {
  chapter: "Chapter 3 — The Signal",
  text: () => [
    `Among Corin's things, a note hints at a second, unnamed accomplice still out there. Rangeholt's actual people, though, still need finding.`
  ],
  choices: [
    { label: "Pursue this new lead now", next: "c3_9", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Prioritize getting the villagers to safety first", next: "c3_9", effect: (s) => bump(s, { empathy: 1, honor: 1 }) },
    { label: "Take Vesk's notes for yourself before deciding", next: "c3_9", effect: (s) => { bump(s, { corruption: 1, resonance: 1 }); addItem(s, "Vesk's Notes"); } },
    { label: "Radio Kade's team, also nearby, to share what you found", next: "c3_9", effect: (s) => { bump(s, { honor: 1 }); bumpRapport(s, 2); } }
  ]
},


c3_9: {
  chapter: "Chapter 3 — The Signal",
  text: () => [
    `Rangeholt's people are found two valleys over, shaken but alive. One presses a small carved keepsake into your hands, insisting you take it.`
  ],
  choices: (s) => {
    const base = [
      { label: "Accept it graciously", next: "c3_10", effect: (st) => { bump(st, { fame: 1 }); addItem(st, "Villager's Keepsake"); } },
      { label: "Refuse — it's the job, not a favor", next: "c3_10", effect: (st) => bump(st, { honor: 1 }) },
      { label: "Ask for information instead of a keepsake", next: "c3_10", effect: (st) => bump(st, { resolve: 1 }) },
      { label: "Help salvage some old protective gear from the wreckage instead", next: "c3_10", effect: (st) => { bump(st, { resolve: 1 }); addItem(st, "Villager's Guard Vest"); } }
    ];
    base.push({
      label: "Sit with them a moment — they need more than a transaction right now",
      requires: { stat: 'empathy', min: 5 },
      next: "c3_10",
      effect: (st) => { bump(st, { empathy: 2, honor: 1 }); addItem(st, "Villager's Keepsake"); }
    });
    return base;
  }
},


c3_10: {
  chapter: "Chapter 3 — The Signal",
  text: () => [
    `Back at the academy, you report in to Ashworth. How much of tonight you actually tell her is up to you.`
  ],
  choices: [
    { label: "Give the full, honest account", next: "c3_reveal", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Smooth over the rougher parts", next: "c3_reveal", effect: (s) => bump(s, { corruption: 1, fame: 1 }) }
  ]
},


c3_reveal: {
  chapter: "Chapter 3 — Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_ch3');
    const banter = maybeBanter();
    return [
      `The name Vesk is passed up the chain, and a larger response is already being organized. Your team is asked — not ordered, asked — to be part of it.`,
      `<b>Chapter 3 — how you changed:</b>`,
      renderRevealHtml(d),
      `<b>Your team notices:</b>`,
      ...getCompanionReaction(s),
      ...(banter ? [banter] : [])
    ];
  },
  choices: [
    { label: "Begin Chapter 4", next: (s) => maybeEncounter(s, 'c4_1'), effect: (s) => { snapshot(s, 'snap_ch4'); saveCheckpoint('ch4', s, 'c4_1'); } }
  ]
},

/* =========================================================
   CHAPTER 4 — THE WEIGHT OF IT (10 choices)
   ========================================================= */


c4_1: {
  chapter: "Chapter 4 — The Weight of It",
  text: () => [
    `Vesk's operation turns out to be bigger than anyone expected — a compound in an old quarry. Before the strike, someone asks what's actually driving you into this.`
  ],
  choices: [
    { label: "Duty to your team", next: "c4_2", effect: (s) => bump(s, { honor: 1 }) },
    { label: "A need to see this threat ended, personally", next: "c4_2", effect: (s) => bump(s, { resolve: 1, resonance: 1 }) },
    { label: "A chance to prove what you can do", next: "c4_2", effect: (s) => bump(s, { fame: 1 }) }
  ]
},


c4_2: {
  chapter: "Chapter 4 — The Weight of It",
  text: () => [
    `A younger student on the strike team, clearly nervous, asks you privately if this is going to be alright.`
  ],
  choices: (s) => {
    const base = [
      { label: "Be honest, including about the risks", next: "c4_3", effect: (st) => bump(st, { honor: 1, empathy: 1 }) },
      { label: "Tell them what they need to hear to stay calm", next: "c4_3", effect: (st) => bump(st, { charisma: 1, corruption: 1 }) }
    ];
    base.push({
      label: "Steady them with your own unshakeable calm",
      requires: { stat: 'resolve', min: 6 },
      next: "c4_3",
      effect: (st) => { bump(st, { resolve: 1, empathy: 1 }); addStatus(st, 'inspired'); }
    });
    return base;
  }
},


c4_3: {
  chapter: "Chapter 4 — The Weight of It",
  text: () => [
    `Breaching the compound, you find caged Hollow test subjects along the corridor — pulling them free now would slow you down and risks chaos, but leaving them isn't guaranteed safe either.`
  ],
  choices: [
    { label: "Free them now, whatever the risk", next: "c4_4", effect: (s) => bump(s, { empathy: 1, luck: -1 }) },
    { label: "Leave them for the extraction team", next: "c4_4", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


c4_4: {
  chapter: "Chapter 4 — The Weight of It",
  text: () => [
    `A Vesk lieutenant, cornered, offers real information in exchange for being allowed to slip away.`
  ],
  choices: [
    { label: "Take the deal", next: "c4_5", effect: (s) => bump(s, { corruption: 1, resolve: 1 }) },
    { label: "Refuse — fight instead", next: "c4_5", effect: (s) => bump(s, { honor: 1, resonance: 1 }) }
  ]
},


c4_5: {
  chapter: "Chapter 4 — The Weight of It",
  text: (s) => s.flags.suspect === 'released'
    ? [`Corin is here too, caught between Vesk's people and your team, clearly torn on which side they're actually on.`]
    : [`A captured operative pleads for mercy as your team pushes deeper into the compound.`],
  choices: (s) => s.flags.suspect === 'released' ? [
    { label: "Trust Corin to help", next: "c4_6", effect: (s) => bump(s, { empathy: 1 }) },
    { label: "Keep them at arm's length", next: "c4_6", effect: (s) => bump(s, { apathy: 1 }) }
  ] : [
    { label: "Show mercy", next: "c4_6", effect: (s) => bump(s, { empathy: 1, honor: 1 }) },
    { label: "You don't have time for mercy", next: "c4_6", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


c4_6: {
  chapter: "Chapter 4 — The Weight of It",
  text: () => [
    `You reach Vesk's inner chamber. They turn as you enter, unbothered, a cage release switch already under one hand. "Four kids," they say. "Ashworth really is getting desperate."`
  ],
  choices: (s) => {
    const base = [
      { label: "Try to talk them down first", next: "c4_final_choice", effect: (st) => bump(st, { honor: 1, charisma: 1 }) },
      { label: "Go in weapons-ready — no negotiation", next: "c4_final_choice", effect: (st) => bump(st, { resonance: 1 }) }
    ];
    base.push({
      label: "Let your Resonance power show — intimidate them into hesitating",
      requires: { stat: 'resonance', min: 6 },
      next: "c4_final_choice",
      effect: (st) => bump(st, { resonance: 1, fame: 1 })
    });
    return base;
  }
},


c4_final_choice: {
  chapter: "Chapter 4 — The Weight of It",
  text: () => [
    `Vesk hits the release. Cages open. Dozens of Hollow, and no time to fight them all — the quarry entrance is collapsing under the strain of the fight above.`,
    `You could hold the line here, protecting your team while the entrance seals, letting Vesk slip out in the chaos — or chase Vesk down now, sealing this for good, and hope your team can hold on their own.`
  ],
  choices: [
    { label: "Stay. Protect your team, let Vesk go.", next: (s) => s.hp <= 0 ? 'game_over' : 'c4_9', effect: (s) => {
        bump(s, { honor: 2, empathy: 2 });
        s.flags.finalChoice = 'team';
        const success = performCheck(s, 'resonance', 15);
        if (!success) { applyCombatDamage(s, 45); s.flags.deathContext = "the collapsing quarry entrance nearly buries you along with everything else"; }
      } },
    { label: "Go after Vesk. Finish this, whatever it costs.", next: (s) => s.hp <= 0 ? 'game_over' : 'c4_9', effect: (s) => {
        bump(s, { resonance: 2, resolve: 1 });
        s.flags.finalChoice = 'mission';
        const success = performCheck(s, 'resonance', 15);
        if (!success) { applyCombatDamage(s, 45); s.flags.deathContext = "Vesk gets one last, brutal hit in before the end"; }
      } }
  ]
},


c4_9: {
  chapter: "Chapter 4 — Resolution",
  text: (s) => {
    const r = s.flags.lastRoll;
    const rollHtml = r ? renderDiceRollHtml(r) : '';
    const outcomeText = s.flags.finalChoice === 'team'
      ? `You stay. The four of you hold the line together as the quarry seals around you, Vesk's escape a loose thread for another day. Everyone walks out. That's not nothing.`
      : `You go after Vesk alone, trusting your team to hold without you. The fight at the collapsing entrance is short, ugly, and final. Vesk doesn't walk away from it. Neither, quite, do you.`;
    const woundNote = (r && !r.success) ? `You're carried out more than you walk out — battered badly, but alive.` : '';
    const thorneTrust = (s.trust && s.trust.thorne) || 0;
    let thorneNote = '';
    if (thorneTrust <= -2) {
      thorneNote = `Thorne hesitates for half a second at the worst possible moment — the kind of hesitation that didn't used to be there between you.`;
    } else if (thorneTrust >= 3) {
      thorneNote = `Thorne doesn't hesitate for a second, shield already where it needs to be before you've finished the thought. That's what months of trust buys you.`;
    }
    const rapport = s.flags.rivalRapport || 0;
    let kadeNote = '';
    if (rapport >= 3) {
      kadeNote = `Kade's team shows up at the collapsing entrance without being asked, covering the retreat you didn't know you'd need. "We're not that different," Kade says, and for once doesn't make it sound like an insult.`;
    } else if (rapport <= -2) {
      kadeNote = `Kade's team is nowhere near the compound when it collapses — word gets around later that they'd heard about the operation and simply didn't bother mentioning it to you.`;
    }
    return [rollHtml, outcomeText, woundNote, thorneNote, kadeNote].filter(Boolean);
  },
  choices: [
    { label: "Check on your teammates first", next: "c4_10", effect: (s) => bump(s, { empathy: 1, honor: 1 }) },
    { label: "Secure the site first", next: "c4_10", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


c4_10: {
  chapter: "Chapter 4 — Resolution",
  text: () => [
    `In the quiet after, you have a moment to decide how you're going to carry tonight forward.`
  ],
  choices: [
    { label: "Hold onto what happened — let it matter", next: "c4_reveal", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Let it go and move forward", next: "c4_reveal", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


c4_reveal: {
  chapter: "Chapter 4 — Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_ch4');
    const tier = getEndingTier(s);
    s.flags.endingTier = tier;

    const endingText = tier === 'united'
      ? [`<b>ENDING: UNITED</b>`, `Whatever the cost of tonight, Team ${teamName(s)} walks out of it having trusted each other when it mattered, and it showed. Doors that would otherwise stay shut for a first-year graduate start to open.`]
      : tier === 'costly'
      ? [`<b>ENDING: COSTLY VICTORY</b>`, `The mission succeeds, but something in the team didn't come through this clean. You graduate with a record that's solid, respected even, but not the kind that opens every door.`]
      : [`<b>ENDING: WHAT WE LOST</b>`, `The mission is technically resolved, but the cost sits heavier than anyone admits. Ashworth's report is quieter than you'd like. Doors don't open so much as narrow.`];

    return [
      `<b>Chapter 4 — how you changed:</b>`,
      renderRevealHtml(d),
      `<b>Your team, in the end:</b>`,
      ...getCompanionReaction(s),
      ...endingText
    ];
  },
  choices: [
    { label: "Continue to Graduation", next: "grad_bridge", effect: (s) => saveCheckpoint('parttwo', s, 'grad_bridge') }
  ]
},

/* =========================================================
   PART TWO BRIDGE
   ========================================================= */


grad_bridge: {
  chapter: "Part Two — Graduation",
  text: (s) => [
    `Months pass. The quarry incident becomes a case file, then a memory, then a line on a transcript. Graduation comes, as it always does, whether or not you feel ready for it.`,
    `Team ${teamName(s)} scatters — the way most teams eventually do — and the work you're offered next says a great deal about how the last year was read by the people deciding your future.`
  ],
  choices: [ { label: "See your options", next: "job_select" } ]
},


job_select: {
  chapter: "Part Two — Choose Your Path",
  text: (s) => {
    const tier = s.flags.endingTier;
    const label = tier === 'united' ? "Your record is spotless. Prestigious doors are open."
      : tier === 'costly' ? "Your record is solid, if unremarkable. Steady work, not glamorous."
      : "Your record is a liability. The official path isn't open to you anymore.";
    return [label];
  },
  choices: (s) => {
    const tier = s.flags.endingTier;
    const options = JOBS_BY_TIER[tier];
    return options.map(jobId => ({
      label: JOBS[jobId].label,
      next: jobId === 'council' ? 'council_ch1_1' : (jobId === 'bandit' ? 'bandit_ch1_1' : (jobId === 'guard' ? 'guard_ch1_1' : 'job_chapter_intro')),
      effect: (st) => { st.flags.job = jobId; if (jobId === 'bandit') snapshot(st, 'snap_bandit1'); if (jobId === 'guard') snapshot(st, 'snap_guard1'); }
    }));
  }
},

/* =========================================================
   PART TWO — COUNCIL INVESTIGATOR ARC
   4 chapters, 10 decisions each, scaled-up skill checks,
   item trade-ins, and a Part One teammate cameo.
   ========================================================= */

/* ---------------- CHAPTER 1: THE ASSIGNMENT ---------------- */


sidequest_sable_1: {
  chapter: "Side Quest — Sable's Brother",
  text: () => [
    `Sable hesitates at the door, like there's more she wants to say. "He's out of Vesk's old network," she admits, "but 'out' isn't the same as 'okay.' He's barely keeping himself together. I don't know how to help him and also do my job."`,
    `She doesn't ask you for anything. It's obvious she wants to, though.`
  ],
  choices: [
    { label: "Offer to help before you leave town", next: "sidequest_sable_2", effect: (s) => bump(s, { empathy: 1 }) },
    { label: "Gently point out this isn't your case to solve", next: "council_ch2_reveal", effect: (s) => { bump(s, { resolve: 1 }); bumpTrust(s, { sable: -1 }); } }
  ]
},


sidequest_sable_2: {
  chapter: "Side Quest — Sable's Brother",
  text: () => [
    `You track him down at a halfway shelter on the edge of the lower city — thinner than you remember, jumpy, but sober. He doesn't recognize you, but he recognizes the look on Sable's face when she sees him.`
  ],
  choices: (s) => {
    const base = [
      { label: "Offer him honest, practical help — a real path forward", next: "sidequest_sable_3", effect: (st) => bump(st, { honor: 1, empathy: 1 }) },
      { label: "Pull rank — a Council word can open doors quietly", next: "sidequest_sable_3", effect: (st) => bump(st, { fame: 1, corruption: 1 }) }
    ];
    base.push({
      label: "Vouch for him personally, stake your own reputation on it",
      requires: { stat: 'honor', min: 8 },
      next: "sidequest_sable_3",
      effect: (st) => bump(st, { honor: 2 })
    });
    return base;
  }
},


sidequest_sable_3: {
  chapter: "Side Quest — Sable's Brother",
  text: (s) => [
    `Whatever you did, it's enough for now — a real start, if he takes it. Sable doesn't say much on the walk back, but she doesn't need to. Some things you can see on someone's face.`,
    `"I owe you," she says finally. "I mean that."`
  ],
  choices: [
    { label: "Continue", next: "council_ch2_reveal", effect: (s) => { bumpTrust(s, { sable: 3 }); addItem(s, "Sable's Keepsake Charm"); } }
  ]
},


});
