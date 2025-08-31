import os
import json
import requests

PRODUCTS_JSON = "./products.json"
PRODUCTS_WEB_JSON = "products_web.json"
IMAGES_DIR = "../public/static/images/products/"

# Load products.json
with open(PRODUCTS_JSON, "r", encoding="utf-8") as f:
    products = json.load(f)

# Load products_web.json
with open(PRODUCTS_WEB_JSON, "r", encoding="utf-8") as f:
    products_web = json.load(f)

# Build a lookup for image URLs from products_web.json
updated = False
for i, product in enumerate(products):
    try:
        img_url = products_web[i]["img_url"]
    except (IndexError, KeyError):
        print(f"No se encontró la URL de imagen para el índice {i}")
        continue
    filename = os.path.basename(img_url.split("?")[0])
    local_path = os.path.join(IMAGES_DIR, filename)
    if not os.path.exists(local_path):
        print(f"Descargando {img_url} -> {local_path}")
        try:
            resp = requests.get(img_url, timeout=10)
            resp.raise_for_status()
            with open(local_path, "wb") as imgf:
                imgf.write(resp.content)
        except Exception as e:
            print(f"ERROR al descargar {img_url}: {e}")
            raise
    if product["imagen"] != f"static/images/products/{filename}":
        product["imagen"] = f"static/images/products/{filename}"
        updated = True

# Save updated products.json if changed
if updated:
    with open(PRODUCTS_JSON, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print("products.json actualizado con nuevas rutas de imagen.")
else:
    print("No hubo cambios en las rutas de imagen.")
