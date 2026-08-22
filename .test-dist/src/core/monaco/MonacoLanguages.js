export function configureLanguageDefaults(monacoInstance) {
    // TypeScript / JavaScript Defaults
    monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monacoInstance.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        strict: true,
        esModuleInterop: true,
        jsx: monacoInstance.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
    });
    // HTML Defaults
    monacoInstance.languages.html.htmlDefaults.setOptions({
        format: {
            tabSize: 2,
            insertSpaces: true,
            wrapLineLength: 120,
        },
        suggest: {
            html5: true,
        }
    });
    // CSS Defaults
    monacoInstance.languages.css.cssDefaults.setOptions({
        validate: true,
        lint: {
            compatibleVendorPrefixes: 'warning',
            vendorPrefix: 'warning',
            duplicateProperties: 'warning',
            emptyRules: 'warning',
            importStatement: 'error',
            boxModel: 'ignore',
            universalSelector: 'ignore',
            zeroUnits: 'warning'
        }
    });
}
