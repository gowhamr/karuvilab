/**
 * Checks if the current selection is inside a table.
 */
export function isCursorInTable(editor) {
    if (!editor || editor.isDestroyed)
        return false;
    const { state } = editor;
    const { $from } = state.selection;
    for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type.name === 'table') {
            return true;
        }
    }
    return false;
}
/**
 * Inserts a new 3x3 table with headers into the document.
 */
export function insertTable(editor) {
    if (!editor || editor.isDestroyed)
        return false;
    return editor
        .chain()
        .focus()
        .insertContent([
        {
            type: 'table',
            content: [
                {
                    type: 'tableRow',
                    content: [
                        { type: 'tableHeader', content: [{ type: 'text', text: 'Header 1' }] },
                        { type: 'tableHeader', content: [{ type: 'text', text: 'Header 2' }] },
                        { type: 'tableHeader', content: [{ type: 'text', text: 'Header 3' }] },
                    ],
                },
                {
                    type: 'tableRow',
                    content: [
                        { type: 'tableCell', content: [{ type: 'text', text: 'Cell 1' }] },
                        { type: 'tableCell', content: [{ type: 'text', text: 'Cell 2' }] },
                        { type: 'tableCell', content: [{ type: 'text', text: 'Cell 3' }] },
                    ],
                },
                {
                    type: 'tableRow',
                    content: [
                        { type: 'tableCell', content: [{ type: 'text', text: 'Cell 4' }] },
                        { type: 'tableCell', content: [{ type: 'text', text: 'Cell 5' }] },
                        { type: 'tableCell', content: [{ type: 'text', text: 'Cell 6' }] },
                    ],
                },
            ],
        },
        { type: 'paragraph' },
    ])
        .run();
}
/**
 * Adds a new row below or above the current active row.
 */
export function addRow(editor, position = 'below') {
    if (!editor || editor.isDestroyed)
        return false;
    const { state, view } = editor;
    const { $from } = state.selection;
    let tableDepth = -1;
    let rowDepth = -1;
    for (let d = $from.depth; d > 0; d--) {
        const node = $from.node(d);
        if (node.type.name === 'tableRow' && rowDepth === -1) {
            rowDepth = d;
        }
        if (node.type.name === 'table' && tableDepth === -1) {
            tableDepth = d;
        }
    }
    if (tableDepth === -1 || rowDepth === -1)
        return false;
    const { tableCell, tableRow } = state.schema.nodes;
    if (!tableCell || !tableRow)
        return false;
    const currentRowNode = $from.node(rowDepth);
    const cellCount = currentRowNode.childCount;
    const cells = [];
    for (let i = 0; i < cellCount; i++) {
        cells.push(tableCell.create(null, state.schema.text(' ')));
    }
    const newRow = tableRow.create(null, cells);
    const rowPos = position === 'below' ? $from.after(rowDepth) : $from.before(rowDepth);
    const tr = state.tr.insert(rowPos, newRow);
    view.dispatch(tr);
    return true;
}
/**
 * Deletes the current active row.
 */
export function deleteRow(editor) {
    if (!editor || editor.isDestroyed)
        return false;
    const { state, view } = editor;
    const { $from } = state.selection;
    let tableDepth = -1;
    let rowDepth = -1;
    for (let d = $from.depth; d > 0; d--) {
        const node = $from.node(d);
        if (node.type.name === 'tableRow' && rowDepth === -1) {
            rowDepth = d;
        }
        if (node.type.name === 'table' && tableDepth === -1) {
            tableDepth = d;
        }
    }
    if (tableDepth === -1 || rowDepth === -1)
        return false;
    const tableNode = $from.node(tableDepth);
    if (tableNode.childCount <= 1) {
        return deleteTable(editor);
    }
    const rowStart = $from.before(rowDepth);
    const rowEnd = $from.after(rowDepth);
    const tr = state.tr.delete(rowStart, rowEnd);
    view.dispatch(tr);
    return true;
}
/**
 * Adds a new column right or left of the current active column.
 */
