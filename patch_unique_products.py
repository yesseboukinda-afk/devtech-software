from pathlib import Path
from bs4 import BeautifulSoup
import re

product_mapping = {
    'product-1.png': 'Apple iPad Mini G2356 - Modèle 1',
    'product-2.png': 'Apple iPad Mini G2356 - Modèle 2',
    'product-3.png': 'Apple iPad Mini G2356 - Modèle 3',
    'product-4.png': 'Apple iPad Mini G2356 - Modèle 4',
    'product-5.png': 'Apple iPad Mini G2356 - Modèle 5',
    'product-6.png': 'Apple iPad Mini G2356 - Modèle 6',
    'product-7.png': 'Apple iPad Mini G2356 - Modèle 7',
    'product-8.png': 'Apple iPad Mini G2356 - Modèle 8',
    'product-9.png': 'Apple iPad Mini G2356 - Modèle 9',
    'product-10.png': 'Apple iPad Mini G2356 - Modèle 10',
    'product-11.png': 'Apple iPad Mini G2356 - Modèle 11',
    'product-12.png': 'Apple iPad Mini G2356 - Modèle 12',
    'product-13.png': 'Apple iPad Mini G2356 - Modèle 13',
    'product-14.png': 'Apple iPad Mini G2356 - Modèle 14',
    'product-15.png': 'Apple iPad Mini G2356 - Modèle 15',
    'product-16.png': 'Apple iPad Mini G2356 - Modèle 16',
    'product-17.png': 'Apple iPad Mini G2356 - Modèle 17',
}

html_files = sorted(Path('.').glob('*.html'))
changed_files = []
for path in html_files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    soup = BeautifulSoup(text, 'html.parser')
    changed = False

    head = soup.find('head')
    if head:
        title = head.find('title')
        if title:
            if title.string != 'Red_link shop':
                title.string = 'Red_link shop'
                changed = True
        else:
            new_title = soup.new_tag('title')
            new_title.string = 'Red_link shop'
            head.append(new_title)
            changed = True

    def product_title_from_img(block):
        img = block.find('img')
        if not img or not img.has_attr('src'):
            return None
        filename = Path(img['src']).name
        return product_mapping.get(filename)

    for block in soup.select('.product-item, .products-mini-content, .product-item-inner, .featured-product-item, .related-item, .related-item-inner'):
        product_name = product_title_from_img(block)
        if not product_name:
            continue
        title_el = block.select_one('a.d-block.h4') or block.select_one('a.d-block.text-white.fs-3')
        if title_el and 'Apple iPad Mini' in title_el.get_text():
            title_el.clear()
            title_el.append(product_name)
            changed = True
        add_btn = block.select_one('a.btn, button.btn')
        if add_btn and not add_btn.has_attr('data-product-sku'):
            sku = Path(block.find('img')['src']).name.replace('.', '-').upper()
            add_btn['data-product-sku'] = sku
            add_btn['data-product-name'] = product_name
            changed = True

    for a in soup.find_all('a'):
        if a.string and 'Apple iPad Mini' in a.string:
            if a.get('class') and ('d-block' in a.get('class') or 'text-white' in a.get('class')):
                a.string = 'Apple iPad Mini G2356 - Offre spéciale'
                changed = True

    for text_node in soup.find_all(string=re.compile(r'Apple iPad Mini')):
        if text_node.parent.name == 'a' and text_node.parent.string and 'Apple iPad Mini' in text_node.parent.string:
            continue
        new_text = text_node.replace('Apple iPad Mini', 'Apple iPad Mini G2356')
        if new_text != text_node:
            text_node.replace_with(new_text)
            changed = True

    if changed:
        path.write_text(str(soup), encoding='utf-8')
        changed_files.append(path.name)

print('changed files:', changed_files)

remaining = {}
for path in html_files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    count = text.count('Apple iPad Mini')
    if count:
        remaining[path.name] = count
print('remaining Apple iPad Mini counts:', remaining)
