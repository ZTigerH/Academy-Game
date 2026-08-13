/* =========================================================
   SHARED PART TWO SCENES — quartermaster shop, gambling den,
   and the generic single-stage job chapter flow used by the
   6 jobs that do not yet have a full 4-chapter arc.
   ========================================================= */

Object.assign(SCENES, {

gambling_den: {
  chapter: "The Gambling Den",
  text: (s) => [
    `A quiet back-room dice game, the kind every garrison town seems to have somewhere. You've got ${s.gold || 0} gold on you. The house rolls a d20 — beat 12 and you double your bet; anything else, the house keeps it.`
  ],
  choices: (s) => {
    const bets = [20, 50, 100];
    const opts = bets.map(amount => ({
      label: `Bet ${amount} gold`,
      requiresGold: amount,
      next: "gambling_result",
      effect: (st) => { st.flags.gambleBet = amount; }
    }));
    opts.push({ label: "Leave the table", next: (st) => st.flags.returnToHub || 'council_hub_1' });
    return opts;
  }
},


gambling_result: {
  chapter: "The Gambling Den",
  text: (s) => {
    const bet = s.flags.gambleBet || 0;
    const roll = rollD20();
    const win = roll >= 12;
    if (win) { bumpGold(s, bet); } else { bumpGold(s, -bet); }
    s.flags.lastGambleWin = win;
    return [
      `🎲 The house rolls a ${roll}.`,
      win
        ? `Over 12 — you win. ${bet} gold flows your way, doubled.`
        : `Under 12. The house takes your ${bet} gold without much ceremony.`
    ];
  },
  choices: [{ label: "Continue", next: "gambling_den" }]
},


gear_shop: {
  chapter: "Quartermaster's Shop",
  text: (s) => [
    `The quartermaster's shelves are stocked better than usual today. You've got ${s.gold || 0} gold to spend.`
  ],
  choices: (s) => {
    const opts = SHOP_ITEMS.filter(item => !hasItem(s, item.name)).map(item => ({
      label: `Buy ${item.name} (${SLOT_LABELS[ITEM_SLOT[item.name]]}) — ${item.cost} gold`,
      requiresGold: item.cost,
      next: "gear_shop",
      effect: (st) => { bumpGold(st, -item.cost); addItem(st, item.name); }
    }));
    const sellable = s.inventory.filter(name => ITEM_SLOT[name] && SELL_VALUES[name]);
    sellable.forEach(name => {
      const value = SELL_VALUES[name];
      const isEquipped = Object.values(s.equipment || {}).includes(name);
      opts.push({
        label: `Sell ${name}${isEquipped ? ' (equipped)' : ''} — ${value} gold`,
        next: "gear_shop",
        effect: (st) => { removeItem(st, name); bumpGold(st, value); }
      });
    });
    const repairable = s.inventory.filter(name => ITEM_SLOT[name] && getDurability(s, name) < 100);
    repairable.forEach(name => {
      const dur = getDurability(s, name);
      const cost = Math.max(5, 100 - dur);
      opts.push({
        label: `Repair ${name} (${dur}% → 100%) — ${cost} gold`,
        requiresGold: cost,
        next: "gear_shop",
        effect: (st) => { bumpGold(st, -cost); repairItem(st, name); }
      });
    });
    opts.push({ label: "Leave the shop", next: (st) => st.flags.returnToHub || 'council_hub_1' });
    return opts;
  }
},


job_chapter_intro: {
  chapter: (s) => JOBS[s.flags.job].chapterTitle,
  text: (s) => JOBS[s.flags.job].intro(s),
  choices: (s) => JOBS[s.flags.job].choices.map(c => ({
    label: c.label, next: "job_chapter_stage2", effect: (st) => { st.flags.jobChoice1 = c.key; }
  }))
},


job_chapter_stage2: {
  chapter: (s) => JOBS[s.flags.job].chapterTitle,
  text: (s) => JOBS[s.flags.job].stage2(s, s.flags.jobChoice1),
  choices: (s) => JOBS[s.flags.job].stage2Choices(s.flags.jobChoice1).map(c => ({
    label: c.label, next: "job_chapter_resolution", effect: (st) => { st.flags.jobChoice2 = c.key; }
  }))
},


job_chapter_resolution: {
  chapter: (s) => JOBS[s.flags.job].chapterTitle,
  text: (s) => JOBS[s.flags.job].resolutions[`${s.flags.jobChoice1}__${s.flags.jobChoice2}`],
  choices: () => [ { label: "The End — Restart", next: "__restart__" } ]
},


});
