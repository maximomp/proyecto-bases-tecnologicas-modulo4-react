const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);

const productsPath = path.resolve(__dirname, "products.json");
const webPath = path.resolve(__dirname, "products_web.json");
const outDir = path.resolve(
  __dirname,
  "..",
  "public",
  "static",
  "images",
  "products"
);

if (!fs.existsSync(productsPath)) {
  console.error("products.json not found at", productsPath);
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
let web = [];
if (fs.existsSync(webPath)) {
  web = JSON.parse(fs.readFileSync(webPath, "utf8"));
}

// map productUrl -> img_url from web source
const urlMap = new Map();
for (const item of web) {
  if (item.link_url && item.img_url) urlMap.set(item.link_url, item.img_url);
}

function getRemoteUrl(item, idx) {
  if (item.img_url) return item.img_url;
  if (item.productUrl && urlMap.has(item.productUrl))
    return urlMap.get(item.productUrl);
  // try find by title
  const title = item.nombre || "";
  const found = web.find(
    (w) =>
      (w.title || "").replace(/\s+/g, " ").trim() ===
      (title || "").replace(/\s+/g, " ").trim()
  );
  if (found && found.img_url) return found.img_url;
  return null;
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9.\-_%]/gi, "_");
}

function downloadToFile(url, dest) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { timeout: 20000 }, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        // follow redirect
        return resolve(downloadToFile(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        return reject(
          new Error(`Failed to download ${url}. Status code: ${res.statusCode}`)
        );
      }
      const fileStream = fs.createWriteStream(dest);
      streamPipeline(res, fileStream)
        .then(() => resolve())
        .catch(reject);
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy(new Error("Request timeout"));
    });
  });
}

(async () => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    //console.og"Created directory", outDir);
  }

  //console.og`Starting download of ${products.length} images to ${outDir}`);

  const results = [];
  const concurrency = 5;
  let i = 0;

  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= products.length) return;
      const item = products[idx];
      const remote = getRemoteUrl(item, idx);
      if (!remote) {
        console.warn(
          `(${idx + 1}) No remote URL found for item id=${item.id} title="${
            item.nombre
          }"`
        );
        results.push({
          idx: idx + 1,
          id: item.id,
          ok: false,
          reason: "no-url",
        });
        continue;
      }

      // determine filename: prefer basename, but prefix with id to keep unique
      let base = path.basename(new URL(remote).pathname);
      if (!base || base.length < 3) base = `image_${item.id}.jpg`;
      base = `${String(item.id).padStart(3, "0")}_${sanitizeFilename(base)}`;
      const destPath = path.join(outDir, base);

      try {
        await downloadToFile(remote, destPath);
        // update imagen field to point to public served path starting from static/
        item.imagen = `static/images/products/${base}`;
        results.push({
          idx: idx + 1,
          id: item.id,
          ok: true,
          path: item.imagen,
        });
        if ((idx + 1) % 10 === 0)
          //console.og`Downloaded ${idx + 1}/${products.length}`);
      } catch (err) {
        console.error(`(${idx + 1}) Error downloading ${remote}:`, err.message);
        results.push({
          idx: idx + 1,
          id: item.id,
          ok: false,
          reason: err.message,
        });
      }
    }
  }

  // start workers
  const workers = [];
  for (let w = 0; w < concurrency; w++) workers.push(worker());
  await Promise.all(workers);

  // write back products.json with updated imagen fields
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf8");
  //console.og"Updated products.json with local image paths.");

  const okCount = results.filter((r) => r.ok).length;
  //console.og
    `Finished. Success: ${okCount}, Fail: ${results.length - okCount}`
  );
})();
