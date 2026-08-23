/**
 * Monaco spell-check marker utilities.
 *
 * Translates spell-check engine errors (offsets into stripped plain text)
 * back to raw Markdown positions and applies Monaco warning markers.
 *
 * Safety invariant: READ-ONLY with respect to canonical Markdown.
 * Neither `md` state nor the Monaco model value is ever written here.
 */
const OWNER = "kv-spell-check";
/**
 * Translates spell errors (expressed as offsets into `strippedText`) to
 * Monaco IMarkerData positions and applies them to the editor model.
 *
 * Must be called on the main thread after the worker returns.
 */
export function applySpellMarkers(monacoInstance, // window.monaco
editorInstance, // editorRef.current
errors, tokenized) {
    const model = editorInstance?.getModel?.();
    if (!model || !monacoInstance)
        return [];
    const { offsetMap } = tokenized;
    const iMarkers = [];
    const markers = [];
    for (const err of errors) {
        // Translate stripped-text offset → raw Markdown offset via offsetMap.
        const rawStart = offsetMap[err.offset];
        const rawEnd = offsetMap[Math.min(err.offset + err.length - 1, offsetMap.length - 1)];
        if (rawStart === undefined || rawEnd === undefined)
            continue;
        // Monaco uses 1-indexed line/column.
        const startPos = model.getPositionAt(rawStart);
        const endPos = model.getPositionAt(rawEnd + 1);
        if (!startPos || !endPos)
            continue;
        iMarkers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column,
            message: err.message,
            source: "Spell Check",
        });
        markers.push({
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column,
            message: err.message,
            replacements: err.replacements,
            errorId: err.id,
            rawOffset: rawStart,
            rawLength: rawEnd - rawStart + 1,
        });
    }
    monacoInstance.editor.setModelMarkers(model, OWNER, iMarkers);
    return markers;
}
/** Clears all spell-check markers from the model. */
export function clearSpellMarkers(monacoInstance, editorInstance) {
    const model = editorInstance?.getModel?.();
    if (!model || !monacoInstance)
        return;
    monacoInstance.editor.setModelMarkers(model, OWNER, []);
}
