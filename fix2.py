import os
f = 'src/features/grammar-checker/GrammarCheckerClient.tsx'
with open(f, 'r') as file:
    content = file.read()

content = content.replace('value={}Math.ceil(stats.readingTimeMs / 1000 / 60)} min`} />', 'value={`${Math.ceil(stats.readingTimeMs / 1000 / 60)} min`} />')
content = content.replace('className={`text', 'className={`text')
content = content.replace('}`}>', '}`}>')

with open(f, 'w') as file:
    file.write(content)
