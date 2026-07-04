import re
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()
with open('works.html', 'r', encoding='utf-8') as f:
    works_html = f.read()
header_end_idx = index_html.find('<div id="scroller">')
index_head = index_html[:header_end_idx]
scroller_idx = works_html.find('<div id="scroller">')
works_body = works_html[scroller_idx:]
new_works = index_head + works_body
new_works = new_works.replace('<title>Abuzar Javed - Premium Video Editor & Motion Designer</title>', '<title>The Gallery - Abuzar Javed Selected Works</title>')
new_works = new_works.replace('<meta name="title" content="Abuzar Javed - Senior Video Editor & Motion Designer" />', '<meta name="title" content="The Gallery - Abuzar Javed Selected Works" />')
with open('works.html', 'w', encoding='utf-8') as f:
    f.write(new_works)
