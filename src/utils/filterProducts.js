// filterProducts.js
// Filtra productos por categorías, atributos y datos de producto combinando varios criterios.

/**
 * Filtra una lista de productos por múltiples criterios.
 * @param {Array} productos - Array de productos (del JSON)
 * @param {Object} filtros - Objeto con los filtros a aplicar. Ejemplo:
 * {
 *   categorias: ["Gaming", "Ultraligeros"],
 *   atributos: { marca: ["HP", "Lenovo"], memoriaRam: ["8GB"] },
 *   datos: { precioMin: 500, precioMax: 1500, destacado: "Oferta" }
 * }
 * @returns {Array} - Array de productos filtrados
 */
function filterProducts(productos, filtros = {}) {
  return productos.filter((producto) => {
    // Filtrar por categorías (si se especifica)
    if (filtros.categorias && filtros.categorias.length > 0) {
      const matchCat = filtros.categorias.some((cat) =>
        producto.categorias.includes(cat)
      );
      if (!matchCat) return false;
    }
    // Filtrar por atributos (si se especifica)
    if (filtros.atributos) {
      for (const [key, valores] of Object.entries(filtros.atributos)) {
        if (valores.length > 0 && !valores.includes(producto.atributos[key])) {
          return false;
        }
      }
    }
    // Filtrar por datos de producto (precio, destacado, etc)
    if (filtros.datos) {
      if (
        filtros.datos.precioMin !== undefined &&
        producto.precio < filtros.datos.precioMin
      )
        return false;
      if (
        filtros.datos.precioMax !== undefined &&
        producto.precio > filtros.datos.precioMax
      )
        return false;
      if (
        filtros.datos.destacado &&
        !producto.destacados.includes(filtros.datos.destacado)
      )
        return false;
      if (
        filtros.datos.nombre &&
        !producto.nombre
          .toLowerCase()
          .includes(filtros.datos.nombre.toLowerCase())
      )
        return false;
    }
    return true;
  });
}

/**
 * Ordena un array de productos por el atributo indicado y dirección.
 * @param {Array} products - Array de productos
 * @param {string} attribute - Atributo por el que ordenar
 * @param {'asc'|'desc'} direction - Dirección de orden ('asc' o 'desc')
 * @returns {Array} - Array ordenado
 */
function orderBy(products, attribute, direction = "asc") {
  return [...products].sort((a, b) => {
    if (a[attribute] < b[attribute]) return direction === "asc" ? -1 : 1;
    if (a[attribute] > b[attribute]) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

module.exports = {
  filterProducts,
  orderBy,
};

/*
Ejemplo de uso:

const productos = require('./productos.json');
const { filterProducts, orderBy } = require('./utils/filterProducts');

const resultadosFiltrados = filterProducts(productos, {
  categorias: ["Gaming", "Ultraligeros"],
  atributos: { marca: ["HP", "Lenovo"], memoriaRam: ["8GB"] },
  datos: { precioMin: 500, precioMax: 1500, destacado: "Oferta" }
});

const resultadosOrdenados = orderBy(resultadosFiltrados, 'precio', 'desc');

// resultados contiene los productos que cumplen todos los filtros combinados
*/