export function addColumn(editor, position = 'right') {
    if (!editor || editor.isDestroyed)
        return false;
    const { state, view } = editor;
    const { $from } = state.selection;
    let tableDepth = -1;
    let rowDepth = -1;
    let cellDepth = -1;
    for (let d = $from.depth; d > 0; d--) {
        const node = $from.node(d);
        if ((node.type.name === 'tableCell' || node.type.name === 'tableHeader') && cellDepth === -1) {
            cellDepth = d;
        }
        if (node.type.name === 'tableRow' && rowDepth === -1) {
            rowDepth = d;
        }
        if (node.type.name === 'table' && tableDepth === -1) {
            tableDepth = d;
        }
    }
    if (tableDepth === -1 || rowDepth === -1 || cellDepth === -1)
        return false;
    const { tableCell, tableHeader } = state.schema.nodes;
    if (!tableCell || !tableHeader)
        return false;
    const colIndex = $from.index(rowDepth);
    const insertIndex = position === 'right' ? colIndex + 1 : colIndex;
    const tablePos = $from.before(tableDepth);
    const tableNode = $from.node(tableDepth);
    let tr = state.tr;
    let offset = tablePos + 1;
    for (let r = 0; r < tableNode.childCount; r++) {
        const row = tableNode.child(r);
        let cellOffset = offset + 1;
        for (let c = 0; c < insertIndex && c < row.childCount; c++) {
            cellOffset += row.child(c).nodeSize;
        }
        const isHeaderRow = r === 0 && row.child(0).type.name === 'tableHeader';
        const newCell = isHeaderRow
            ? tableHeader.create(null, state.schema.text('Header'))
            : tableCell.create(null, state.schema.text(' '));
        tr = tr.insert(cellOffset, newCell);
        offset += row.nodeSize + newCell.nodeSize;
    }
    view.dispatch(tr);
    return true;
}
/**
 * Deletes the current active column.
 */
export function deleteColumn(editor) {
    if (!editor || editor.isDestroyed)
        return false;
    const { state, view } = editor;
    const { $from } = state.selection;
    let tableDepth = -1;
    let rowDepth = -1;
    let cellDepth = -1;
    for (let d = $from.depth; d > 0; d--) {
        const node = $from.node(d);
        if ((node.type.name === 'tableCell' || node.type.name === 'tableHeader') && cellDepth === -1) {
            cellDepth = d;
        }
        if (node.type.name === 'tableRow' && rowDepth === -1) {
            rowDepth = d;
        }
        if (node.type.name === 'table' && tableDepth === -1) {
            tableDepth = d;
        }
    }
    if (tableDepth === -1 || rowDepth === -1 || cellDepth === -1)
        return false;
    const currentRow = $from.node(rowDepth);
    if (currentRow.childCount <= 1) {
        return deleteTable(editor);
    }
    const colIndex = $from.index(rowDepth);
    const tablePos = $from.before(tableDepth);
    const tableNode = $from.node(tableDepth);
    let tr = state.tr;
    const rowPositions = [];
    let offset = tablePos + 1;
    for (let r = 0; r < tableNode.childCount; r++) {
        const row = tableNode.child(r);
        let cellOffset = offset + 1;
        for (let c = 0; c < colIndex && c < row.childCount; c++) {
            cellOffset += row.child(c).nodeSize;
        }
        if (colIndex < row.childCount) {
            const targetCell = row.child(colIndex);
            rowPositions.push({
                start: offset,
                cellStart: cellOffset,
                cellEnd: cellOffset + targetCell.nodeSize,
            });
        }
        offset += row.nodeSize;
    }
    for (let i = rowPositions.length - 1; i >= 0; i--) {
        const item = rowPositions[i];
        if (item) {
            tr = tr.delete(item.cellStart, item.cellEnd);
        }
    }
    view.dispatch(tr);
    return true;
}
/**
 * Deletes the entire active table.
 */
export function deleteTable(editor) {
    if (!editor || editor.isDestroyed)
        return false;
    const { state, view } = editor;
    const { $from } = state.selection;
    let tableDepth = -1;
    for (let d = $from.depth; d > 0; d--) {
        if ($from.node(d).type.name === 'table') {
            tableDepth = d;
            break;
        }
    }
    if (tableDepth === -1)
        return false;
    const tableStart = $from.before(tableDepth);
    const tableEnd = $from.after(tableDepth);
    const tr = state.tr.delete(tableStart, tableEnd);
    view.dispatch(tr);
    return true;
}
