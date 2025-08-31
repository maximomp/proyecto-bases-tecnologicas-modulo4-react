"use client";

import React, { useEffect, useState } from "react";
import generateFilters from "../../utils/generateFilters";
import DynamicFilters from "./components/dynamicFilters";
import ProductsGrid from "./components/productsGrid";
import orderBy from "../../utils/orderBy";
import { filterProducts } from "../../utils/filterProducts";

async function cargarFiltros() {
  // Cambia la ruta para que apunte a la carpeta public
  const res = await fetch("/static/productos.json");
  const productos = await res.json();
  const filtros = generateFilters(productos);
  return [filtros, productos];
}

type Filter = {
  title?: string;
  name?: string;
  [key: string]: any;
};

const Categorization: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  //   const [filtros, setFiltros] = useState([
  //     "HP",
  //     "32 GB RAM",
  //     "Asus",
  //     "16GB RAM",
  //     "Gaming",
  //   ]);
  const [filtros, setFiltros] = useState([
    {
      attributo: "marca",
      value: "HP",
    },
    {
      attributo: "memoriaRam",
      value: "16GB",
    },
    {
      attributo: "memoriaRam",
      value: "32GB",
    },
    {
      attributo: "tipoTecladoPortatil",
      value: "Gaming",
    },
    {
      attributo: "marca",
      value: "ASUS",
    },
  ]);

  const [dynamicFilters, setDynamicFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: any;
  }>({});
  const [filtersOpened, setFiltersOpened] = useState<boolean>(false);

  // Simula cargar los filtros y productos al montar el componente
  useEffect(() => {
    async function fetchData() {
      const [filtrosRaw, productsRaw] = await cargarFiltros();
      setDynamicFilters(filtrosRaw);
      setProducts(orderBy(productsRaw, "precio", "asc"));
    }
    fetchData();
  }, []);

  console.log("Selected Filters:", selectedFilters);

  console.log("Filters:", dynamicFilters);

  useEffect(() => {});

  console.log(dynamicFilters);

  const dynamicFiltersProps = {
    dynamicFilters,
    setDynamicFilters,
    selectedFilters,
    setSelectedFilters,
    products,
    setProducts,
  };

  const handleOpenClose = () => {
    //if device width is less than 1200
    setFiltersOpened(!filtersOpened);
  };

  const resetFilters = () => {
    setSelectedFilters({});
  };

  const handleSelectFilterFromPopular = (filter: any) => {
    // reset filters first
    resetFilters();
    setSelectedFilters((prev) => ({
      atributos: {
        [filter.attributo]: [filter.value],
      },
    }));
  };

  // Añadir función para alternar (toggle) un filtro de categoría al hacer clic
  // Recibe un objeto { attributo?, category?, value } y lo añade o lo quita de selectedFilters.
  const handleToggleCategoryFilter = (filter: {
    attributo?: string;
    category?: string;
    value: any;
  }) => {
    resetFilters();
    setSelectedFilters((prev) => {
      // si vienen categorias (p. ej. category: 'uso'), actualizamos selectedFilters.categorias
      if (filter.category) {
        const val = String(filter.value);
        const prevCategorias: string[] =
          prev && prev.categorias
            ? prev.categorias.map((v: any) => String(v))
            : [];
        const idx = prevCategorias.indexOf(val);
        if (idx >= 0) {
          prevCategorias.splice(idx, 1);
        } else {
          prevCategorias.push(val);
        }

        const next = { ...(prev as any) };
        if (prevCategorias.length > 0) {
          next.categorias = prevCategorias;
        } else {
          delete next.categorias;
        }

        // si no quedan claves en next, devolver objeto vacío
        if (Object.keys(next).length === 0) return {};
        return next;
      }

      // Si viene attributo, mantenemos la lógica previa (atributos object)
      const val = String(filter.value);
      const prevAtributos = prev && prev.atributos ? { ...prev.atributos } : {};
      const currentValues: string[] = prevAtributos[filter.attributo as string]
        ? prevAtributos[filter.attributo as string].map((v: any) => String(v))
        : [];

      const index = currentValues.indexOf(val);
      if (index >= 0) {
        // existe: lo eliminamos
        currentValues.splice(index, 1);
      } else {
        // no existe: lo añadimos
        currentValues.push(val);
      }

      if (currentValues.length > 0) {
        prevAtributos[filter.attributo as string] = currentValues;
      } else {
        // si no quedan valores para ese atributo, lo eliminamos
        delete prevAtributos[filter.attributo as string];
      }

      const next = {
        ...(prev as any),
        atributos: prevAtributos,
      } as any;

      // si atributos está vacío y no hay otras claves, devolver objeto vacío
      if (
        (!next.atributos || Object.keys(next.atributos).length === 0) &&
        (!next.categorias || next.categorias.length === 0)
      ) {
        const { atributos, categorias, ...rest } = next;
        return Object.keys(rest).length > 0 ? { ...rest } : {};
      }

      return next;
    });
  };

  useEffect(() => {
    // cuando cambiar los filtros selecionados se filtran los productos
    // si existen filtros seleccionados
    if (Object.keys(selectedFilters).length > 0) {
      async function fetchData() {
        const [filtrosRaw, productsRaw] = await cargarFiltros();
        const filteredProducts = filterProducts(productsRaw, selectedFilters);
        setProducts(filteredProducts);
        //   setProducts(orderBy(productsRaw, "precio", "asc"));
        console.log("Filtered Products:", filteredProducts);
      }
      fetchData();
    } else {
      console.log("No selected filters, resetting products", products);
      async function fetchData() {
        const [filtrosRaw, productsRaw] = await cargarFiltros();
        setProducts(orderBy(productsRaw, "precio", "asc"));
      }
      fetchData();
    }
  }, [selectedFilters]);

  return (
    <div
      className="categorization-container"
      data-key="categorization-container"
    >
      <aside
        className={`filtros ${
          filtersOpened ? "open-filters" : "close-filters"
        }`}
      >
        <div className="button-filters-control-container">
          <button
            className="button-filters-control-button-close"
            onClick={() => handleOpenClose()}
          >
            <div className="">
              <svg
                className=""
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                enableBackground="new 0 0 24 24"
              >
                <path d="M18.5061 4.22183L12.1421 10.5858L5.77817 4.22183L4.36396 5.63604L10.7279 12L4.36396 18.364L5.77817 19.7782L12.1421 13.4142L18.5061 19.7782L19.9203 18.364L13.5563 12L19.9203 5.63604L18.5061 4.22183Z"></path>
              </svg>
              Cerrar
            </div>
          </button>
          <button className="button-filters-delete-filters">
            <div className="" onClick={() => resetFilters()}>
              Borrar filtros
            </div>
          </button>
        </div>
        <h2 className="filtros-titulo">Filtros populares</h2>
        <ul className="filtros-populares">
          <ul className="filtros-populares" data-key="filtros-populares">
            {filtros.map((filtro, index) => (
              <li
                key={`${filtro.attributo}-${filtro.value}-${index}`}
                className="filtros-populares-item"
                data-key={`filtro-popular-${filtro || index}`}
                onClick={() => handleSelectFilterFromPopular(filtro)}
              >
                {filtro.value}
              </li>
            ))}
          </ul>
        </ul>
        <h2 className="filtros-titulo">Búsqueda de filtros</h2>
        <ul className="filtros-busqueda"></ul>
        <hr className="hr-css-title" />
        <DynamicFilters {...dynamicFiltersProps} />
        <ul className="filtros-test"></ul>
        <ul className="filtros-populares2"></ul>
        <div className="filtros-dinamicosasdasdasd"></div>
      </aside>

      {/* Aquí puedes renderizar los filtros y productos */}

      <article className="productos">
        <ProductsGrid
          filter={{}}
          dynamicFilters={dynamicFilters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          handleToggleCategoryFilter={handleToggleCategoryFilter}
          products={products}
          setProducts={setProducts}
          handleOpenClose={handleOpenClose}
        />
      </article>
    </div>
  );
};

export default Categorization;
