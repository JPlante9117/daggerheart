/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {

  // Define template paths to load
  const templatePaths = [
    // Attribute list partial.
    "systems/daggerheart/templates/parts/sheet-attributes.hbs",
    "systems/daggerheart/templates/parts/sheet-skills.hbs",
    "systems/daggerheart/templates/parts/sheet-groups.hbs"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};

export const loadPrepareDataHandlebar = async function () {

  Handlebars.registerHelper("hbTest", function (skill) {
    // Enrich the content

    return new Handlebars.createFrame(skill.basedAttribute);
  });
};

