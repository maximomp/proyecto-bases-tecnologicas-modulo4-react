import React, { use, useEffect, useRef, useState } from "react";
import OptionFilter from "./optionFilter";
import ProductsGridList from "./productsGridList";
import CategorizationScrollControls from "./CategorizationScrollControls";
import orderBy from "../../../utils/orderBy";
import orderByValueFirst from "../../../utils/orderByValueFirst";
import orderByComparison from "../../../utils/filterByComparison";
import OrderByScrollControls from "./OrderByScrollControls";

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
  handleOpenClose: () => void;
  handleToggleCategoryFilter: (filter: {
    attributo?: string;
    category?: string;
    value: any;
  }) => void;
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

  // longitud de productos (contador mostrado en la UI)
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

  // efecto de depuración: ver cambios en products
  useEffect(() => {
    console.log(
      "Products updated:",
      products,
      orderBy(products, "precio", "desc")
    );
  }, [products]);

  // efecto vacío que depende del criterio de orden seleccionado (placeholder)
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

  // refs y estado para el desplazamiento horizontal de la barra de categorización
  const categorizationRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [shiftX, setShiftX] = useState<number>(0);

  // check overflow and adjust shift bounds
  // categorization overflow logic moved into CategorizationScrollControls component

  // desplaza en pasos de 100px: dir=+1 mueve a la derecha (muestra items anteriores)
  const shift = (dir: number) => {
    const wrapper = wrapperRef.current;
    const inner = categorizationRef.current;
    if (!wrapper || !inner) return;
    const maxNegative = Math.min(0, wrapper.clientWidth - inner.scrollWidth);
    let newShift = shiftX + dir * 100;
    if (newShift > 0) newShift = 0;
    if (newShift < maxNegative) newShift = maxNegative;
    setShiftX(newShift);
  };

  // --- estado/funciones para el scroller del order-by (la lógica de overflow está en el componente) ---
  const orderByWrapperRef = useRef<HTMLDivElement | null>(null);
  const orderByInnerRef = useRef<HTMLDivElement | null>(null);
  const [orderByShift, setOrderByShift] = useState<number>(0);

  const shiftOrderBy = (dir: number) => {
    const wrapper = orderByWrapperRef.current;
    const inner = orderByInnerRef.current;
    if (!wrapper || !inner) return;
    const maxNegative = Math.min(0, wrapper.clientWidth - inner.scrollWidth);
    let newShift = orderByShift + dir * 100;
    if (newShift > 0) newShift = 0;
    if (newShift < maxNegative) newShift = maxNegative;
    setOrderByShift(newShift);
  };

  // la comprobación de overflow y el clamping se realizan dentro de OrderByScrollControls

  return (
    <div className="products-grid-container" data-key="products-grid-container">
      <div
        className="products-grid-use-categorization-wrapper"
        ref={wrapperRef}
      >
        {/* Left/Right controls (visible only when overflow present); hide when at ends */}
        <CategorizationScrollControls
          wrapperRef={wrapperRef}
          innerRef={categorizationRef}
          shiftX={shiftX}
          onShift={shift}
          setShift={setShiftX}
        />

        <div
          ref={categorizationRef}
          className="products-grid-use-categorization"
          style={{
            transform: `translateX(${shiftX}px)`,
            transition: "transform 200ms ease",
          }}
        >
          {/* Mapeo de categorías de uso */}
          {categorizationUse.map((use) => (
            <div
              key={use.id}
              className="use-categorization"
              data-key={`use-categorization-${use.id}`}
              onClick={() =>
                props.handleToggleCategoryFilter({
                  category: "uso",
                  value: use.title,
                })
              }
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

        <span id="action-bar-total-products">
          <span
            className="filters-button-container"
            onClick={() => props.handleOpenClose()}
          >
            <svg
              className="filters-button-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              enableBackground="new 0 0 24 24"
              fill="white"
            >
              <path d="M19 9c1.7 0 3-1.3 3-3s-1.3-3-3-3c-1.3 0-2.4.8-2.8 2H2v2h14.2c.4 1.2 1.5 2 2.8 2zm0-4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zM9 9c-1.3 0-2.4.8-2.8 2H2v2h4.2c.4 1.2 1.5 2 2.8 2s2.4-.8 2.8-2H22v-2H11.8c-.4-1.2-1.5-2-2.8-2zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM19 15c-1.3 0-2.4.8-2.8 2H2v2h14.2c.4 1.2 1.5 2 2.8 2 1.7 0 3-1.3 3-3s-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"></path>
            </svg>
            <span className="filters-button-text">Filtrar</span>
          </span>
          {productCount} artículos
        </span>
        {/* Filtros de ordenamiento - use existing container as wrapper (do not change classes) */}
        <div
          className="orderby-filters-container"
          ref={orderByWrapperRef}
          style={{ position: "relative" }}
        >
          <OrderByScrollControls
            wrapperRef={orderByWrapperRef}
            innerRef={orderByInnerRef}
            shiftX={orderByShift}
            onShift={shiftOrderBy}
            setShift={setOrderByShift}
          />

          <div
            className="orderby-filters-container-buttons"
            ref={orderByInnerRef}
            style={{ transform: `translateX(${orderByShift}px)` }}
          >
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
