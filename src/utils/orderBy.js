function orderBy(products, attribute, direction = "asc") {
  return [...products].sort((a, b) => {
    if (a[attribute] < b[attribute]) return direction === "asc" ? -1 : 1;
    if (a[attribute] > b[attribute]) return direction === "asc" ? 1 : -1;
    return 0;
  });
}
export default orderBy;
