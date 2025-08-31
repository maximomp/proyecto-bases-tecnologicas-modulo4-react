import React, { useEffect, useState } from "react";
import OptionFilter from "./optionFilter";
import ProductsGridListItem from "./productsGridListItem";

interface Filter {
  title?: string;
  options?: Array<{
    label: string;
    results?: number;
    value?: string | number;
  }>;
  formType?: string;
  name?: string;
  // Add other properties as needed
}

interface DynamicFilterProps {
  filter: Filter;
  dynamicFilters?: Filter[];
  selectedFilters?: any;
  setSelectedFilters?: (filters: any) => void;
  idx?: number;
  products: any[];
}
const ProductsGridList: React.FC<DynamicFilterProps> = (props) => {
  const {
    dynamicFilters,
    filter,
    idx,
    selectedFilters,
    setSelectedFilters,
    products,
  } = props;

  return (
    <div className="products-grid-list" data-key="products-grid-list">
      {products.map((product, index) => (
        <ProductsGridListItem key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductsGridList;
