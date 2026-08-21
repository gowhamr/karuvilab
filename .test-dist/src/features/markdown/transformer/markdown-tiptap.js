import { marked } from 'marked';
function parseInline(tokens = [], marks = []) {
    const nodes = [];
    for (const token of tokens) {
        if (!token)
            continue;
        if (token.type === 'text' || token.type === 'escape') {
            const text = typeof token.raw === 'string' ? token.raw : (typeof token.text === 'string' ? token.text : '');
            nodes.push({ type: 'text', text, marks: marks.length > 0 ? marks : undefined });
        }
        else if (token.type === 'strong') {
            nodes.push(...parseInline(token.tokens, [...marks, { type: 'bold' }]));
        }
        else if (token.type === 'em') {
            nodes.push(...parseInline(token.tokens, [...marks, { type: 'italic' }]));
        }
        else if (token.type === 'del') {
            nodes.push(...parseInline(token.tokens, [...marks, { type: 'strike' }]));
        }
        else if (token.type === 'codespan') {
            const text = typeof token.text === 'string' ? token.text : '';
            nodes.push({ type: 'text', text, marks: [...marks, { type: 'code' }] });
        }
        else if (token.type === 'link') {
            const linkMarks = [...marks, { type: 'link', attrs: { href: token.href, title: token.title || null } }];
            nodes.push(...parseInline(token.tokens, linkMarks));
        }
        else if (token.type === 'image') {
            nodes.push({
                type: 'image',
                attrs: { src: token.href, alt: token.text || '', title: token.title || null }
            });
        }
        else if (token.type === 'html') {
            const text = typeof token.text === 'string' ? token.text : '';
            nodes.push({ type: 'text', text, marks: marks.length > 0 ? marks : undefined });
        }
        else if (token.type === 'br') {
            nodes.push({ type: 'hardBreak' });
        }
        else {
            if (Array.isArray(token.tokens)) {
                nodes.push(...parseInline(token.tokens, marks));
            }
            else if (typeof token.text === 'string') {
                nodes.push({ type: 'text', text: token.text, marks: marks.length > 0 ? marks : undefined });
            }
        }
    }
    // Merge consecutive text nodes with same marks
    const merged = [];
    for (const node of nodes) {
        const last = merged[merged.length - 1];
        if (last &&
            last.type === 'text' &&
            node.type === 'text' &&
            typeof last.text === 'string' &&
            typeof node.text === 'string' &&
            JSON.stringify(last.marks || []) === JSON.stringify(node.marks || [])) {
            last.text += node.text;
        }
        else {
            merged.push(node);
        }
    }
    return merged;
}
function parseTokens(tokens) {
    const content = [];
    for (const token of tokens) {
        if (!token)
            continue;
        try {
            if (token.type === 'paragraph') {
                content.push({
                    type: 'paragraph',
                    content: parseInline(token.tokens)
                });
            }
            else if (token.type === 'heading') {
                content.push({
                    type: 'heading',
                    attrs: { level: token.depth || 1 },
                    content: parseInline(token.tokens)
                });
            }
            else if (token.type === 'list') {
                const listType = token.ordered ? 'orderedList' : 'bulletList';
                const isTask = Array.isArray(token.items) && token.items.some((item) => item && item.task);
                const actualType = isTask ? 'taskList' : listType;
                const attrs = {};
                if (token.ordered)
                    attrs.start = token.start || 1;
                const listContent = Array.isArray(token.items)
                    ? token.items.map((item) => {
                        const itemType = isTask ? 'taskItem' : 'listItem';
                        const itemAttrs = {};
                        if (isTask)
                            itemAttrs.checked = Boolean(item.checked);
                        return {
                            type: itemType,
                            attrs: isTask ? itemAttrs : undefined,
                            content: Array.isArray(item.tokens) ? parseTokens(item.tokens) : []
                        };
                    })
                    : [];
                content.push({
                    type: actualType,
                    attrs: Object.keys(attrs).length > 0 ? attrs : undefined,
                    content: listContent
                });
            }
            else if (token.type === 'blockquote') {
                content.push({
                    type: 'blockquote',
                    content: Array.isArray(token.tokens) ? parseTokens(token.tokens) : []
                });
            }
            else if (token.type === 'code') {
                content.push({
                    type: 'codeBlock',
                    attrs: { language: token.lang || null },
                    content: token.text ? [{ type: 'text', text: token.text }] : []
                });
            }
            else if (token.type === 'table') {
                const headerCells = Array.isArray(token.header)
                    ? token.header.map((cell) => ({
                        type: 'tableHeader',
                        content: parseInline(cell.tokens || (cell.text ? [{ type: 'text', text: cell.text }] : []))
                    }))
                    : [];
                const rows = [];
                if (headerCells.length > 0) {
                    rows.push({
                        type: 'tableRow',
                        content: headerCells
                    });
                }
                if (Array.isArray(token.rows)) {
                    for (const row of token.rows) {
                        if (!Array.isArray(row))
                            continue;
                        rows.push({
                            type: 'tableRow',
                            content: row.map((cell) => ({
                                type: 'tableCell',
                                content: parseInline(cell.tokens || (cell.text ? [{ type: 'text', text: cell.text }] : []))
                            }))
                        });
                    }
                }
                content.push({
                    type: 'table',
                    content: rows
                });
            }
            else if (token.type === 'hr') {
                content.push({ type: 'horizontalRule' });
            }
            else if (token.type === 'text') {
                content.push({
                    type: 'paragraph',
                    content: parseInline(token.tokens || [{ type: 'text', text: token.text, raw: token.raw }])
                });
            }
            else if (token.type === 'html') {
                content.push({
                    type: 'paragraph',
                    content: [{ type: 'text', text: typeof token.text === 'string' ? token.text : '' }]
                });
            }
            else if (token.type === 'space') {
                // ignore
            }
        }
        catch {
            // ignore malformed tokens safely
        }
    }
    return content;
}
export function markdownToTipTap(markdown) {
    if (!markdown || !markdown.trim()) {
        return { type: 'doc', content: [{ type: 'paragraph' }] };
    }
    try {
        const tokens = marked.lexer(markdown);
        const content = parseTokens(tokens);
        return { type: 'doc', content: content.length > 0 ? content : [{ type: 'paragraph' }] };
    }
    catch {
        return { type: 'doc', content: [{ type: 'paragraph' }] };
    }
}
function serializeInline(nodes = []) {
    let result = '';
    for (const node of nodes) {
        if (!node)
            continue;
        if (node.type === 'text') {
            let text = node.text || '';
            let isBold = false, isItalic = false, isStrike = false, isCode = false;
            let linkHref = '', linkTitle = '';
            if (Array.isArray(node.marks)) {
                for (const mark of node.marks) {
                    if (!mark)
                        continue;
                    if (mark.type === 'bold')
                        isBold = true;
                    if (mark.type === 'italic')
                        isItalic = true;
                    if (mark.type === 'strike')
                        isStrike = true;
                    if (mark.type === 'code')
                        isCode = true;
                    if (mark.type === 'link' && mark.attrs) {
                        linkHref = typeof mark.attrs.href === 'string' ? mark.attrs.href : '';
                        linkTitle = typeof mark.attrs.title === 'string' ? mark.attrs.title : '';
                    }
                }
            }
            if (isCode) {
                text = `\`${text}\``;
            }
            else {
                if (isBold)
                    text = `**${text}**`;
                if (isItalic)
                    text = `*${text}*`;
                if (isStrike)
                    text = `~~${text}~~`;
            }
            if (linkHref) {
                text = `[${text}](${linkHref}${linkTitle ? ` "${linkTitle}"` : ''})`;
            }
            result += text;
        }
        else if (node.type === 'image') {
            const src = (node.attrs && typeof node.attrs.src === 'string') ? node.attrs.src : '';
            const alt = (node.attrs && typeof node.attrs.alt === 'string') ? node.attrs.alt : '';
            const title = (node.attrs && typeof node.attrs.title === 'string') ? node.attrs.title : '';
            result += `![${alt}](${src}${title ? ` "${title}"` : ''})`;
        }
        else if (node.type === 'hardBreak') {
            result += '<br/>\n';
        }
    }
    return result;
}
function serializeNode(node, indent = '') {
    if (!node)
        return '';
    if (node.type === 'paragraph') {
        return indent + serializeInline(node.content) + '\n\n';
    }
    else if (node.type === 'heading') {
        const level = (node.attrs && typeof node.attrs.level === 'number') ? node.attrs.level : 1;
        const prefix = '#'.repeat(level);
        return `${indent}${prefix} ${serializeInline(node.content)}\n\n`;
    }
    else if (node.type === 'blockquote') {
        let result = '';
        const lines = (node.content || []).map(n => serializeNode(n, '').trim());
        for (const line of lines) {
            if (line) {
                result += line.split('\n').map(l => `${indent}> ${l}`).join('\n') + '\n';
            }
        }
        return result + '\n';
    }
    else if (node.type === 'codeBlock') {
        const lang = (node.attrs && typeof node.attrs.language === 'string') ? node.attrs.language : '';
        const code = node.content && node.content[0] ? (node.content[0].text || '') : '';
        return `${indent}\`\`\`${lang}\n${code}\n${indent}\`\`\`\n\n`;
    }
    else if (node.type === 'horizontalRule') {
        return indent + '---\n\n';
    }
    else if (node.type === 'bulletList' || node.type === 'taskList') {
        let result = '';
        const items = node.content || [];
        for (const item of items) {
            if (!item)
                continue;
            const isTask = item.type === 'taskItem';
            const checked = (item.attrs && item.attrs.checked) ? '[x]' : '[ ]';
            const prefix = isTask ? `- ${checked} ` : '- ';
            if (item.content && item.content.length > 0) {
                const firstChild = item.content[0];
                const firstText = firstChild?.type === 'paragraph'
                    ? serializeInline(firstChild.content)
                    : serializeNode(firstChild, '').trim();
                result += `${indent}${prefix}${firstText}\n`;
                for (let i = 1; i < item.content.length; i++) {
                    const childNode = item.content[i];
                    if (childNode) {
                        result += serializeNode(childNode, indent + '  ');
                    }
                }
            }
        }
        return result + (indent === '' ? '\n' : '');
    }
    else if (node.type === 'orderedList') {
        let result = '';
        const items = node.content || [];
        let start = (node.attrs && typeof node.attrs.start === 'number') ? node.attrs.start : 1;
        for (const item of items) {
            if (!item)
                continue;
            const prefix = `${start++}. `;
            if (item.content && item.content.length > 0) {
                const firstChild = item.content[0];
                const firstText = firstChild?.type === 'paragraph'
                    ? serializeInline(firstChild.content)
                    : serializeNode(firstChild, '').trim();
                result += `${indent}${prefix}${firstText}\n`;
                for (let i = 1; i < item.content.length; i++) {
                    const childNode = item.content[i];
                    if (childNode) {
                        result += serializeNode(childNode, indent + '   ');
                    }
                }
            }
        }
        return result + (indent === '' ? '\n' : '');
    }
    else if (node.type === 'table') {
        let result = '';
        const rows = node.content || [];
        if (rows.length > 0 && rows[0]) {
            const headerRow = rows[0];
            const headerCells = headerRow.content || [];
            result += indent + '| ' + headerCells.map(c => serializeInline(c.content)).join(' | ') + ' |\n';
            result += indent + '|' + headerCells.map(() => '---').join('|') + '|\n';
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row)
                    continue;
                const cells = row.content || [];
                result += indent + '| ' + cells.map(c => serializeInline(c.content)).join(' | ') + ' |\n';
            }
        }
        return result + '\n';
    }
    return '';
}
export function tipTapToMarkdown(doc) {
    if (!doc || !doc.content || doc.content.length === 0)
        return '';
    let result = '';
    for (const node of doc.content) {
        result += serializeNode(node);
    }
    return result.trim() + '\n';
}
