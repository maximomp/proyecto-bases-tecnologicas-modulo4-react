from bs4 import BeautifulSoup
import json
import re
import os
import requests
import unicodedata

products = []
img_dir = '../public/static/images/products'
os.makedirs(img_dir, exist_ok=True)

def slugify(value):
    value = str(value)
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^a-zA-Z0-9\-_. ]', '', value)
    value = value.replace(' ', '-')
    value = re.sub(r'-+', '-', value)  # Evita múltiples guiones seguidos
    value = value.strip('-')
    value = value.lower()
    return value[:80]  # Limita la longitud

for page in range(1, 4):
    file_name = f'source{page}.html'
    print(f"Procesando {file_name}")
    with open(file_name, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    grid = soup.find(id="category-list-product-grid")
    if not grid:
        print(f"No se encontró el grid en {file_name}")
        continue
    cards = grid.find_all('a', attrs={'data-testid': 'normal-link'})
    for idx, card in enumerate(cards):
        img_tag = card.select_one('.product-card__img-container img')
        img_url = img_tag['src'] if img_tag else None

        title_tag = card.select_one('.product-card__title')
        title = title_tag.get_text(strip=True) if title_tag else None

        # Genera nombre de archivo a partir del título
        img_filename = None
        if img_url and title:
            safe_title = slugify(title)
            img_filename = os.path.join(img_dir, f'{safe_title}.jpg')
            try:
                response = requests.get(img_url, timeout=10)
                response.raise_for_status()
                with open(img_filename, 'wb') as img_file:
                    img_file.write(response.content)
                print(f"Descargada: {img_filename}")
            except Exception as e:
                print(f"Error descargando {img_url}: {e}")
                img_filename = None

        link_url = card.get('href')

        # Captura precio y precio original
        price_tag = card.select_one('[data-e2e="price-card"]')
        price = None
        if price_tag:
            price = price_tag.get_text(strip=True)
            price = float(price.replace('€','').replace(',','.')) if price else None
        crossed_tag = card.select_one('[data-e2e="crossedPrice"]')
        price_original = None
        if crossed_tag:
            price_original = crossed_tag.get_text(strip=True)
            price_original = float(price_original.replace('.', '').replace('€','').replace(',','.')) if price_original else None

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
            'img_file': img_filename,
            'link_url': link_url,
            'title': title,
            'price': price,
            'price_original': price_original,
            'rating': rating,
            'opinions': opinions,
            'envio': envio
        })

with open('products_web.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)
print(f"Guardados {len(products)} productos en products_web.json y descargadas las imágenes en {img_dir}")
