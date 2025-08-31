import React from "react";
import styles from "./styles.module.css";

const HeaderTemplate: React.FC = () => (
  <header className="header">
    <div className="template">
      <div className="logo">
        <img
          className="logo-desktop"
          src="static/images/logo-pccomponentes.svg"
          alt="PCComponentes Logo"
        />
        <img
          className="logo-mobile"
          src="static/images/logo-mobile.png"
          alt="PCComponentes Logo"
        />
      </div>
      <nav aria-label="main menu" className="categorias">
        <button className="pc-categorias-btn">
          <span className="pc-categorias-icon">
            <svg
              className="icon-module_icon__Cn42w icon-module_big__8nlaM"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              enableBackground="new 0 0 24 24"
            >
              <path d="M22 5H2V7H22V5ZM2 11H22V13H2V11ZM2 17H22V19H2V17Z"></path>
            </svg>
          </span>
          <span className="pc-categorias-text">Todas las categorías</span>
        </button>
      </nav>
      <nav aria-label="search" className="search">
        <span className="pc-catalogo-select">
          Todo el catálogo
          <img
            className="dropdown-icon"
            src="static/images/dropdown-svgrepo-com.svg"
            alt="Dropdown Icon"
          />
        </span>
        <form className="search-form">
          <input
            type="text"
            placeholder="Buscar"
            className="search-form-input"
          />
          <button type="submit" className="search-form-button">
            <svg
              className="search-form-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              enable-background="new 0 0 24 24"
            >
              <path d="M21.7 20.3l-5.4-5.4c1.1-1.4 1.7-3.1 1.7-4.9 0-2.1-.8-4.1-2.3-5.7-1.6-1.5-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3c-1.5 1.6-2.3 3.6-2.3 5.7s.8 4.1 2.3 5.7c1.6 1.5 3.6 2.3 5.7 2.3 1.8 0 3.5-.6 4.9-1.7l5.4 5.4 1.4-1.4zm-11.7-4.3c-1.6 0-3.1-.6-4.2-1.8-1.2-1.1-1.8-2.6-1.8-4.2s.6-3.1 1.8-4.2c1.1-1.2 2.6-1.8 4.2-1.8s3.1.6 4.2 1.8c1.2 1.1 1.8 2.6 1.8 4.2s-.6 3.1-1.8 4.2c-1.1 1.2-2.6 1.8-4.2 1.8z"></path>
            </svg>
          </button>
        </form>
      </nav>
      <div aria-label="acciones" className="acciones ">
        <button className="search-ia-button ">
          <img src="static/images/stars.png" alt="IA Icon" />
          Buscar con IA
        </button>
        <a href="#" id="my-account" className="button-account-header">
          <svg
            className="icons-button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            enable-background="new 0 0 24 24"
          >
            <path d="M12 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM20 20h-16v-1c0-3.5 3.3-6 8-6s8 2.5 8 6v1zm-13.8-2h11.7c-.6-1.8-2.8-3-5.8-3s-5.3 1.2-5.9 3z"></path>
          </svg>{" "}
          <span className="text-account-header">Mi cuenta</span>
        </a>
        <a href="#" id="my-cart" className="button-account-header">
          <svg
            className="icons-button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            enable-background="new 0 0 24 24"
          >
            <path d="M2 2v2h3.2l2.8 12.2c.1.5.5.8 1 .8h10c.5 0 .9-.3 1-.8l2-8c.1-.3 0-.6-.2-.9-.2-.2-.5-.3-.8-.3h-.4l1.3-2.6c.2-.5.1-1-.3-1.3l-3-2c-.3-.1-.6-.1-.9-.1-.3.1-.5.3-.6.5l-2.1 4.3v-1.8c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v3h-1.1l-.9-4.2c-.1-.5-.5-.8-1-.8h-4zm11 3v2h-2v-2h2zm5.4 2h-1.8l1.8-3.5 1.3.9-1.3 2.6zm-10 2h11.3l-1.5 6h-8.4l-1.4-6z"></path>
            <circle cx="18" cy="20" r="2"></circle>
            <circle cx="10" cy="20" r="2"></circle>
          </svg>{" "}
          <span className="text-account-header">Mi cesta</span>{" "}
          <span className="pc-cart-count"></span>
        </a>
      </div>
      <nav aria-label="breadcrumb" className="breadcrumb">
        <a className="" href="#">
          Home
        </a>
        <img src="static/images/arrow.svg" alt="Breadcrumb Separator" />
        <a className="" href="#">
          Ordenadores
        </a>
        <img src="static/images/arrow.svg" alt="Breadcrumb Separator" />
        <a className="" href="#">
          Ordenadores Portátiles
        </a>
        <img src="static/images/arrow.svg" alt="Breadcrumb Separator" />
        <a className="" href="#">
          Portátiles
        </a>
      </nav>
      <article className="title-container">
        <h1>Portátiles</h1>
        <p>
          Exprime hasta la última hora del día con{" "}
          <strong>nuestros portátiles de las mejores marcas</strong>:{" "}
          <a href="#">HP</a>, <a href="#">Acer</a>, <a href="#">MSI</a>,{" "}
          <a href="#">Lenovo</a>, <a href="#">Dell</a>, <a href="#">Gigabyte</a>
          , <a href="#">LG</a>, <a href="#">Asus</a> y <a href="#">Macbook</a>.
          Visita nuestra sección de <a href="#">portátiles baratos</a>.
        </p>
      </article>
    </div>
  </header>
);

export default HeaderTemplate;
