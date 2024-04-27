export const DAGGERHEART = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
DAGGERHEART.abilities = {
  agi: 'DAGGERHEART.Ability.Agi.long',
  str: 'DAGGERHEART.Ability.Str.long',
  fin: 'DAGGERHEART.Ability.Fin.long',
  ins: 'DAGGERHEART.Ability.Ins.long',
  pre: 'DAGGERHEART.Ability.Pre.long',
  kno: 'DAGGERHEART.Ability.Kno.long',
};

DAGGERHEART.abilityAbbreviations = {
  agi: 'DAGGERHEART.Ability.Agi.abbr',
  str: 'DAGGERHEART.Ability.Str.abbr',
  fin: 'DAGGERHEART.Ability.Fin.abbr',
  ins: 'DAGGERHEART.Ability.Ins.abbr',
  pre: 'DAGGERHEART.Ability.Pre.abbr',
  kno: 'DAGGERHEART.Ability.Kno.abbr',
};

DAGGERHEART.classOptions = {
  bard     : 'bard',
  druid    : 'druid',
  guardian : 'guardian',
  ranger   : 'ranger',
  rogue    : 'rogue',
  seraph   : 'seraph',
  sorcerer : 'sorcerer',
  warrior  : 'warrior',
  wizard   : 'wizard'
};

DAGGERHEART.pairedDomains = {
  bard     : ['grace', 'codex'],
  druid    : ['sage', 'arcana'],
  guardian : ['valor', 'blade'],
  ranger   : ['bone', 'sage'],
  rogue    : ['midnight', 'grace'],
  seraph   : ['splendor', 'valor'],
  sorcerer : ['arcana', 'midnight'],
  warrior  : ['blade', 'bone'],
  wizard   : ['codex', 'valor']
};

DAGGERHEART.subClasses = {
  bard     : ['wordsmith', 'troubadour'],
  druid    : ['warden of the elements', 'warden of renewal'],
  guardian : ['stalward', 'vengeance'],
  ranger   : ['beastbound', 'wayfinder'],
  rogue    : ['syndicate', 'nightwalker'],
  seraph   : ['divine wielder', 'winged sentinel'],
  sorcerer : ['elemental origin', 'primal origin'],
  warrior  : ['call of the brave', 'call of the slayer'],
  wizard   : ['school of knowledge', 'school of war']
};
