// Ordena productos según la comparación entre dos campos
// Ejemplo de uso: orderByComparison(products, 'precio', 'precioOriginal', (a, b) => a - b)

function orderByComparison(
  products,
  fieldA,
  fieldB,
  comparator = (a, b) => a - b
) {
  return products
    .slice()
    .sort(
      (p1, p2) =>
        comparator(Number(p1[fieldA]), Number(p1[fieldB])) -
        comparator(Number(p2[fieldA]), Number(p2[fieldB]))
    );
}

module.exports = orderByComparison;
