const fs = require("fs");
const path = require("path");

const inputPath = path.resolve(__dirname, "products_web.json");
const outputPath = path.resolve(__dirname, "products.json");

const CATEGORY_TITLES = [
  "Gaming",
  "Gaming avanzado",
  "Perfectos para estudiantes",
  "Profesional",
  "Diseño gráfico y edición",
  "Básicos hasta 500€",
  "Ultraligeros",
  "MacBook",
  "Reacondicionados gaming",
  "Reacondicionados ofimática",
];

function parseNumberFromText(text, regex) {
  const m = text.match(regex);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

function hasWord(text, word) {
  return text && text.toLowerCase().includes(word.toLowerCase());
}

function mapCategories(item, title, price) {
  const cats = [];
  if (
    hasWord(title, "Macbook") ||
    hasWord(title, "MacBook") ||
    hasWord(title, "Apple")
  )
    cats.push("MacBook");
  if (
    hasWord(title, "Gaming") ||
    hasWord(title, "Nitro") ||
    /RTX|RTX|GTX/.test(title)
  )
    cats.push("Gaming");
  // advanced gaming when high-end GPU or very high price
  if (
    /RTX (50|60|70|80|90)|RTX 50|RTX 60|RTX 70|RTX 80|RTX 90|RTX 5|RTX 4|RTX 5\d{2}/i.test(
      title
    ) &&
    price &&
    price > 1200
  )
    cats.push("Gaming avanzado");
  if (
    hasWord(title, "Chromebook") ||
    hasWord(title, "Chromebook") ||
    (price && price < 400)
  )
    cats.push("Perfectos para estudiantes");
  if (
    hasWord(title, "Professional") ||
    hasWord(title, "Prestige") ||
    hasWord(title, "ThinkPad") ||
    hasWord(title, "Pro")
  )
    cats.push("Profesional");
  if (
    hasWord(title, "OLED") ||
    hasWord(title, "RTX") ||
    hasWord(title, "RTX 40") ||
    hasWord(title, "RTX 50")
  )
    cats.push("Diseño gráfico y edición");
  if (price && price <= 500) cats.push("Básicos hasta 500€");
  if (
    hasWord(title, '14"') ||
    hasWord(title, '13.3"') ||
    hasWord(title, '13.6"') ||
    hasWord(title, '14"') ||
    hasWord(title, "Intel Evo") ||
    hasWord(title, "Ultrav")
  )
    cats.push("Ultraligeros");
  if (hasWord(title, "Refurbished") || hasWord(title, "Replay")) {
    if (hasWord(title, "Gaming")) cats.push("Reacondicionados gaming");
    else cats.push("Reacondicionados ofimática");
  }
  // ensure at least one
  if (cats.length === 0) {
    // fallback: professional for mid/high price, basicos for low
    if (price && price > 1000) cats.push("Profesional");
    else cats.push("Perfectos para estudiantes");
  }
  return cats;
}

function mapAttributes(item) {
  const title = (item.title || "").replace(/\n/g, " ").trim();
  const lower = title.toLowerCase();

  const marca = (title.split(" ")[0] || "").replace(":", "");

  const memoriaRam = (title.match(/(\d{1,3}GB)/i) || [""])[0] || "8GB";
  const almacenamientoSSD =
    (title.match(/(\d{1,2}TB|\d{2,4}GB)/i) || [""])[0] || "256GB";
  const pulgadas =
    parseNumberFromText(title, /([0-9]{1,2}(?:\.|,)?[0-9]?)\"/) ||
    parseNumberFromText(title, /(\d{1,2}(?:\.|,)\d)/) ||
    15.6;
  const procesador =
    (title.match(
      /(Intel Core [iI]\d[-\w\d]*|Intel Core Ultra [\w\d-]*|Intel Evo [^/\s]+|AMD Ryzen( AI)? [\w\d-]*|Apple M\d[\w-]*)/i
    ) || [""])[0].trim() || "";
  const tarjetaGrafica =
    (title.match(
      /(RTX\s?\d{3}|GTX\s?\d{3}|RTX\s?50\d|RTX\s?40\d|Iris Xe|Integrada|Integrated)/i
    ) || [""])[0] || (hasWord(title, "Gaming") ? "Dedicated" : "Integrada");
  const tipoPantalla = hasWord(title, "OLED") ? "OLED" : "IPS";
  const sistemaOperativo =
    hasWord(title, "Windows") ||
    hasWord(title, "WIN") ||
    hasWord(title, "Windows 11")
      ? "Windows 11"
      : hasWord(title, "FreeDOS")
      ? "FreeDOS"
      : hasWord(title, "Mac") || hasWord(title, "MacBook")
      ? "macOS"
      : "Windows 11";
  const resolucion = hasWord(title, "QHD")
    ? "QHD"
    : hasWord(title, "FHD") || hasWord(title, "Full HD")
    ? "Full HD"
    : "Full HD";
  const frecuenciaRefresco = (title.match(/(\d{2,3}Hz)/i) || ["60Hz"])[0];
  const inteligenciaArtificial =
    /\b(ai|ai\+|ai\+|ia|intel core ultra|ryzen ai)\b/i.test(title);
  const claseTeclado = /rgb|gamer|gaming/i.test(title) ? "RGB" : "Estándar";
  const tipoTecladoPortatil =
    /gaming|gamer|tuf|omen|nitro|rog|victus|raider|scar/i.test(title)
      ? "Gaming"
      : "Estándar";

  return {
    marca: marca || "PCCom",
    tipoPortatil: /Gaming|Nitro|OMEN|ROG|TUF|Victus|Scar|Raider/i.test(title)
      ? "Gaming"
      : "Básico",
    memoriaRam,
    procesador:
      procesador ||
      (hasWord(title, "Intel")
        ? "Intel"
        : hasWord(title, "AMD")
        ? "AMD"
        : "Desconocido"),
    tarjetaGrafica: tarjetaGrafica || "Integrada",
    idiomaTeclado: "Español",
    pulgadas: parseFloat(pulgadas),
    sistemaOperativo,
    almacenamientoSSD,
    tipoPantalla,
    inteligenciaArtificial,
    resolucion,
    frecuenciaRefresco,
    claseTeclado,
    conectividad: ["WiFi", "Bluetooth"],
    autonomia: /gaming|rtx|5060|5070|5090/i.test(title) ? "4h" : "6h",
    tipoTecladoPortatil,
  };
}

function mapDestacados(item, attrs) {
  const arr = [];
  if (/Gaming|RTX|OMEN|ROG|TUF|Nitro|Victus|Scar|Raid|Raider/i.test(item.title))
    arr.push("Gaming");
  if (item.envio && /mañana/i.test(item.envio)) arr.push("Envío rápido");
  if (item.price_original && item.price_original > item.price)
    arr.push("Oferta");
  if (attrs.inteligenciaArtificial) arr.push("Inteligencia Artificial");
  if (/Macbook|MacBook|Apple/i.test(item.title)) arr.push("MacBook");
  if (item.price && item.price <= 500) arr.push("Económico");
  // unique
  return Array.from(new Set(arr));
}

function parseRating(ratingText) {
  if (!ratingText) return null;
  const m = ratingText.match(/([0-9],[0-9]|[0-9]\.[0-9]|[0-9])/);
  if (!m) return null;
  return parseFloat(m[0].replace(",", "."));
}

function transformItem(i, item) {
  const title = (item.title || "").replace(/\n/g, " ").trim();
  const attrs = mapAttributes(item);
  const price = item.price || 0;
  const priceOriginal = item.price_original || null;
  const descuento = priceOriginal
    ? Math.round((1 - price / priceOriginal) * 100)
    : 0;
  const rating = parseRating(item.rating) || null;
  const opiniones = item.opinions || 0;
  const envioGratis = /envío gratis/i.test(item.envio || "");
  const recibeManana =
    /mañana/i.test(item.envio || "") || /hoy/i.test(item.envio || "");
  const imagen = (item.img_file || "")
    .replace(/^\.\.\/public\//, "static/")
    .replace(/^public\//, "static/");
  const categorias = mapCategories(item, title, price);
  const destacados = mapDestacados(item, attrs);

  return {
    seller: "PcComponentes",
    novedad: recibeManana,
    id: i + 1,
    nombre: title,
    precio: price,
    precioOriginal: priceOriginal,
    descuento: descuento,
    categorias: categorias,
    atributos: attrs,
    destacados: destacados,
    imagen: imagen || "static/images/products/default.jpg",
    opiniones: opiniones,
    valoracion: rating,
    envioGratis: envioGratis,
    recibeManana: recibeManana,
    ventas: opiniones,
    productUrl: item.link_url || "",
  };
}

function main() {
  const raw = fs.readFileSync(inputPath, "utf8");
  const data = JSON.parse(raw);
  const out = [];

  data.forEach((item, idx) => {
    const transformed = transformItem(idx, item);
    out.push(transformed);
    if ((idx + 1) % 10 === 0) {
      //console.og`Processed ${idx + 1} items`);
    }
  });

  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), "utf8");
  //console.og`Wrote ${out.length} items to ${outputPath}`);
}

main();
