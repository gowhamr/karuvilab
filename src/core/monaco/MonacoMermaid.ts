import { type Monaco } from '@monaco-editor/react';

export function configureMermaidLanguage(monaco: Monaco) {
  // Register a new language
  monaco.languages.register({ id: 'mermaid' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('mermaid', {
    defaultToken: '',
    tokenPostfix: '.mermaid',

    keywords: [
      'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram-v2', 'stateDiagram',
      'erDiagram', 'journey', 'gantt', 'pie', 'requirementDiagram', 'gitGraph',
      'mindmap', 'timeline', 'sankey', 'xychart', 'block', 'packet', 'kanban',
      'architecture', 'radar', 'treemap', 'venn', 'ishikawa', 'wardley', 'cynefin',
      'treeview'
    ],

    tokenizer: {
      root: [
        [/[a-zA-Z_$][\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
        [/\[(.*?)\]/, 'string'],
        [/\((.*?)\)/, 'string'],
        [/\{(.*?)\}/, 'string'],
        [/>(.*?)</, 'string'],
        [/%%.*/, 'comment'],
        [/[{}()\[\]]/, '@brackets'],
        [/[-=.:>]+/, 'operator'],
      ]
    }
  });

  // Basic language configuration
  monaco.languages.setLanguageConfiguration('mermaid', {
    comments: {
      lineComment: '%%',
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' }
    ]
  });
}
