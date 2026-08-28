/* =========================================================
   ENDING TIER LOGIC + PART TWO JOB DEFINITIONS
   (the 6 single-stage jobs' intro/choices/resolutions data)
   ========================================================= */


/* ============================== ENDING TIER LOGIC ============================== */
function getEndingTier(s) {
  const trustScore = s.stats.honor + s.stats.empathy + s.stats.resolve - s.stats.corruption - s.stats.apathy;
  if (trustScore >= 9) return 'united';
  if (trustScore >= 2) return 'costly';
  return 'lost';
}

/* ============================== PART TWO: JOBS ============================== */
const JOBS_BY_TIER = {
  united: ['council', 'guard', 'instructor'],
  costly: ['frontier', 'mercenary', 'security'],
  lost: ['bandit', 'dealer', 'bounty'],
};

const JOBS = {

  council: {
    label: "Council Investigator - handle sensitive Hollow incidents for the ruling Council",
    chapterTitle: "Special Chapter - Council Investigator",
    intro: (s) => {
      const lines = [
        `Six months in, and the Council trusts you with the cases nobody wants filed publicly. Tonight's is one of them: evidence that a Council logistics officer has been quietly rerouting Resonance-tech shipments - the same kind of tech that fueled Vesk's operation.`,
        `You could expose it through official channels, which means a public scandal and possibly nothing changing structurally, or contain it quietly, keeping the Council's trust intact but letting the officer face only private consequences.`
      ];
      if (s.stats.corruption >= 5) lines.push(`The officer, sizing you up, tries something familiar - a quiet offer to make this go away for a price. Old habits recognize old habits.`);
      else if (s.stats.honor >= 6) lines.push(`Something about your record makes the officer's colleagues unusually willing to talk to you. People trust you with the details.`);
      return lines;
    },
    choices: [
      { key: 'expose', label: "Expose it publicly, whatever the fallout" },
      { key: 'contain', label: "Contain it quietly through internal channels" }
    ],
    stage2: (s, c1) => c1 === 'expose'
      ? [`The scandal breaks exactly as expected. A journalist reaches out, wanting an exclusive interview before the story runs elsewhere.`]
      : [`The quietly-removed officer reaches out to you directly, asking for one more chance to explain themselves before the paperwork is finalized.`],
    stage2Choices: (c1) => c1 === 'expose'
      ? [
          { key: 'interview', label: "Give the interview, control the narrative" },
          { key: 'decline', label: "Decline - let the report speak for itself" }
        ]
      : [
          { key: 'hear', label: "Hear them out" },
          { key: 'noinvolve', label: "Let the process play out without you" }
        ],
    resolutions: {
      expose__interview: [
        `You give the interview, careful and precise. It shapes the story the way you intended - less scandal-for-its-own-sake, more a clear account of why it mattered. The Council doesn't love it, but they can't argue with the accuracy.`,
        `Ashworth reads it and tells you it was the harder right call, done well.`
      ],
      expose__decline: [
        `You decline. The story runs anyway, shaped by people who weren't there. It's messier than it needed to be, and less accurate, but you kept your hands out of the spectacle.`,
        `Some things you don't get to control once they're moving.`
      ],
      contain__hear: [
        `You hear the officer out. It doesn't change the outcome, but you note something in their account that makes the quiet resolution feel less like a cover-up and more like an actual, considered mercy.`,
        `Small comfort. It's still something.`
      ],
      contain__noinvolve: [
        `You let the process run without your involvement. Clean, procedural, over quickly. You never do find out what the officer would have said, and you're not sure it would have changed anything.`,
        `It's efficient. It doesn't sit as easily as efficient usually does.`
      ]
    }
  },

  guard: {
    label: "Kingdom Guard Elite - protect the capital itself",
    chapterTitle: "Special Chapter - Kingdom Guard Elite",
    intro: (s) => {
      const lines = [
        `The attack comes at dawn, too coordinated to be a wild swarm - Hollow hitting three gates at once, like someone studied the capital's guard rotations first.`,
        `Your orders are to hold your assigned gate and nothing else. But civilians are trapped near the second gate, undefended, and holding formation means leaving them to whatever's coming.`
      ];
      if (s.stats.resonance >= 6) lines.push(`Whatever's coming through that gate, you're not worried about your own ability to handle it - that part, at least, you're sure of.`);
      return lines;
    },
    choices: [
      { key: 'orders', label: "Hold your position exactly as ordered" },
      { key: 'break', label: "Break formation to save the trapped civilians" }
    ],
    stage2: (s, c1) => c1 === 'orders'
      ? [`Afterward, a junior guard privately thanks you for holding the line - but you can tell they're still shaken by how close the second gate came to falling.`]
      : [`Command wants a formal explanation for breaking formation, whatever the outcome.`],
    stage2Choices: (c1) => c1 === 'orders'
      ? [
          { key: 'reassure', label: "Reassure them it gets easier" },
          { key: 'honest', label: "Tell them shaken is the right response to have" }
        ]
      : [
          { key: 'standby', label: "Stand by the decision without apology" },
          { key: 'apologize', label: "Apologize for the breach, even though you'd do it again" }
        ],
    resolutions: {
      orders__reassure: [
        `You tell them it gets easier. It's not entirely true, but it's what they need to hear tonight, and you make a note to actually check on them again once the shock wears off.`
      ],
      orders__honest: [
        `You tell them the truth - that being shaken by something like this is the correct, human response, and anyone who stops being shaken by it is the one worth worrying about.`,
        `They seem to actually hear it. That matters more than reassurance would have.`
      ],
      break__standby: [
        `You stand by the decision plainly, no hedging. Command notes the insubordination and, separately, the outcome. Both go in the file. You can live with that.`
      ],
      break__apologize: [
        `You apologize for breaking formation, sincerely, while making clear you'd make the same call again. It's a strange kind of honesty, and command, oddly, respects it more than either pure defiance or pure regret would have earned.`
      ]
    }
  },

  instructor: {
    label: "Academy Instructor - train the next generation",
    chapterTitle: "Special Chapter - Instructor",
    intro: (s) => {
      const lines = [
        `A first-year named Priya reminds you uncomfortably of yourself - talented, isolated, quietly hiding something from her team the way Sable once hid something from yours.`,
        `You could pull her aside directly, the way you wish someone had for you, or let her work through it in her own time, trusting the process the way the academy trusted you.`
      ];
      if (s.stats.empathy >= 6) lines.push(`You notice the signs faster than most instructors would. That's not nothing.`);
      return lines;
    },
    choices: [
      { key: 'intervene', label: "Pull her aside and talk to her directly" },
      { key: 'wait', label: "Let her find her own way through it" }
    ],
    stage2: (s, c1) => c1 === 'intervene'
      ? [`Priya's grades slip anyway while she sorts through her situation, and other instructors start asking questions.`]
      : [`The situation comes to a head sooner than you hoped - a near-miss during a training exercise that shakes her badly.`],
    stage2Choices: (c1) => c1 === 'intervene'
      ? [
          { key: 'adjust', label: "Quietly adjust expectations for her, for now" },
          { key: 'standard', label: "Hold her to the same standard as everyone else" }
        ]
      : [
          { key: 'stepin', label: "Step in now, finally" },
          { key: 'trust', label: "Trust she'll come to you when ready" }
        ],
    resolutions: {
      intervene__adjust: [
        `You quietly adjust what's expected of her while she works through things, without making it obvious to the rest of the class. She notices anyway, and it means more to her than you probably realize.`
      ],
      intervene__standard: [
        `You hold her to the same standard as everyone else, betting that consistency is its own kind of support. It's a harder few weeks for her, but she comes out the other side having proven something to herself.`
      ],
      wait__stepin: [
        `You finally step in after the near-miss. She's relieved more than resentful - she'd been waiting for someone to notice without her having to ask.`
      ],
      wait__trust: [
        `You hold back even now, trusting her to come to it in her own time. She eventually does, on her own terms, and you're left wondering if it would have gone easier with an earlier nudge.`
      ]
    }
  },

  frontier: {
    label: "Frontier Huntsman - hold the line at a forgotten border outpost",
    chapterTitle: "Special Chapter - Frontier Huntsman",
    intro: (s) => {
      const lines = [
        `Outpost Kell hasn't seen a proper supply run in six weeks. Ammunition is low, and a Hollow swarm is building in the tree line, larger than the outpost's remaining huntsmen can handle undersupplied.`,
        `You could requisition supplies through the proper channels - paperwork, weeks of delay you don't have - or find another way to "acquire" what's needed before the swarm moves.`
      ];
      if (s.stats.corruption >= 5) lines.push(`It wouldn't be the first corner you've cut to get a job done. This one, at least, is for people who need it.`);
      return lines;
    },
    choices: [
      { key: 'proper', label: "Go through proper channels, whatever the delay" },
      { key: 'acquire', label: "Find another way to get supplies now" }
    ],
    stage2: (s, c1) => c1 === 'proper'
      ? [`The delay report reaches a higher office than you expected, and questions start getting asked about why Outpost Kell was left undersupplied this long.`]
      : [`The merchant convoy owner you "acquired" from wants to renegotiate compensation - quietly - or he'll escalate the complaint.`],
    stage2Choices: (c1) => c1 === 'proper'
      ? [
          { key: 'pushback', label: "Push back - explain the real conditions plainly" },
          { key: 'accept', label: "Accept the reprimand quietly" }
        ]
      : [
          { key: 'payfair', label: "Pay him fairly out of outpost funds" },
          { key: 'refuse', label: "Refuse - risk the escalation" }
        ],
    resolutions: {
      proper__pushback: [
        `You push back, plainly, on the record - Outpost Kell's neglect isn't your failure, and you make sure the higher office hears exactly whose it is. It's an uncomfortable conversation. It's also the right one.`
      ],
      proper__accept: [
        `You accept the reprimand quietly rather than make waves. It's easier in the short term. The actual problem - Kell's neglect - goes undiscussed for another season.`
      ],
      acquire__payfair: [
        `You pay the convoy owner fairly, quietly, out of the outpost's thin funds. He drops the complaint, satisfied, and doesn't ask more questions than that.`
      ],
      acquire__refuse: [
        `You refuse to renegotiate. He escalates the complaint as promised. It's a headache, but Outpost Kell already has its supplies, and that's the part that was never negotiable to you.`
      ]
    }
  },

  mercenary: {
    label: "Freelance Mercenary - no institution, no safety net",
    chapterTitle: "Special Chapter - Freelance Mercenary",
    intro: (s) => {
      const lines = [
        `Two contracts land on the same job, same night, same target - a Hollow den threatening a trade route. One client wants it destroyed outright. The other wants it captured alive for study, paying considerably more.`,
        `You can't fully satisfy both.`
      ];
      if (s.stats.corruption >= 5) lines.push(`You've made peace, mostly, with taking whichever deal serves you best. Tonight is no different.`);
      return lines;
    },
    choices: [
      { key: 'destroy', label: "Honor the destruction contract" },
      { key: 'capture', label: "Honor the capture contract - better pay" }
    ],
    stage2: (s, c1) => c1 === 'destroy'
      ? [`Word spreads fast that you turned down the higher-paying contract. The furious second client starts telling people you can't be trusted with sensitive work.`]
      : [`The destruction client, furious at the unfulfilled contract, demands a partial refund for wasted time.`],
    stage2Choices: (c1) => c1 === 'destroy'
      ? [
          { key: 'smooth', label: "Track them down, try to smooth things over" },
          { key: 'ignore', label: "Let your record speak for itself over time" }
        ]
      : [
          { key: 'refund', label: "Pay them back to protect your reputation" },
          { key: 'refuse', label: "Refuse - a contract not chosen isn't a contract owed" }
        ],
    resolutions: {
      destroy__smooth: [
        `You track the client down and explain your reasoning face to face. It doesn't fully repair things, but it's better than letting the story run wild without your side of it.`
      ],
      destroy__ignore: [
        `You let it go, betting your work will speak for itself eventually. It takes longer than you'd like, and costs you a few contracts in the meantime, but the reputation that survives it is more solid for having weathered it.`
      ],
      capture__refund: [
        `You pay the refund, smoothing over the relationship at a real cost to your own earnings this month. It buys you goodwill you'll probably need again someday.`
      ],
      capture__refuse: [
        `You refuse the refund on principle. Word gets around that you're reliable but not a pushover - some clients respect that. Others quietly stop calling.`
      ]
    }
  },

  security: {
    label: "Private Security Contractor - hired muscle for a noble house",
    chapterTitle: "Special Chapter - Private Security",
    intro: (s) => {
      const lines = [
        `Your employer, a merchant lord, asks you to look the other way while his people quietly dump industrial byproduct near a Hollow-attractant site - cheaper than proper disposal, and clearly against kingdom code.`,
        `You could comply and keep the steady paycheck, or refuse and risk the job - or take it further and expose him.`
      ];
      if (s.stats.apathy >= 5) lines.push(`It wouldn't be the first time you've decided this kind of thing isn't your problem to solve.`);
      return lines;
    },
    choices: [
      { key: 'comply', label: "Look the other way - it's not your fight" },
      { key: 'expose', label: "Refuse, and expose what he's doing" }
    ],
    stage2: (s, c1) => c1 === 'comply'
      ? [`Months later, a Hollow incident near the dump site turns out to trace back further than anyone officially admitted.`]
      : [`Word of your firing spreads fast. A rival security firm reaches out, curious why you walked away from steady, well-paying work.`],
    stage2Choices: (c1) => c1 === 'comply'
      ? [
          { key: 'comeforward', label: "Come forward with what you knew" },
          { key: 'stayquiet', label: "Stay quiet - it's not provably your fault" }
        ]
      : [
          { key: 'explain', label: "Explain your reasons plainly" },
          { key: 'silent', label: "Let your reputation speak without over-explaining" }
        ],
    resolutions: {
      comply__comeforward: [
        `You come forward, late but honestly. It costs you the goodwill of your former employer for good, but it's the first time in a while a decision has felt fully yours.`
      ],
      comply__stayquiet: [
        `You stay quiet. Nothing is ever provably traced to you. The silence sits heavier than the money ever did.`
      ],
      expose__explain: [
        `You explain your reasons plainly to the rival firm. They hire you on the spot - turns out that kind of integrity is rarer, and more valuable, than you expected in this line of work.`
      ],
      expose__silent: [
        `You let your reputation speak for itself. It takes longer to land the next job, but the ones who do hire you already know exactly what they're getting.`
      ]
    }
  },

  bandit: {
    label: "Bandit Crew Leader - outside the law now",
    chapterTitle: "Special Chapter - Bandit Crew",
    intro: (s) => {
      const lines = [
        `The crew you lead - people the system also gave up on - has a target picked out: a supply caravan headed for, of all places, Outpost Kell. You recognize the name. You have history there, even if the crew doesn't know it.`,
        `You could go through with the hit as planned, or warn the caravan and take the loss with your crew, or turn on your own crew to stop it.`
      ];
      if (s.stats.empathy >= 5) lines.push(`Even out here, whatever's left of your empathy hasn't fully burned off. It complicates things tonight.`);
      return lines;
    },
    choices: [
      { key: 'proceed', label: "Go through with the hit" },
      { key: 'warn', label: "Quietly warn the caravan" },
      { key: 'betray', label: "Turn on your own crew to stop it" }
    ],
    stage2: (s, c1) => {
      if (c1 === 'proceed') return [`Emboldened by tonight's success, the crew wants to go bigger next time - a target with real risk attached.`];
      if (c1 === 'warn') return [`Your crew starts to suspect there's a leak somewhere in the operation.`];
      return [`Word gets around what you did. Some crews now see you as untrustworthy; others see someone with a conscience worth recruiting.`];
    },
    stage2Choices: (c1) => {
      if (c1 === 'proceed') return [
        { key: 'pushback', label: "Push back on the escalation" },
        { key: 'along', label: "Go along with it" }
      ];
      if (c1 === 'warn') return [
        { key: 'deflect', label: "Deflect suspicion onto someone else" },
        { key: 'quiet', label: "Stay quiet and let it blow over" }
      ];
      return [
        { key: 'legit', label: "Lean into a more legitimate path from here" },
        { key: 'rebuild', label: "Try to rebuild trust with your old crew anyway" }
      ];
    },
    resolutions: {
      proceed__pushback: [`You push back on the bigger, riskier target. The crew grumbles but ultimately defers to you - for now. You bought caution another day, nothing more.`],
      proceed__along: [`You go along with the escalation. It works, this time. You're aware, distantly, that "this time" isn't a strategy.`],
      warn__deflect: [`You deflect suspicion elsewhere, onto someone who didn't do anything. It works. It also isn't something you're proud of, on top of everything else.`],
      warn__quiet: [`You say nothing and let the suspicion circle without landing anywhere. It's tense for a while. Eventually it passes, mostly.`],
      betray__legit: [`You use the fallout as a real turning point, drifting toward less lawless work. It's slower and poorer than the crew life, but it's a direction you chose instead of one you fell into.`],
      betray__rebuild: [`You try to rebuild something with your old crew despite the betrayal. Some let you back in, warily. Others never will. You take what you can get.`]
    }
  },

  dealer: {
    label: "Black Market Resonance Dealer - trading in what got you here",
    chapterTitle: "Special Chapter - Black Market Dealer",
    intro: (s) => {
      const lines = [
        `A buyer wants a piece of stolen Resonance tech you're sitting on - the same category of tech Vesk once used to drive Hollow against a village. You know, better than most, exactly what it can do in the wrong hands.`,
        `You could sell it - it's a lot of money, and not selling doesn't undo how you got here - or refuse, or go further and sabotage the deal entirely.`
      ];
      if (s.stats.corruption >= 6) lines.push(`This isn't your first deal like this, and you stopped pretending it would be your last a while ago.`);
      return lines;
    },
    choices: [
      { key: 'sell', label: "Sell it. Money doesn't ask questions." },
      { key: 'refuse', label: "Refuse the sale" },
      { key: 'sabotage', label: "Sabotage the device before the deal" }
    ],
    stage2: (s, c1) => {
      if (c1 === 'sell') return [`The buyer comes back wanting more, willing to pay even better this time.`];
      if (c1 === 'refuse') return [`Word gets around that you turn down deals on principle, and it starts costing you future business.`];
      return [`The buyer, humiliated by the failed deal, wants to know who cost them the sale.`];
    },
    stage2Choices: (c1) => {
      if (c1 === 'sell') return [
        { key: 'again', label: "Sell again" },
        { key: 'stop', label: "This is where you stop" }
      ];
      if (c1 === 'refuse') return [
        { key: 'stick', label: "Stick to your principle anyway" },
        { key: 'reconsider', label: "Reconsider your stance going forward" }
      ];
      return [
        { key: 'hide', label: "Stay hidden, protect yourself" },
        { key: 'reveal', label: "Let them find out - you're not ashamed" }
      ];
    },
    resolutions: {
      sell__again: [`You sell again. The money's good. The line between "business" and something worse keeps getting harder to find, and you've mostly stopped looking for it.`],
      sell__stop: [`You stop here, for whatever that's worth this far in. It's not redemption. It's a floor, at least, that you didn't sink below tonight.`],
      refuse__stick: [`You stick to your principle even as it costs you. It's a strange thing to be proud of in this line of work, but you are.`],
      refuse__reconsider: [`You start reconsidering how firm that principle really needs to be, given the cost. It's a slow erosion, not a single decision - but you notice it happening.`],
      sabotage__hide: [`You stay hidden and let the buyer's humiliation remain a mystery to them. Safer. Lonelier, in a way you don't examine too closely.`],
      sabotage__reveal: [`You let it be known it was you. It's dangerous, but it's also the first time in a long while doing the right thing hasn't required staying invisible.`]
    }
  },

  bounty: {
    label: "Unlicensed Bounty Hunter - no oversight, no safety net",
    chapterTitle: "Special Chapter - Bounty Hunter",
    intro: (s) => {
      const lines = [
        `The bounty's straightforward on paper: a fugitive hiding in the lower city. In person, it's not - they're clearly not the monster the posting implied, just scared, cornered, and out of options.`,
        `You could complete the job as contracted, or let them go, or dig into who posted the bounty and why.`
      ];
      if (s.stats.empathy >= 5) lines.push(`Something about how scared they look gets to you more than it probably should, given the job.`);
      return lines;
    },
    choices: [
      { key: 'complete', label: "Complete the job as contracted" },
      { key: 'release', label: "Let them go" },
      { key: 'investigate', label: "Investigate who posted the bounty" }
    ],
    stage2: (s, c1) => {
      if (c1 === 'complete') return [`Another bounty comes in soon after, similarly vague about what the target actually did to deserve it.`];
      if (c1 === 'release') return [`Word gets around that you don't always finish the job. Fewer bounties come your way after that.`];
      return [`The person who posted the false bounty realizes you exposed them, and wants some kind of retaliation.`];
    },
    stage2Choices: (c1) => {
      if (c1 === 'complete') return [
        { key: 'askmore', label: "Ask more questions this time before taking it" },
        { key: 'noquestions', label: "Take it - questions aren't part of the job" }
      ];
      if (c1 === 'release') return [
        { key: 'selective', label: "Be more selective about which bounties you show mercy on" },
        { key: 'honestwork', label: "Accept the smaller, more honest workload" }
      ];
      return [
        { key: 'confront', label: "Confront them directly" },
        { key: 'wait', label: "Stay alert and let it come to you" }
      ];
    },
    resolutions: {
      complete__askmore: [`You start asking harder questions before taking jobs. It slows you down and loses you a few easy payouts, but it changes what kind of bounty hunter you actually are.`],
      complete__noquestions: [`You take it anyway, no questions, same as always. It pays the same as it always has. You've stopped expecting it to feel different.`],
      release__selective: [`You get more deliberate about when you show mercy, weighing each case instead of following a fixed rule. It's harder work, mentally, than either extreme would be.`],
      release__honestwork: [`You accept a smaller, steadier stream of work that actually sits right with you. Less money. Better sleep.`],
      investigate__confront: [`You confront them directly. It's tense, even dangerous, but it ends the matter cleanly - on your terms, not theirs.`],
      investigate__wait: [`You stay alert and let them make the first move instead. It's a longer, more exhausting kind of vigilance, but it means you're never caught fully off guard.`]
    }
  },

};
