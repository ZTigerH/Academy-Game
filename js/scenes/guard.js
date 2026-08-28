/* =========================================================
   PART TWO - KINGDOM GUARD ELITE ARC
   4 chapters, 10 decisions each.
   ========================================================= */

Object.assign(SCENES, {

guard_ch1_1: {
  chapter: "Guard Ch.1 - The Gate",
  text: () => [
    `Commander Petra Voll doesn't waste words. "Elite doesn't mean easy," she says, looking you over once. "It means people are watching closer. Report to the east gate at dawn."`
  ],
  choices: [
    { label: "Arrive early, get a feel for the post first", next: "guard_ch1_2", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Arrive precisely on time, no more, no less", next: "guard_ch1_2", effect: (s) => bump(s, { honor: 1 }) }
  ]
},


guard_ch1_2: {
  chapter: "Guard Ch.1 - The Gate",
  text: () => [
    `Corporal Bram Ellery is already at the gate, visibly unimpressed by the idea of a huntsman-track recruit getting dropped into an Elite posting. "Let's see if the reputation's earned," he says, not quite hiding the challenge in it.`
  ],
  choices: [
    { label: "Match his tone - let him test you", next: "guard_ch1_3", effect: (s) => bump(s, { charisma: 1 }) },
    { label: "Stay professional, don't take the bait", next: "guard_ch1_3", effect: (s) => bump(s, { honor: 1 }) }
  ]
},


guard_ch1_3: {
  chapter: "Guard Ch.1 - The Gate",
  text: () => [
    `The morning's routine - inspections, rotations, the unglamorous backbone of the job. Ellery watches how you handle the boring parts as closely as he'd watch a fight.`
  ],
  choices: [
    { label: "Take the routine seriously, no shortcuts", next: "guard_ch1_4", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Get through it efficiently and move on", next: "guard_ch1_4", effect: (s) => bump(s, { luck: 1 }) }
  ]
},


guard_ch1_4: {
  chapter: "Guard Ch.1 - The Gate",
  text: (s) => hasItem(s, 'Ridgeback Scale')
    ? [`The gate quartermaster recognizes a real Hollow trophy when she sees one. "That'll get you proper Guard-issue kit instead of the standard loadout," she offers.`]
    : [`Nothing in the quartermaster's stores today catches your eye or matches anything you're carrying.`],
  choices: (s) => {
    if (!hasItem(s, 'Ridgeback Scale')) return [{ label: "Continue", next: "guard_ch1_5" }];
    return [
      { label: "Trade the scale for a Captain's Insignia", next: "guard_ch1_5", effect: (st) => {
          removeItem(st, 'Ridgeback Scale');
          addItem(st, "Captain's Insignia");
        } },
      { label: "Keep it - it's earned, not tradeable", next: "guard_ch1_5", effect: (st) => bump(st, { honor: 1 }) }
    ];
  }
},


guard_ch1_5: {
  chapter: "Guard Ch.1 - The Gate",
  text: () => [
    `Midday, a merchant caravan reports something shadowing them on the north road - could be nothing, could be the first real test of the posting.`
  ],
  choices: (s) => {
    const base = [
      { label: "Investigate personally, right away", next: "guard_ch1_6", effect: (st) => bump(st, { resolve: 1 }) },
      { label: "Send a scout patrol first, follow if needed", next: "guard_ch1_6", effect: (st) => bump(st, { honor: 1 }) }
    ];
    base.push({
      label: "You already know exactly what this is going to be",
      requires: { stat: 'luck', min: 7 },
      next: "guard_ch1_6",
      effect: (st) => bump(st, { luck: 1, resolve: 1 })
    });
    return base;
  }
},


guard_ch1_6: {
  chapter: "Guard Ch.1 - The Gate",
  text: () => [
    `Ellery insists on coming along, whether or not you asked. "Elite or not," he says, "nobody goes out solo on my watch."`
  ],
  choices: [
    { label: "Let him come - smart call anyway", next: "guard_ch1_7", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Insist on going alone regardless", next: "guard_ch1_7", effect: (s) => bump(s, { fame: 1, corruption: 1 }) }
  ]
},


guard_ch1_7: {
  chapter: "Guard Ch.1 - The Gate",
  text: (s) => {
    const success = performCheck(s, 'resonance', 13);
    const r = s.flags.lastRoll;
    if (!success) {
      applyCombatDamage(s, 16);
      return [renderDiceRollHtml(r), `Whatever's shadowing the caravan turns out to be more coordinated than a stray Hollow has any right to be - it takes a real fight to drive it off clean.`];
    }
    return [renderDiceRollHtml(r), `The threat breaks off fast once it realizes it's been spotted, but not before you get a good look - organized, deliberate, not a normal pattern.`];
  },
  choices: (s) => s.hp <= 0 ? [{ label: "...", next: "game_over" }] : [{ label: "Continue", next: "guard_ch1_8" }]
},


guard_ch1_8: {
  chapter: "Guard Ch.1 - The Gate",
  text: () => [
    `Back at the gate, you have to decide how to file the report - the "organized, deliberate" detail is the kind of thing that either gets taken seriously or gets you flagged as overcautious.`
  ],
  choices: [
    { label: "Report it exactly as seen, full detail", next: "guard_ch1_9", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Keep the report simple - a routine incident", next: "guard_ch1_9", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


guard_ch1_9: {
  chapter: "Guard Ch.1 - The Gate",
  text: () => [
    `Commander Voll reads the report without much visible reaction, the way she seems to read everything. "Noted," is all she says. It's hard to tell if that's dismissal or something else.`
  ],
  choices: [
    { label: "Push for a direct answer from her", next: "guard_ch1_10", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Let it go - she'll say more when she's ready", next: "guard_ch1_10", effect: (s) => bump(s, { luck: 1 }) }
  ]
},


guard_ch1_10: {
  chapter: "Guard Ch.1 - The Gate",
  text: () => [
    `Ellery falls into step beside you at the end of the shift, some of the earlier edge gone. "First day's usually worse," he admits. "You did alright."`
  ],
  choices: [
    { label: "Take the compliment plainly", next: "guard_ch1_reveal", effect: (s) => bump(s, { charisma: 1 }) },
    { label: "Deflect it back onto the team effort", next: "guard_ch1_reveal", effect: (s) => bump(s, { empathy: 1 }) }
  ]
},


guard_ch1_reveal: {
  chapter: "Guard Ch.1 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_guard1');
    bumpGold(s, 100);
    return [
      `First day done. Whatever shadowed that caravan wasn't random - and something in how Voll took the report suggests she already suspected as much.`,
      `<b>Chapter 1 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>You've earned 100 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "guard_hub_1" }
  ]
},


guard_hub_1: {
  chapter: "The Barracks - Between Shifts",
  text: (s) => [
    `Off-duty hours, brief as they are. Time to patch up, spend what you've earned, and hear the rumor mill.`,
    `<i>Word is a bandit crew leader up north is renegotiating everything about how they operate. Somewhere else, a Council investigator's chasing something that goes higher than expected.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Patch yourself up to full HP", requiresGold: 50, next: "guard_hub_1", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See the barracks healer to cure Wounded", requiresGold: 30, next: "guard_hub_1", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'guard_hub_1'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'guard_hub_1'; } });
    opts.push({ label: "Continue to Chapter 2", next: "guard_ch2_1", effect: (st) => snapshot(st, 'snap_guard2') });
    return opts;
  }
},

/* ---------------- CHAPTER 2: CRACKS IN THE WALL ---------------- */


guard_ch2_1: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: () => [
    `Three more "routine" incidents hit different gates over the next week, each one a little too organized to be coincidence. Someone's testing the capital's defenses systematically.`
  ],
  choices: [
    { label: "Bring the pattern to Voll directly", next: "guard_ch2_2", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Investigate quietly on your own first", next: "guard_ch2_2", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


guard_ch2_2: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: () => [
    `Ellery's noticed the pattern too, independently. "Someone with real resources is behind this," he says. "That's not street-level troublemaking."`
  ],
  choices: [
    { label: "Agree, and start thinking about who benefits", next: "guard_ch2_3", effect: (s) => bump(s, { resolve: 1 }) },
    { label: "Stay focused on defense, not motive", next: "guard_ch2_3", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


guard_ch2_3: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: () => [
    `Whoever's behind this, you want a perspective from outside the Guard's own chain of command - someone who'd actually tell you the truth.`
  ],
  choices: [
    { label: "Reach out to your old teammate", next: "guard_ch2_4", effect: (s) => bump(s, { empathy: 1 }) }
  ]
},


guard_ch2_4: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: (s) => {
    const cameo = pickCameo(s);
    s.flags.cameoName = cameo.name;
    s.flags.cameoKey = cameo.key;
    const lines = {
      sable: `Sable whistles low at the sight of you in Guard colors. "Look at you, official and everything." Then, serious: "Okay. What's actually going on?"`,
      thorne: `Thorne looks entirely unsurprised to see you here - like Guard duty was always the obvious fit. "Tell me what you need," he says, already all business.`,
      denna: `Denna's already spotted the pattern in the incident reports before you finish explaining them. "This isn't random," she confirms. "Someone's mapping your response times."`
    };
    return [lines[cameo.key]];
  },
  choices: [
    { label: "Bring them fully into your confidence", next: "guard_ch2_5", effect: (s) => bumpTrust(s, { [s.flags.cameoKey]: 1 }) },
    { label: "Keep some of it back - official channels only", next: "guard_ch2_5", effect: (s) => { bump(s, { corruption: 1 }); bumpTrust(s, { [s.flags.cameoKey]: -1 }); } }
  ]
},


guard_ch2_5: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: (s) => hasItem(s, "Vesk's Notes")
    ? [`Vesk's old notes turn out to be relevant here too - the resurfacing tech signatures match methods described in them almost exactly.`]
    : [`Without hard documentation to compare against, you're working off pattern-matching alone.`],
  choices: (s) => {
    if (!hasItem(s, "Vesk's Notes")) return [{ label: "Continue", next: "guard_ch2_6" }];
    return [
      { label: "Cross-reference the notes against the incidents", next: "guard_ch2_6", effect: (st) => {
          removeItem(st, "Vesk's Notes");
          bump(st, { resonance: 1, honor: 1 });
        } },
      { label: "Hold onto them - not ready to hand this over yet", next: "guard_ch2_6", effect: (st) => bump(st, { corruption: 1 }) }
    ];
  }
},


guard_ch2_6: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: () => [
    `The pattern points toward Magistrate Corwin Drell's office - specifically, toward emergency powers legislation that's been quietly stalled for months, and would sail through if the capital felt under siege.`
  ],
  choices: (s) => {
    const base = [
      { label: "Pursue the lead, regardless of Drell's rank", next: "guard_ch2_7", effect: (st) => bump(st, { honor: 1 }) },
      { label: "Tread very carefully - accusing a Magistrate is serious", next: "guard_ch2_7", effect: (st) => bump(st, { corruption: 1 }) }
    ];
    base.push({
      label: "Rank's never stopped you from doing the right thing",
      requires: { stat: 'resolve', min: 8 },
      next: "guard_ch2_7",
      effect: (st) => bump(st, { resolve: 1, honor: 1 })
    });
    return base;
  }
},


guard_ch2_7: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: (s) => {
    const success = performCheck(s, 'resonance', 13);
    const r = s.flags.lastRoll;
    if (!success) {
      return [renderDiceRollHtml(r), `Checking Drell's known associates gets messier than planned - one of his people nearly catches you and ${s.flags.cameoName} at it.`];
    }
    return [renderDiceRollHtml(r), `You and ${s.flags.cameoName} move clean through Drell's known associates without drawing any attention at all.`];
  },
  choices: [{ label: "Continue", next: "guard_ch2_8" }]
},


guard_ch2_8: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: () => [
    `One of Drell's junior aides turns out to be feeding information out of fear, not loyalty - clearly in over their head and looking for a way out.`
  ],
  choices: [
    { label: "Offer them real protection in exchange for help", next: "guard_ch2_9", effect: (s) => bump(s, { honor: 1, empathy: 1 }) },
    { label: "Use their fear to your advantage instead", next: "guard_ch2_9", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


guard_ch2_9: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: () => [
    `You've got enough now to bring this to Voll properly - not a full case, but more than a hunch.`
  ],
  choices: [
    { label: "Bring her everything, unfiltered", next: "guard_ch2_10", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Sit on it a little longer, build more first", next: "guard_ch2_10", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


guard_ch2_10: {
  chapter: "Guard Ch.2 - Cracks in the Wall",
  text: (s) => [
    `${s.flags.cameoName} heads out before it gets more dangerous to be seen with you. "Watch yourself," they say. "Whoever's doing this wants the capital scared. Don't let them make you reckless too."`
  ],
  choices: [
    { label: "Continue", next: "guard_ch2_reveal", effect: (s) => bumpTrust(s, { [s.flags.cameoKey]: 1 }) }
  ]
},


guard_ch2_reveal: {
  chapter: "Guard Ch.2 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_guard2');
    bumpGold(s, 125);
    return [
      `Magistrate Drell. A name, a motive, and a pattern of incidents that's about to get a lot more serious if he's not stopped soon.`,
      `<b>Chapter 2 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>You've earned 125 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "guard_hub_2" }
  ]
},


guard_hub_2: {
  chapter: "The Barracks - Between Shifts",
  text: (s) => [
    `Drell's name changes the stakes considerably. Worth preparing properly.`,
    `<i>Somewhere, apparently, a black market dealer is wrestling with exactly how far they're willing to go. A bounty hunter's reconsidering what the job's actually supposed to mean.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Patch yourself up to full HP", requiresGold: 50, next: "guard_hub_2", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See the barracks healer to cure Wounded", requiresGold: 30, next: "guard_hub_2", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'guard_hub_2'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'guard_hub_2'; } });
    opts.push({ label: "Continue to Chapter 3", next: "guard_ch3_1", effect: (st) => snapshot(st, 'snap_guard3') });
    return opts;
  }
},

/* ---------------- CHAPTER 3: THE MAGISTRATE'S HAND ---------------- */


guard_ch3_1: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `Voll takes the report seriously - seriously enough that she warns you Drell has real friends who'll want this buried fast if it gets out too early.`
  ],
  choices: [
    { label: "Push forward anyway, carefully", next: "guard_ch3_2", effect: (s) => bump(s, { resolve: 1, honor: 1 }) },
    { label: "Slow the pace to avoid tipping anyone off", next: "guard_ch3_2", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


guard_ch3_2: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `Ellery starts getting unusually specific questions from people above his usual chain of command - someone's fishing for what the Guard actually knows.`
  ],
  choices: [
    { label: "Have him report every question, verbatim", next: "guard_ch3_3", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Tell him to play dumb and give nothing away", next: "guard_ch3_3", effect: (s) => bump(s, { resolve: 1 }) }
  ]
},


guard_ch3_3: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `Your quarters get searched while you're on shift - nothing taken, nothing damaged, just a very clear message that someone knows exactly how close you are.`
  ],
  choices: (s) => {
    const base = [
      { label: "Report the break-in through proper channels", next: "guard_ch3_4", effect: (st) => bump(st, { honor: 1 }) },
      { label: "Handle it quietly - official channels might leak", next: "guard_ch3_4", effect: (st) => bump(st, { corruption: 1 }) }
    ];
    base.push({
      label: "Use it - let them think they got away with it",
      requires: { stat: 'corruption', min: 6 },
      next: "guard_ch3_4",
      effect: (st) => bump(st, { corruption: 1, resonance: 1 })
    });
    return base;
  }
},


guard_ch3_4: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `Voll calls you in. "I can pull you off this," she says, plainly. "Or I can not hear you say you want to keep going. Your call, not mine."`
  ],
  choices: [
    { label: "Tell her plainly you're not stopping", next: "guard_ch3_5", effect: (s) => bump(s, { honor: 1, resolve: 1 }) },
    { label: "Ask her to make the call for you", next: "guard_ch3_5", effect: (s) => bump(s, { apathy: 1 }) }
  ]
},


guard_ch3_5: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `An anonymous source offers hard evidence against Drell - for a price, or a favor owed later, no names attached to either side of the exchange.`
  ],
  choices: [
    { label: "Take the deal, whatever it costs later", next: "guard_ch3_6", effect: (s) => bump(s, { corruption: 2, resolve: 1 }) },
    { label: "Refuse - build this case clean, no shortcuts", next: "guard_ch3_6", effect: (s) => bump(s, { honor: 2 }) }
  ]
},


guard_ch3_6: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `Drell requests a private audience with you directly - cordial, on the surface, and unmistakably a warning underneath the courtesy.`
  ],
  choices: (s) => {
    const base = [
      { label: "Attend, and see what you can learn", next: "guard_ch3_7", effect: (st) => bump(st, { resolve: 1 }) },
      { label: "Decline - you don't owe him the meeting", next: "guard_ch3_7", effect: (st) => bump(st, { honor: 1 }) }
    ];
    base.push({
      label: "Attend, and make it clear you're not intimidated",
      requires: { stat: 'charisma', min: 8 },
      next: "guard_ch3_7",
      effect: (st) => bump(st, { charisma: 1, fame: 1 })
    });
    return base;
  }
},


guard_ch3_7: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: (s) => {
    const success = performCheck(s, 'resonance', 15);
    const r = s.flags.lastRoll;
    if (!success) {
      applyCombatDamage(s, 20);
      return [renderDiceRollHtml(r), `Someone makes a real attempt to make sure this investigation ends with you - a close, ugly encounter on the walk back that leaves no doubt how far Drell's willing to go.`];
    }
    return [renderDiceRollHtml(r), `Someone makes an attempt on you on the walk back - you see it coming and get clear of it before it becomes a real problem.`];
  },
  choices: (s) => s.hp <= 0 ? [{ label: "...", next: "game_over" }] : [{ label: "Continue", next: "guard_ch3_8" }]
},


guard_ch3_8: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `Attempted assault on a Guard officer is a serious charge, and you now have real grounds to use it.`
  ],
  choices: [
    { label: "File it formally, on the record", next: "guard_ch3_9", effect: (s) => bump(s, { honor: 1, fame: 1 }) },
    { label: "Keep it off the books, use it as private leverage", next: "guard_ch3_9", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


guard_ch3_9: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `The case is nearly complete. One thing would make it undeniable - testimony from someone inside Drell's own staff, willing to go on record.`
  ],
  choices: [
    { label: "Offer real protection in exchange for testimony", next: "guard_ch3_10", effect: (s) => bump(s, { honor: 1, empathy: 1 }) },
    { label: "Apply pressure - there's no time to be gentle", next: "guard_ch3_10", effect: (s) => bump(s, { corruption: 1 }) }
  ]
},


guard_ch3_10: {
  chapter: "Guard Ch.3 - The Magistrate's Hand",
  text: () => [
    `The testimony comes through. Whatever Drell's planning next, it's not going to stay quiet much longer.`
  ],
  choices: [
    { label: "Continue", next: "guard_ch3_reveal" }
  ]
},


guard_ch3_reveal: {
  chapter: "Guard Ch.3 - Reflection",
  text: (s) => {
    const d = deltaSince(s, 'snap_guard3');
    bumpGold(s, 150);
    return [
      `The case is built. Drell doesn't know it's finished yet - but whatever he's planning, it's coming soon, and it's going to be big enough to force the emergency powers through on its own.`,
      `<b>Chapter 3 - how you changed:</b>`,
      renderRevealHtml(d),
      `<b>You've earned 150 gold.</b>`
    ];
  },
  choices: [
    { label: "Continue", next: "guard_hub_3" }
  ]
},


guard_hub_3: {
  chapter: "The Barracks - Between Shifts",
  text: (s) => [
    `One last quiet stretch before whatever Drell's planning arrives. Use it well.`,
    `<i>Somewhere, apparently, an academy instructor is watching a student repeat old mistakes. A frontier huntsman is bracing an outpost for something coming.</i>`
  ],
  choices: (s) => {
    const opts = [];
    if (s.hp < s.maxHp) {
      opts.push({ label: "Patch yourself up to full HP", requiresGold: 50, next: "guard_hub_3", effect: (st) => { bumpGold(st, -50); heal(st, st.maxHp); } });
    }
    if (hasStatus(s, 'wounded')) {
      opts.push({ label: "See the barracks healer to cure Wounded", requiresGold: 30, next: "guard_hub_3", effect: (st) => { bumpGold(st, -30); removeStatus(st, 'wounded'); } });
    }
    opts.push({ label: "Visit the quartermaster's shop", next: "gear_shop", effect: (st) => { st.flags.returnToHub = 'guard_hub_3'; } });
    opts.push({ label: "Visit the gambling den", next: "gambling_den", effect: (st) => { st.flags.returnToHub = 'guard_hub_3'; } });
    opts.push({ label: "Continue to Chapter 4", next: "guard_ch4_1", effect: (st) => snapshot(st, 'snap_guard4') });
    return opts;
  }
},

/* ---------------- CHAPTER 4: THE SIEGE ---------------- */


guard_ch4_1: {
  chapter: "Guard Ch.4 - The Siege",
  text: () => [
    `It comes at dawn, exactly as feared - coordinated Hollow incursions hitting three gates simultaneously, too precise to be anything but engineered.`
  ],
  choices: [
    { label: "Hold your assigned gate exactly as ordered", next: "guard_ch4_2", effect: (s) => bump(s, { honor: 1 }) },
    { label: "Break protocol to cover the weakest point", next: "guard_ch4_2", effect: (s) => bump(s, { resolve: 1, corruption: 1 }) }
  ]
},


guard_ch4_2: {
  chapter: "Guard Ch.4 - The Siege",
  text: () => [
    `Ellery's beside you the whole time, matching whatever pace you set without needing to be told.`
  ],
  choices: (s) => {
    const base = [
      { label: "Coordinate closely, call every move", next: "guard_ch4_3", effect: (st) => bump(st, { resolve: 1 }) },
      { label: "Trust him to read the situation himself", next: "guard_ch4_3", effect: (st) => bump(st, { charisma: 1 }) }
    ];
    base.push({
      label: "Move as one unit without a word needed",
      requires: { stat: 'charisma', min: 9 },
      next: "guard_ch4_3",
      effect: (st) => bump(st, { charisma: 1, honor: 1 })
    });
    return base;
  }
},


guard_ch4_3: {
  chapter: "Guard Ch.4 - The Siege",
  text: (s) => hasItem(s, "Captain's Insignia")
    ? [`Your Captain's Insignia carries enough weight that nearby units fall in under your direction without hesitation, exactly when it matters most.`]
    : [`No extra authority to lean on - just you, your training, and the gate.`],
  choices: (s) => {
    if (!hasItem(s, "Captain's Insignia")) return [{ label: "Continue", next: "guard_boss_1" }];
    return [{ label: "Rally nearby units under your command", next: "guard_boss_1", effect: (st) => bump(st, { honor: 1, fame: 1 }) }];
  }
},


guard_boss_1: {
  chapter: "Guard Ch.4 - The Reckoning (1/3)",
  text: (s) => {
    const success = performCheck(s, 'resonance', 16);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses = (s.flags.bossSuccesses || 0) + 1; return [renderDiceRollHtml(r), `The first wave breaks against your gate cleanly - the line holds exactly where it needs to.`]; }
    return [renderDiceRollHtml(r), `The first wave nearly breaks through - the line holds, but only just, and it costs more than it should have.`];
  },
  choices: [{ label: "Continue", next: "guard_boss_2" }]
},


guard_boss_2: {
  chapter: "Guard Ch.4 - The Reckoning (2/3)",
  text: (s) => {
    const success = performCheck(s, 'honor', 17);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses = (s.flags.bossSuccesses || 0) + 1; return [renderDiceRollHtml(r), `Word reaches you mid-fight that civilians are trapped near the second gate - you find a way to help without abandoning your own post.`]; }
    return [renderDiceRollHtml(r), `Word reaches you mid-fight that civilians are trapped near the second gate - you can't reach them in time to help, and that failure sits heavy even in the middle of the fight.`];
  },
  choices: [{ label: "Continue", next: "guard_boss_3" }]
},


guard_boss_3: {
  chapter: "Guard Ch.4 - The Reckoning (3/3)",
  text: (s) => {
    const success = performCheck(s, 'resolve', 18);
    const r = s.flags.lastRoll;
    if (success) { s.flags.bossSuccesses = (s.flags.bossSuccesses || 0) + 1; return [renderDiceRollHtml(r), `The final push against your gate is the hardest of the day - and it breaks against you instead of through you.`]; }
    applyCombatDamage(s, 25);
    return [renderDiceRollHtml(r), `The final push against your gate nearly finishes what the whole day started - a real, bad hit right as it feels like it should be ending.`];
  },
  choices: (s) => s.hp <= 0 ? [{ label: "...", next: "game_over" }] : [{ label: "Continue", next: "guard_boss_summary" }]
},


guard_boss_summary: {
  chapter: "Guard Ch.4 - The Siege",
  text: (s) => {
    const n = s.flags.bossSuccesses || 0;
    if (n === 3) return [`Three for three. Your gate holds clean from dawn to the last wave, and word of it spreads through the ranks before the dust even settles.`];
    if (n === 2) return [`Two out of three. Costly, but the gate holds, and that's what actually matters by the end of a day like this.`];
    if (n === 1) return [`Only one clean moment in the whole siege. The gate holds. It doesn't feel like a clean victory.`];
    return [`None of it went cleanly. The gate holds, barely, and you're left standing at the end of it - which today, is its own kind of victory.`];
  },
  choices: (s) => {
    const n = s.flags.bossSuccesses || 0;
    return [{
      label: "Continue",
      next: "guard_ch4_final_setup",
      effect: (st) => { if (n >= 2) bump(st, { honor: 1 }); else bump(st, { corruption: 1 }); }
    }];
  }
},


guard_ch4_final_setup: {
  chapter: "Guard Ch.4 - The Siege",
  text: () => [
    `The siege breaks. In the aftermath, word comes through fast: Drell's role in engineering the attack is confirmed, undeniable, and entirely in your hands how it's handled from here.`
  ],
  choices: [
    { label: "Continue", next: "guard_ch4_final" }
  ]
},


guard_ch4_final: {
  chapter: "Guard Ch.4 - The Siege",
  text: (s) => {
    const d = deltaSince(s, 'snap_guard1');
    const honorGain = d.honor;
    const corruptionGain = d.corruption;

    let tier;
    if (honorGain - corruptionGain >= 8) tier = 'hero';
    else if (honorGain - corruptionGain <= -6) tier = 'compromised';
    else tier = 'standard';
    s.flags.guardEnding = tier;
    bumpGold(s, 200);

    if (tier === 'hero') {
      return [
        `<b>ENDING: THE GATE HELD</b>`,
        `Drell is exposed publicly, fully, the emergency powers scheme collapses, and your name ends up attached to the reason the capital didn't fall for it. Voll - Commander Voll, formally, in the report - puts you forward for a commendation she doesn't usually bother giving.`,
        `Ellery salutes you without a trace of the first day's skepticism left in it.`
      ];
    } else if (tier === 'compromised') {
      return [
        `<b>ENDING: QUIETLY HANDLED</b>`,
        `Drell is removed, but the way it happened - the deals, the corners cut - never quite makes it into the official record. The capital's safe. You're not entirely sure the process that got you there is one you'd defend out loud.`,
        `Ellery doesn't ask. You're not sure if that's respect or something closer to disappointment.`
      ];
    } else {
      return [
        `<b>ENDING: THE LONG SHIFT</b>`,
        `Drell's gone, the gate held, the capital's safe - a solid, unremarkable success by the numbers. It's not the story anyone tells later. It's still real.`,
        `Voll's approval is quiet, the way it's always been. You've learned by now that's as good as it gets from her, and it's enough.`
      ];
    }
  },
  choices: [
    { label: "The End - Restart", next: "__restart__" }
  ]
},


});
