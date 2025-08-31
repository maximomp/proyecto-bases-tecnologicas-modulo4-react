import json
import os

# Ruta al archivo productos.json
json_path = '../public/static/productos.json'
# Carpeta de imágenes
img_folder = '../public/static/images/products'
img_count = 40

# Cargar productos
with open(json_path, 'r', encoding='utf-8') as f:
    productos = json.load(f)

# Modificar la url de imagen de cada producto
for idx, producto in enumerate(productos):
    img_num = (idx % img_count) + 1
    producto['imagen'] = f'static/images/products/product-{img_num}.jpg'

# Guardar el archivo modificado
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(productos, f, ensure_ascii=False, indent=2)

print('URLs de imágenes actualizadas en productos.json')
