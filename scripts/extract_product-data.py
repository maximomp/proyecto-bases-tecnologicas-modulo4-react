from bs4 import BeautifulSoup
import json
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

soup = BeautifulSoup(html, 'html.parser')
cards = soup.find_all('a', attrs={'data-testid': 'normal-link'})

products = []
for card in cards:
    img_tag = card.select_one('.product-card__img-container img')
    img_url = img_tag['src'] if img_tag else None

    link_url = card.get('href')
    title_tag = card.select_one('.product-card__title')
    title = title_tag.get_text(strip=True) if title_tag else None

    # Mejor extracción de rating y opiniones
    rating_container = card.select_one('.product-card__rating-container')
    rating = None
    opinions = None
    if rating_container:
        spans = rating_container.find_all('span')
        for span in spans:
            text = span.get_text(strip=True)
            if '/5' in text:
                rating = text
            elif 'opiniones' in text:
                match = re.search(r'(\d+)', text)
                if match:
                    opinions = int(match.group(1))

    envio_tag = card.select_one('.product-card__delivery-block')
    envio = envio_tag.get_text(strip=True) if envio_tag else None

    products.append({
        'img_url': img_url,
        'link_url': link_url,
        'title': title,
        'rating': rating,
        'opinions': opinions,
        'envio': envio
    })

with open('products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Encontradas {len(products)} imágenes.")

# Descargar cada imagen
for idx, product in enumerate(products):
    url = product['img_url']
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
    for product in products:
        f.write(product['img_url'] + '\n')
print("Lista de URLs guardada en image_urls.txt")
