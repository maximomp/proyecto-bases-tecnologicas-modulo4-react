import React, { useEffect, useState } from "react";
import DynamicFilter from "./dynamicFilter";

interface DynamicFiltersProps {
  dynamicFilters: Array<any>;
  selectedFilters: any;
  setSelectedFilters: (filters: any) => void;
  products: any;
  setProducts: (products: any) => void;
}

const DynamicFilters: React.FC<DynamicFiltersProps> = (props) => {
  const {
    dynamicFilters,
    selectedFilters,
    setSelectedFilters,
    products,
    setProducts,
  } = props;

  return (
    <div className="filtros-dinamicos">
      {dynamicFilters.map((filter, idx) => (
        <DynamicFilter
          key={`filtro-dinamico-${filter.title || idx}`}
          filter={filter}
          idx={idx}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          products={products}
          setProducts={setProducts}
        />
      ))}
    </div>
  );
};

export default DynamicFilters;

//   <ul
//     className="filtros-opciones filtros-opciones-closed"
//     id={`${filter.title || idx}-options`}
//     data-key={`${filter.title || idx}-options`}
//   ></ul>
