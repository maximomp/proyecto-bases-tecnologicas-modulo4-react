// Ordena los productos poniendo primero los que tienen 'Oferta' en el grupo destacados
// Ejemplo de uso: orderByOfertaFirst(productos)

function orderByOfertaFirst(products) {
  return products.slice().sort((a, b) => {
    const aOferta =
      Array.isArray(a.destacados) && a.destacados.includes("Oferta");
    const bOferta =
      Array.isArray(b.destacados) && b.destacados.includes("Oferta");
    if (aOferta && !bOferta) return -1;
    if (!aOferta && bOferta) return 1;
    return 0;
  });
}

module.exports = orderByOfertaFirst;
