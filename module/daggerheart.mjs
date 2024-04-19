// Import document classes.
import { DaggerheartActor } from './documents/actor.mjs';
import { DaggerheartItem } from './documents/item.mjs';
// Import sheet classes.
import { DaggerheartActorSheet } from './sheets/actor-sheet.mjs';
import { DaggerheartItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { DAGGERHEART } from './helpers/config.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.daggerheart = {
    DaggerheartActor,
    DaggerheartItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.DAGGERHEART = DAGGERHEART;

  // Define custom Document classes
  CONFIG.Actor.documentClass = DaggerheartActor;
  CONFIG.Item.documentClass = DaggerheartItem;

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('daggerheart', DaggerheartActorSheet, {
    makeDefault: true,
    label: 'DAGGERHEART.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('daggerheart', DaggerheartItemSheet, {
    makeDefault: true,
    label: 'DAGGERHEART.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('when', (operand_1, operator, operand_2, options) => {
  var operators = {
    'eq': (l, r) => l == r,
    'noteq': (l, r) => l != r,
    'gt': (l, r) => l > r,
    'gteq': (l, r) => l >= r,
    'lt': (l, r) => l < r,
    'lteq': (l, r) => l <= r,
    'or': (l, r) => l || r,
    'and': (l, r) => l && r,
    '%': (l, r) => l % r === 0
  },
  result = operators[operator](operand_1, operand_2);

  if (result) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('times', (n, options) => {
    let acc = '',
      data;

    if (options.data) {
      data = Handlebars.createFrame(options.data);
    }

    for (let i = 0; i < n; i++) {
      if (data) {
        data.index = i;
      }

      acc += options.fn(i, {
        data
      });
    }

    return acc;
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.daggerheart.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'daggerheart.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
