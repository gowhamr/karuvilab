/**
 * Define KaruviLab Design System themes for Monaco Editor.
 * This ensures visual consistency with the rest of the application.
 */
export function defineMonacoThemes(monacoInstance) {
    monacoInstance.editor.defineTheme('karuvi-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
            { token: 'keyword', foreground: '818CF8' }, // Indigo-400
            { token: 'string', foreground: '34D399' }, // Emerald-400
            { token: 'number', foreground: 'F472B6' }, // Pink-400
            { token: 'type', foreground: '38BDF8' }, // Sky-400
            { token: 'class', foreground: '38BDF8' },
            { token: 'function', foreground: 'A78BFA' }, // Violet-400
            { token: 'variable', foreground: 'F8FAFC' }, // Slate-50
            { token: 'header', foreground: '818CF8', fontStyle: 'bold' },
            { token: 'strong', foreground: 'F8FAFC', fontStyle: 'bold' },
            { token: 'emphasis', foreground: 'CBD5E1', fontStyle: 'italic' },
            { token: 'tag', foreground: '60A5FA' },
        ],
        colors: {
            'editor.background': '#0F172A', // --kv-mat-surface / slate-900
            'editor.foreground': '#F8FAFC', // slate-50
            'editor.lineHighlightBackground': '#1E293B80', // slate-800 with opacity
            'editorLineNumber.foreground': '#475569', // slate-600
            'editorLineNumber.activeForeground': '#94A3B8', // slate-400
            'editorIndentGuide.background': '#1E293B',
            'editorIndentGuide.activeBackground': '#334155',
            'editorSuggestWidget.background': '#1E293B', // elevated surface
            'editorSuggestWidget.border': '#334155',
            'editorSuggestWidget.foreground': '#F1F5F9',
            'editorSuggestWidget.selectedBackground': '#3B82F640',
            'editorSuggestWidget.highlightForeground': '#818CF8',
            'editor.selectionBackground': '#3B82F640',
            'editor.inactiveSelectionBackground': '#3B82F620',
            'editorGutter.background': '#0F172A',
        }
    });
    monacoInstance.editor.defineTheme('karuvi-light', {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
            { token: 'keyword', foreground: '4F46E5' }, // Indigo-600
            { token: 'string', foreground: '059669' }, // Emerald-600
            { token: 'number', foreground: 'DB2777' }, // Pink-600
            { token: 'type', foreground: '0284C7' }, // Sky-600
            { token: 'class', foreground: '0284C7' },
            { token: 'function', foreground: '7C3AED' }, // Violet-600
            { token: 'variable', foreground: '0F172A' }, // Slate-900
            { token: 'header', foreground: '4F46E5', fontStyle: 'bold' },
            { token: 'strong', foreground: '0F172A', fontStyle: 'bold' },
            { token: 'emphasis', foreground: '334155', fontStyle: 'italic' },
            { token: 'tag', foreground: '2563EB' },
        ],
        colors: {
            'editor.background': '#FFFFFF',
            'editor.foreground': '#0F172A',
            'editor.lineHighlightBackground': '#F8FAFC',
            'editorLineNumber.foreground': '#94A3B8',
            'editorLineNumber.activeForeground': '#334155',
            'editorIndentGuide.background': '#E2E8F0',
            'editorIndentGuide.activeBackground': '#CBD5E1',
            'editorSuggestWidget.background': '#FFFFFF',
            'editorSuggestWidget.border': '#E2E8F0',
            'editorSuggestWidget.foreground': '#0F172A',
            'editorSuggestWidget.selectedBackground': '#3B82F620',
            'editorSuggestWidget.highlightForeground': '#4F46E5',
            'editor.selectionBackground': '#3B82F625',
            'editor.inactiveSelectionBackground': '#3B82F615',
            'editorGutter.background': '#FFFFFF',
            'editorWidget.background': '#FFFFFF',
            'editorWidget.border': '#E2E8F0',
        }
    });
}
