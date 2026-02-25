import os

path = r'd:\Dropbox\Project\UX UI Thermal\Layouts\ifs_trambienap\html'
target = 'IFS - TRẠM BIẾN ÁP'
replacement = 'IFS - AI'

for filename in os.listdir(path):
    if filename.endswith('.html'):
        filepath = os.path.join(path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if target in content:
            new_content = content.replace(target, replacement)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated: {filename}')
