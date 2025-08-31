import React, { useEffect, useState } from "react";
import OptionFilter from "./optionFilter";

interface Product {
  imagen: string | Blob | undefined;
  nombre: string;
  precio: string;
  precioOriginal: string;
  valoracion: number;
  // Agrega más propiedades según sea necesario
}

interface ProductsGridListItemProps {
  product: Product;
  dataKey?: string;
}

const ProductsGridListItem: React.FC<ProductsGridListItemProps> = ({
  product,
  dataKey,
}) => {
  return (
    <a
      href="#"
      className="product-grid-product"
      title={product.nombre}
      data-key={dataKey}
    >
      <div className="product-card">
        <div className="product-card-image-container">
          <div className="product-card-image-discount-container">
            <div>
              <span className="product-card-image-discount">
                <span className="product-card-image-discount-text"> -32%</span>
              </span>
            </div>
          </div>
          <div className="product-card-image-subcontainer">
            <img
              title={product.nombre}
              alt={product.nombre}
              src={product.imagen}
              loading="lazy"
              className="product-card-image"
            />
          </div>
        </div>
        <div className="product-content">
          <div>
            <h3 className="product-content-title">{product.nombre}</h3>
            <div className="">
              <div className="product-card-price-container">
                <span className="product-card-price">{product.precio}</span>
                <span className="product-card-price-original">
                  {product.precioOriginal}€
                </span>
              </div>
            </div>
            <div className="product-card-rating-container">
              <div className="product-card-rating-subcontainer">
                <span className="product-card-rating">
                  {product.valoracion}/5
                </span>
                <div className="product-card-rating-icon-container">
                  <svg
                    className="product-card-rating-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    enableBackground="new 0 0 24 24"
                    fill="#FFA90D"
                  >
                    <path d="M21.9 8.6c-.1-.4-.5-.6-.9-.6h-5.4l-2.7-5.4c-.3-.7-1.4-.7-1.8 0L8.4 8H3c-.4 0-.8.2-.9.6-.2.4-.1.8.2 1.1l4.6 4.6L5 20.7c-.1.4 0 .8.4 1.1.3.2.8.3 1.1 0l5.4-3.6 5.4 3.6c.2.1.4.2.6.2.2 0 .4-.1.6-.2.3-.2.5-.7.4-1.1l-1.8-6.4 4.6-4.6c.3-.3.4-.7.2-1.1z"></path>
                  </svg>
                </div>
                <span className="product-card-opiniones-count">
                  499 opiniones
                </span>
              </div>
            </div>
            <div className="product-card-vendor-info">
              <div className="product-card-vendor-info-subcontainer">
                <span>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    enableBackground="new 0 0 24 24"
                    fill="rgb(255, 96, 0)"
                  >
                    <path
                      d="M21.974 5.811v12.232c.151 3.264-4.177 5.352-7.211 5.864-2.098.36-4.083-.399-5.33-1.044L.68 18.29c-.226-.151-.68-.417-.68-1.347V4.483c0-1.689 1.701-.598 2.987-.104l6.606 2.77c1.531.665 3.761 1.538 5.529 1.367 3.856-.351 6.852-2.705 6.852-2.705z"
                      fill="url(#pcc-icon-gradient)"
                    ></path>
                    <path
                      d="M13.81 6.048c1.283.31 3.142-.311 4.816-1.448.474-.282.436-.981-.726-1.487C15.912 2.25 12.529.772 12.529.772 11.04.12 9.71-.676 9.71.995v3.42s3.263 1.429 4.1 1.633z"
                      fill="url(#pcc-icon-gradient)"
                    ></path>
                  </svg> */}
                </span>
                <div className="">
                  <div className="">
                    <div className="">
                      <div className="">
                        {/* <svg
                          className="product-card-vendor-info-svg"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          enableBackground="new 0 0 24 24"
                        >
                          <path
                            d="M21.974 5.811v12.232c.151 3.264-4.177 5.352-7.211 5.864-2.098.36-4.083-.399-5.33-1.044L.68 18.29c-.226-.151-.68-.417-.68-1.347V4.483c0-1.689 1.701-.598 2.987-.104l6.606 2.77c1.531.665 3.761 1.538 5.529 1.367 3.856-.351 6.852-2.705 6.852-2.705z"
                            fill="url(#pcc-icon-gradient)"
                          ></path>
                          <path
                            d="M13.81 6.048c1.283.31 3.142-.311 4.816-1.448.474-.282.436-.981-.726-1.487C15.912 2.25 12.529.772 12.529.772 11.04.12 9.71-.676 9.71.995v3.42s3.263 1.429 4.1 1.633z"
                            fill="url(#pcc-icon-gradient)"
                          ></path>
                        </svg> */}
                        {/* <span className="">
                          Vendido y enviado por{" "}
                          <span className="">PcComponentes</span>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <span className="product-card-delivery-info">
                <span className="product-card-delivery-info-free">
                  Envío gratis.{" "}
                </span>
                <span className="product-card-delivery-info-terms">
                  Recíbelo mañana
                </span>
              </span>
            </div>
          </div>
          {/* <div className="">
            <div className="">
              <div className="">
                <div className="">
                  <input
                    id={`compare.${product.nombre}`}
                    type="checkbox"
                    className=""
                    value=""
                  />
                </div>
                <div className="">
                  <label htmlFor={`compare.${product.nombre}`} className="">
                    <span className="">Comparar</span>
                  </label>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </a>
  );
};

export default ProductsGridListItem;
