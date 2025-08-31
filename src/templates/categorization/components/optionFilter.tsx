import React, { useEffect, useState } from "react";
import filterProducts from "../../../utils/filterProducts";

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

interface OptionFilterProps {
  filter: Filter;
  dynamicFilters?: Filter[];
  selectedFilters?: any;
  setSelectedFilters?: (filters: any) => void;
  products?: any;
  setProducts?: (products: any) => void;
  index?: number;
  option: {
    label: string;
    results?: number;
    value?: string | number;
  };
}
const OptionFilter: React.FC<OptionFilterProps> = (props) => {
  const {
    dynamicFilters,
    filter,
    index,
    selectedFilters,
    setSelectedFilters,
    option,
    products,
    setProducts,
  } = props;

  // useEffect(() => {
  //   // Perform side effects or data fetching here

  // }, [dynamicFilters, selectedFilters]);

  // return none if option.label not in filter
  if (!filter.options?.some((opt) => opt.label === option.label)) {
    return null;
  }

  // detect if option is selected
  interface SelectedFilter {
    label: string;
    results?: number;
    value?: string | number;
    // Add other properties as needed
  }

  // Mejor lógica para saber si el filtro está seleccionado
  let isSelected = false;
  if (
    selectedFilters &&
    selectedFilters.atributos &&
    Array.isArray(selectedFilters.atributos[String(filter.name)])
  ) {
    isSelected = selectedFilters.atributos[String(filter.name)].includes(
      option.value
    );
  }

  // add filter to selection state
  const addFilterToSelection = (e: React.MouseEvent<HTMLLIElement>) => {
    const input = e.currentTarget.querySelector("input");
    if (!input) return;
    const optionValue = input.value;
    const optionLabel = option.label;
    const selectedOption = { filter: filter.name, value: optionValue };
    console.log("selectedOption", selectedOption, option, optionValue, filter);
    if (setSelectedFilters) {
      setSelectedFilters((prev: any) => {
        let toReturn = prev;
        const currentValues = Array.isArray(
          prev["atributos"]?.[String(filter.name)]
        )
          ? prev["atributos"]?.[String(filter.name)]
          : [];
        let newValues;
        // Detectar si el valor está seleccionado en el array actual
        const alreadySelected = currentValues.includes(optionValue);
        if (alreadySelected) {
          // Si está seleccionado, lo quitamos
          newValues = currentValues.filter(
            (value: string) => value !== optionValue
          );
        } else {
          // Si no está, lo añadimos solo si no existe
          newValues = [...currentValues, optionValue];
        }
        if (newValues.length === 0) {
          // Creamos una copia de atributos y eliminamos la clave
          const newAtributos = { ...prev["atributos"] };
          delete newAtributos[String(filter.name)];
          toReturn = {
            ...prev,
            atributos: newAtributos,
          };
        } else {
          toReturn = {
            ...prev,
            atributos: {
              ...prev["atributos"],
              [String(filter.name)]: newValues,
            },
          };
        }
        // si attributos está vacio se elimina la clave
        if (Object.keys(toReturn.atributos).length === 0) {
          delete toReturn.atributos;
        }
        return toReturn;
      });
    }
  };

  return (
    <li
      className="filtros-opcion-li"
      key={option.label || index}
      onClick={addFilterToSelection}
    >
      <input
        type={filter.formType}
        name={filter.name}
        value={option.value}
        checked={isSelected}
        id={`filtro-opcion-${option.value}`}
        onChange={() => {}}
      />
      <label>
        <span className="filtros-opcion-label">{option.label}</span>
        <span className="filtros-opcion-count">
          ({option.results ? option.results : 0})
        </span>
      </label>
    </li>
  );
};

export default OptionFilter;

//   <ul
//     className="filtros-opciones filtros-opciones-closed"
//     id={`${filter.title || idx}-options`}
//     data-key={`${filter.title || idx}-options`}
//   ></ul>
