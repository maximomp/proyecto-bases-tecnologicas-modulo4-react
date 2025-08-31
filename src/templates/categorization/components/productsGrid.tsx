import React, { use, useEffect, useState } from "react";
import OptionFilter from "./optionFilter";
import ProductsGridList from "./productsGridList";
import orderBy from "../../../utils/orderBy";
import orderByValueFirst from "../../../utils/orderByValueFirst";
import orderByComparison from "../../../utils/filterByComparison";

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
  setProducts: any;
}
const ProductsGrid: React.FC<DynamicFilterProps> = (props) => {
  const {
    dynamicFilters,
    filter,
    idx,
    selectedFilters,
    setSelectedFilters,
    products,
    setProducts,
  } = props;

  //length of producs
  const productCount = products.length;

  const [selectedOrderBy, setSelectedOrderBy] =
    useState<string>("sorting-relevance");

  interface OrderBySelector {
    id: string;
    text: string;
  }

  const [orderBySelectors, setOrderBySelectors] = useState<OrderBySelector[]>([
    {
      id: "sorting-relevance",
      text: "Relevancia",
    },
    {
      id: "sorting-price_asc",
      text: "Precio más bajo",
    },
    {
      id: "sorting-price_desc",
      text: "Precio más alto",
    },
    {
      id: "sorting-sales",
      text: "Más Vendidos",
    },
    {
      id: "sorting-discount",
      text: "Oferta",
    },
    {
      id: "sorting-top_rated",
      text: "Mejor Valorados",
    },
    {
      id: "sorting-activation_date",
      text: "Novedades",
    },
  ]);

  interface CategorizationUseItem {
    id: string;
    title: string;
    alt: string;
    img: string;
  }

  const [categorizationUse, setCategorizationUse] = useState<
    CategorizationUseItem[]
  >([
    {
      id: "gaming",
      title: "Gaming",
      alt: "gaming",
      img: "static/images/categorization/use/gaming.png",
    },
    {
      id: "gaming-advanced",
      title: "Gaming avanzado",
      alt: "gaming-advanced",
      img: "static/images/categorization/use/gaming-avanzado.png",
    },
    {
      id: "student-friendly",
      title: "Perfectos para estudiantes",
      alt: "student-friendly",
      img: "static/images/categorization/use/perfectos-estudiantes.png",
    },
    {
      id: "professional",
      title: "Profesional",
      alt: "professional",
      img: "static/images/categorization/use/profesional.png",
    },
    {
      id: "graphic-design",
      title: "Diseño gráfico y edición",
      alt: "graphic-design",
      img: "static/images/categorization/use/diseno.png",
    },
    {
      id: "basicos-500",
      title: "Básicos hasta 500€",
      alt: "basicos-500",
      img: "static/images/categorization/use/basicos.png",
    },
    {
      id: "ultraligeros",
      title: "Ultraligeros",
      alt: "ultraligeros",
      img: "static/images/categorization/use/ultraligeros.png",
    },
    {
      id: "macbook",
      title: "MacBook",
      alt: "macbook",
      img: "static/images/categorization/use/macbook.png",
    },
    {
      id: "reacondicionados-gaming",
      title: "Reacondicionados gaming",
      alt: "reacondicionados-gaming",
      img: "static/images/categorization/use/reacondicionados-gaming.png",
    },
    {
      id: "reacondicionados-ofimatica",
      title: "Reacondicionados ofimática",
      alt: "reacondicionados-ofimatica",
      img: "static/images/categorization/use/reacondicionados-ofimatica.png",
    },
  ]);

  useEffect(() => {
    console.log(
      "Products updated:",
      products,
      orderBy(products, "precio", "desc")
    );
  }, [products]);

  useEffect(() => {}, [selectedOrderBy]);

  const handleOrderByChange = (event: any) => {
    const id = event.currentTarget.id;
    setSelectedOrderBy(id);
    console.log("Order by changed to:", id, event.currentTarget, event);
    // poner
    if (id === "sorting-relevance") {
      setProducts(orderBy(products, "valoracion", "desc"));
    } else if (id === "sorting-price_asc") {
      setProducts(orderBy(products, "precio", "asc"));
    } else if (id === "sorting-price_desc") {
      setProducts(orderBy(products, "precio", "desc"));
    } else if (id === "sorting-sales") {
      setProducts(orderBy(products, "ventas", "desc"));
    } else if (id === "sorting-discount") {
      setProducts(orderByValueFirst(products, "destacados", "Oferta"));
    } else if (id === "sorting-top_rated") {
      setProducts(orderBy(products, "valoracion", "desc"));
    } else if (id === "sorting-activation_date") {
      setProducts(orderByValueFirst(products, "destacados", "Novedad"));
    }
  };

  return (
    <div className="products-grid-container" data-key="products-grid-container">
      <div className="products-grid-use-categorization">
        {/* Mapeo de categorías de uso */}
        {categorizationUse.map((use) => (
          <div
            key={use.id}
            className="use-categorization"
            data-key={`use-categorization-${use.id}`}
          >
            <div className="use-categorization-image-container">
              <img title={use.title} alt={use.alt} src={use.img} />
            </div>
            <div className="use-categorization-text">
              <h3 title={use.title} className="sc-kueqoe xCPCI">
                {use.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="products-grid-orderby">
        {/* Comparar productos */}
        <button className="products-grid-orderby-compare">
          <div className="button-flex-container">
            <div>
              <img
                className="button-flex-container-img"
                src="static/images/compare.svg"
                alt="Comparar"
              />
              Comparar
              <div className="sc-cwVcKo fmvrnz sc-hLtSKV gtzdA-d"></div>
            </div>
          </div>
        </button>
        <span id="action-bar-total-products">{productCount} artículos</span>
        {/* Filtros de ordenamiento */}
        <div className="orderby-filters-container">
          <div className="orderby-filters-container-buttons">
            {orderBySelectors.map((selector) => (
              <button
                key={selector.id}
                className="orderby-filters-container-button"
                id={selector.id}
                onClick={(e) => handleOrderByChange(e)}
              >
                <div>{selector.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="products-grid" data-key="products-grid">
        <ProductsGridList products={products} filter={filter} />
      </div>
    </div>
  );
};

export default ProductsGrid;
