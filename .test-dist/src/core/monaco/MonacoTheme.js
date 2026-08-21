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
        }
    });
    // Future-proofing for light theme
    monacoInstance.editor.defineTheme('karuvi-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#FFFFFF',
        }
    });
}
