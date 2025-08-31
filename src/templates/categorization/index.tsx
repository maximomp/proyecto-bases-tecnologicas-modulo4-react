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
  const [filtros, setFiltros] = useState([
    "HP",
    "32 GB RAM",
    "Asus",
    "16GB RAM",
    "Gaming",
    "Nuevo",
  ]);
  const [dynamicFilters, setDynamicFilters] = useState<Filter[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: any;
  }>({});
  {
    //   categorias: ["Gaming"],
    //   atributos: { marca: ["Lenovo", "MSI"] },
    //   datos: { precioMin: 700, precioMax: 1600 },

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

    console.log(dynamicFilters);

    const dynamicFiltersProps = {
      dynamicFilters,
      setDynamicFilters,
      selectedFilters,
      setSelectedFilters,
      products,
      setProducts,
    };

    return (
      <div
        className="categorization-container"
        data-key="categorization-container"
      >
        <aside className="filtros">
          <h2 className="filtros-titulo">Filtros populares</h2>
          <ul className="filtros-populares">
            <ul className="filtros-populares" data-key="filtros-populares"></ul>
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
            products={products}
            setProducts={setProducts}
          />
        </article>
      </div>
    );
  }
};

export default Categorization;
