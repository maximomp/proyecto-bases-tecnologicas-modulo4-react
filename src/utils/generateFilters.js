// generateFilters.js
// Genera automáticamente el array de filtros laterales a partir del JSON de productos

/**
 * Genera filtros laterales a partir de los atributos y destacados de los productos
 * @param {Array} productos - Array de productos
 * @returns {Array} - Array de objetos filtro para UI
 */
function generateFilters(productos) {
  // Generar atributos dinámicamente desde el JSON de productos
  const keys = productos.flatMap((p) => Object.keys(p.atributos || {}));
  const atributos = [...new Set(keys.filter((k) => k))];
  // Añade destacados como filtro especial
  atributos.push("destacados");

  // Generar metadatos para cada atributo
  function getMeta(key) {
    let title = key.charAt(0).toUpperCase() + key.slice(1);
    let valueType = "string";
    if (["pulgadas"].includes(key)) valueType = "number";
    return { key, title, formType: "checkbox", valueType };
  }

  // Generar options únicos para cada atributo, incluyendo el número de resultados
  function getOptions(key) {
    let values = [];
    if (key === "destacados") {
      productos.forEach((p) => {
        if (Array.isArray(p.destacados)) values.push(...p.destacados);
      });
    } else {
      productos.forEach((p) => {
        const v = p.atributos[key];
        if (Array.isArray(v)) values.push(...v);
        else if (v !== undefined) values.push(v);
      });
    }
    // Eliminar duplicados y vacíos
    const uniqueValues = [
      ...new Set(
        values.filter((v) => v !== undefined && v !== null && v !== "")
      ),
    ];
    return uniqueValues.map((v) => {
      // Contar cuántos productos tienen este valor para el atributo
      let count = 0;
      if (key === "destacados") {
        count = productos.filter(
          (p) => Array.isArray(p.destacados) && p.destacados.includes(v)
        ).length;
      } else {
        count = productos.filter((p) => {
          const attr = p.atributos[key];
          if (Array.isArray(attr)) return attr.includes(v);
          return attr === v;
        }).length;
      }
      return { label: String(v), value: v, results: count };
    });
  }

  // Construir el array de filtros
  return atributos
    .map((key) => {
      const meta = getMeta(key);
      let options = getOptions(key);
      // Ordena las opciones:
      // - Si la mayoría empiezan por número, ordena numéricamente por el número inicial
      // - Si no, ordena alfabéticamente
      const startsWithNumber = (v) => typeof v === "string" && /^\d+/.test(v);
      const countStartsWithNumber = options.filter((opt) =>
        startsWithNumber(opt.value)
      ).length;
      if (countStartsWithNumber > options.length / 2) {
        options.sort((a, b) => {
          // Extrae el número inicial de cada value
          const numA = parseFloat(String(a.value).match(/\d+(\.\d+)?/));
          const numB = parseFloat(String(b.value).match(/\d+(\.\d+)?/));
          return numA - numB;
        });
      } else {
        options.sort((a, b) => String(a.value).localeCompare(String(b.value)));
      }
      return {
        title: meta.title,
        formType: meta.formType,
        valueType: meta.valueType,
        name: key,
        searchInput: true,
        maxItemsStart: 5,
        minifiedOnStart: true,
        options,
      };
    })
    .filter((f) => f.options.length > 0);
}

export default generateFilters;
/*
Ejemplo de uso:
const productos = require('../../../templates/categorization/components/productos.json');
const generateFilters = require('./generateFilters');
const filtrosLaterales = generateFilters(productos);
//console.ogfiltrosLaterales);
*/
