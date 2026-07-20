import os
f = 'src/features/grammar-checker/GrammarCheckerClient.tsx'
with open(f, 'r') as file:
    content = file.read()

content = content.replace('value={\\`\\${', 'value={`${')
content = content.replace('} min\\`} />', '} min`} />')
content = content.replace('className={\\`text', 'className={`text')
content = content.replace('}\\`}>', '}`}>')

with open(f, 'w') as file:
    file.write(content)

f2 = 'src/features/grammar-checker/utils/engine.ts'
with open(f2, 'r') as file:
    content2 = file.read()

content2 = content2.replace('id: \\`spell-\\${match.index}\\`,', 'id: `spell-${match.index}`,')
content2 = content2.replace('message: \\`Possible spelling mistake: "${word}"\\`,', 'message: `Possible spelling mistake: "${word}"`,')

with open(f2, 'w') as file:
    file.write(content2)
