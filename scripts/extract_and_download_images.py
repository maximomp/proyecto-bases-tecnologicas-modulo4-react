import re
import requests
import os

# Ruta al archivo HTML
html_file = 'test.html'
# Carpeta destino para imágenes descargadas
output_dir = 'downloaded_images'
os.makedirs(output_dir, exist_ok=True)

# Leer el HTML
with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

# Extraer todos los src de etiquetas <img>
img_urls = re.findall(r'<img[^>]+src=["\"](.*?)["\"]', html)
print(f"Encontradas {len(img_urls)} imágenes.")

# Descargar cada imagen
for idx, url in enumerate(img_urls):
    try:
        filename = os.path.join(output_dir, f"product-{idx+1}.jpg")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        with open(filename, 'wb') as img_file:
            img_file.write(response.content)
        print(f"Descargada: {filename}")
    except Exception as e:
        print(f"Error descargando {url}: {e}")

# Guardar la lista de URLs en un archivo
with open('image_urls.txt', 'w', encoding='utf-8') as f:
    for url in img_urls:
        f.write(url + '\n')
print("Lista de URLs guardada en image_urls.txt")
