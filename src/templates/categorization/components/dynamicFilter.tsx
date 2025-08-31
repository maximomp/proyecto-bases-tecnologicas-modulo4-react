import React, { useEffect, useState } from "react";
import OptionFilter from "./optionFilter";

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
  products?: any;
  setProducts?: (products: any) => void;
}
const DynamicFilter: React.FC<DynamicFilterProps> = (props) => {
  const {
    dynamicFilters,
    filter,
    idx,
    selectedFilters,
    setSelectedFilters,
    products,
    setProducts,
  } = props;

  const [filterOpened, setFilterOpened] = useState(false);

  // useEffect(() => {
  //   // Perform side effects or data fetching here

  // }, [dynamicFilters, selectedFilters]);

  return (
    <nav
      aria-label={`filtros de ${filter.title || idx}`}
      className="filtros-dinamicos-nav"
      key={`filtros-dinamicos-${filter.title || idx}`}
    >
      <div
        className="filtros-titulo-container"
        key={`filtros-titulo-${filter.title || idx}`}
        onClick={() => setFilterOpened(!filterOpened)}
      >
        <span className="filtros-titulo">
          {filter.title || filter.title || JSON.stringify(filter)}
        </span>
        <div
          id={`filtro-titulo-${filter.title || idx}-closeIcon`}
          className="accordion-module_closeIcon_container"
        >
          <span className="accordion-module-closeIcon-icon"></span>
        </div>
      </div>

      <ul
        className={`filtros-opciones ${
          filterOpened ? "filtros-opciones-open" : "filtros-opciones-closed"
        }`}
        id={`${filter.title || idx}-options`}
        data-key={`${filter.title || idx}-options`}
      >
        {filter.options?.map((option, index) => (
          <OptionFilter
            key={option.label || index}
            filter={filter}
            dynamicFilters={dynamicFilters}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            products={products}
            setProducts={setProducts}
            index={index}
            option={option}
          />
        ))}
      </ul>
    </nav>
  );
};

export default DynamicFilter;

//   <ul
//     className="filtros-opciones filtros-opciones-closed"
//     id={`${filter.title || idx}-options`}
//     data-key={`${filter.title || idx}-options`}
//   ></ul>
