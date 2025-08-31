import header from "./header/index.js";

export const templates = {
  header: {
    id: "header",
    url: "templates/header/index.html",
    css: "templates/header/styles.css",
    // js: "templates/header/index.js",  // si no se indica usará el default
    tag: "header",
    class: "header",
  },

  categorization: {
    id: "categorization",
    url: "templates/categorization/index.html",
    css: "templates/categorization/styles.css",
    js: "templates/categorization/index.js", // si no se indica usará el default
    tag: "div",
    class: "categorization",
    // onLoadItem: "templates/categorization/onLoadItem.js", // código a ejecutar cuando el DOM del index se ha cargado
  },
};
