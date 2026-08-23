/**
 * Monaco spell-check marker utilities.
 *
 * Translates spell-check engine errors (offsets into stripped plain text)
 * back to raw Markdown positions and applies Monaco warning markers.
 *
 * Safety invariant: READ-ONLY with respect to canonical Markdown.
 * Neither `md` state nor the Monaco model value is ever written here.
 */

import { TokenizedMarkdown } from './markdown-spell-tokenizer';

export interface SpellError {
  id: string;
  message: string;
  replacements: string[];
  /** Offset into the strippedPlainText produced by tokenizeMarkdownForSpellCheck. */
  offset: number;
  length: number;
  type: 'spelling' | 'grammar' | 'style' | 'readability';
}

export interface SpellMarker {
  /** 1-indexed, inclusive. */
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  replacements: string[];
  /** Original spell error for hover/action lookup. */
  errorId: string;
  /** Absolute offset in raw Markdown — used for replacement. */
  rawOffset: number;
  rawLength: number;
}

const OWNER = "kv-spell-check";

/**
 * Translates spell errors (expressed as offsets into `strippedText`) to
 * Monaco IMarkerData positions and applies them to the editor model.
 *
 * Must be called on the main thread after the worker returns.
 */
export function applySpellMarkers(
  monacoInstance: any,     // window.monaco
  editorInstance: any,     // editorRef.current
  errors: SpellError[],
  tokenized: TokenizedMarkdown,
): SpellMarker[] {
  const model = editorInstance?.getModel?.();
  if (!model || !monacoInstance) return [];

  const { offsetMap } = tokenized;

  const iMarkers: any[] = [];
  const markers: SpellMarker[] = [];

  for (const err of errors) {
    // Translate stripped-text offset → raw Markdown offset via offsetMap.
    const rawStart = offsetMap[err.offset];
    const rawEnd   = offsetMap[Math.min(err.offset + err.length - 1, offsetMap.length - 1)];

    if (rawStart === undefined || rawEnd === undefined) continue;

    // Monaco uses 1-indexed line/column.
    const startPos = model.getPositionAt(rawStart);
    const endPos   = model.getPositionAt(rawEnd + 1);

    if (!startPos || !endPos) continue;

    iMarkers.push({
      severity: monacoInstance.MarkerSeverity.Warning,
      startLineNumber: startPos.lineNumber,
      startColumn:     startPos.column,
      endLineNumber:   endPos.lineNumber,
      endColumn:       endPos.column,
      message:         err.message,
      source:          "Spell Check",
    });

    markers.push({
      startLineNumber: startPos.lineNumber,
      startColumn:     startPos.column,
      endLineNumber:   endPos.lineNumber,
      endColumn:       endPos.column,
      message:         err.message,
      replacements:    err.replacements,
      errorId:         err.id,
      rawOffset:       rawStart,
      rawLength:       rawEnd - rawStart + 1,
    });
  }

  monacoInstance.editor.setModelMarkers(model, OWNER, iMarkers);
  return markers;
}

/** Clears all spell-check markers from the model. */
export function clearSpellMarkers(monacoInstance: any, editorInstance: any): void {
  const model = editorInstance?.getModel?.();
  if (!model || !monacoInstance) return;
  monacoInstance.editor.setModelMarkers(model, OWNER, []);
}
