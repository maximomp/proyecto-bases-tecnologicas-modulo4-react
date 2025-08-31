// Ordena los productos poniendo primero los que tienen un valor específico en un campo array
// Ejemplo de uso: orderByValueFirst(productos, 'destacados', 'Oferta')

function orderByValueFirst(products, field, value) {
  return products.slice().sort((a, b) => {
    const aHas = Array.isArray(a[field]) && a[field].includes(value);
    const bHas = Array.isArray(b[field]) && b[field].includes(value);
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    return 0;
  });
}

module.exports = orderByValueFirst;
