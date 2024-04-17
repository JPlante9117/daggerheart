/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 */

// Import Modules
import { DaggerheartActor } from "./actor.js";
import { DaggerheartItem } from "./item.js";
import { DaggerheartItemSheet } from "./item-sheet.js";
import { DaggerheartActorSheet } from "./actor-sheet.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { createDaggerheartMacro } from "./macro.js";
import { DaggerheartToken, DaggerheartTokenDocument } from "./token.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function () {
  console.log(`Initializing Daggerheart System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "2d12",
    decimals: 2
  };

  game.daggerheart = {
    DaggerheartActor,
    createDaggerheartMacro
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = DaggerheartActor;
  CONFIG.Item.documentClass = DaggerheartItem;
  CONFIG.Token.documentClass = DaggerheartTokenDocument;
  CONFIG.Token.objectClass = DaggerheartToken;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("daggerheart", DaggerheartActorSheet, {
    makeDefault: true,
    label: "DAGGERHEART.SheetLabels.Actor"
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("daggerheart", DaggerheartItemSheet, {
    makeDefault: true,
    label: "DAGGERHEART.SheetsLabel.Item"
  });

  // Register system settings
  // game.settings.register("daggerheart", "macroShorthand", {
  //   name: "SETTINGS.DaggerheartMacroShorthandN",
  //   hint: "SETTINGS.DaggerheartMacroShorthandL",
  //   scope: "world",
  //   type: Boolean,
  //   default: true,
  //   config: true
  // });

  // // Register initiative setting.
  // game.settings.register("daggerheart", "initFormula", {
  //   name: "SETTINGS.DaggerheartInitFormulaN",
  //   hint: "SETTINGS.DaggerheartInitFormulaL",
  //   scope: "world",
  //   type: String,
  //   default: "1d20",
  //   config: true,
  //   onChange: formula => _DaggerheartUpdateInit(formula, true)
  // });

  // // Retrieve and assign the initiative formula setting.
  // const initFormula = game.settings.get("daggerheart", "initFormula");
  // _DaggerheartUpdateInit(initFormula);

  // /**
  //  * Update the initiative formula.
  //  * @param {string} formula - Dice formula to evaluate.
  //  * @param {boolean} notify - Whether or not to post nofications.
  //  */
  // function _DaggerheartUpdateInit(formula, notify = false) {
  //   const isValid = Roll.validate(formula);
  //   if (!isValid) {
  //     if (notify) ui.notifications.error(`${game.i18n.localize("Daggerheart.NotifyInitFormulaInvalid")}: ${formula}`);
  //     return;
  //   }
  //   CONFIG.Combat.initiative.formula = formula;
  // }

  // /**
  //  * Slugify a string.
  //  */
  Handlebars.registerHelper('slugify', function (value) {
    return value.slugify({ strict: true });
  });

  // Preload template partials
  await preloadHandlebarsTemplates();



});

/**
 * Macrobar hook.
 */
Hooks.on("hotbarDrop", (bar, data, slot) => createDaggerheartMacro(data, slot));

/**
 * Adds the actor template context menu.
 */
Hooks.on("getActorDirectoryEntryContext", (html, options) => {

  // Define an actor as a template.
  options.push({
    name: game.i18n.localize("Daggerheart.DefineTemplate"),
    icon: '<i class="fas fa-stamp"></i>',
    condition: li => {
      const actor = game.actors.get(li.data("documentId"));
      return !actor.isTemplate;
    },
    callback: li => {
      const actor = game.actors.get(li.data("documentId"));
      actor.setFlag("daggerheart", "isTemplate", true);
    }
  });

  // Undefine an actor as a template.
  options.push({
    name: game.i18n.localize("Daggerheart.UnsetTemplate"),
    icon: '<i class="fas fa-times"></i>',
    condition: li => {
      const actor = game.actors.get(li.data("documentId"));
      return actor.isTemplate;
    },
    callback: li => {
      const actor = game.actors.get(li.data("documentId"));
      actor.setFlag("daggerheart", "isTemplate", false);
    }
  });
});

/**
 * Adds the item template context menu.
 */
Hooks.on("getItemDirectoryEntryContext", (html, options) => {

  // Define an item as a template.
  options.push({
    name: game.i18n.localize("Daggerheart.DefineTemplate"),
    icon: '<i class="fas fa-stamp"></i>',
    condition: li => {
      const item = game.items.get(li.data("documentId"));
      return !item.isTemplate;
    },
    callback: li => {
      const item = game.items.get(li.data("documentId"));
      item.setFlag("daggerheart", "isTemplate", true);
    }
  });

  // Undefine an item as a template.
  options.push({
    name: game.i18n.localize("Daggerheart.UnsetTemplate"),
    icon: '<i class="fas fa-times"></i>',
    condition: li => {
      const item = game.items.get(li.data("documentId"));
      return item.isTemplate;
    },
    callback: li => {
      const item = game.items.get(li.data("documentId"));
      item.setFlag("daggerheart", "isTemplate", false);
    }
  });
});
