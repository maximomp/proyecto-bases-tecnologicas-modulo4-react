// Script para normalizar y actualizar los productos
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../public/static/productos.json");
const sellers = [
  "PcComponentes",
  "Amazon",
  "MediaMarkt",
  "El Corte Inglés",
  "Fnac",
  "Coolmod",
  "Worten",
  "Carrefour",
  "Aliexpress",
  "PowerPlanetOnline",
];

const raw = fs.readFileSync(file, "utf8");
const productos = JSON.parse(raw);

const getRandomSeller = (i) => sellers[i % sellers.length];
const getRandomNovedad = (i) => i % 3 === 0;
const getRandomVentas = () => Math.floor(Math.random() * 1000) + 1;

const nuevos = productos.map((p, i) => {
  const destacados = p.destacados || [];
  let novedad = destacados.includes("Novedad") ? true : getRandomNovedad(i);
  return {
    ...p,
    seller: getRandomSeller(i),
    novedad,
    ventas: getRandomVentas(),
  };
});

fs.writeFileSync(file, JSON.stringify(nuevos, null, 2));
console.log("Productos normalizados con sellers y novedad variados.");
