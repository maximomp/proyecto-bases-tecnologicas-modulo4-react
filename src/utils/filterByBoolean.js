// Filtra productos por un campo booleano
// Ejemplo de uso: filterByBoolean(products, 'novedad', true)

const filterByBoolean = (products, field, value = true) => {
  return products.filter((product) => product[field] === value);
};

export default filterByBoolean;
