import { Node } from '@tiptap/core';

export const Table = Node.create({
  name: 'table',
  group: 'block',
  content: 'tableRow+',
  // @ts-expect-error: tableRole is an internal tiptap property
  tableRole: 'table',
  isolating: true,
  renderHTML: ({ HTMLAttributes }) => ['table', { ...HTMLAttributes, class: 'border-collapse border border-border w-full my-4' }, ['tbody', 0]],
});

export const TableRow = Node.create({
  name: 'tableRow',
  content: '(tableCell | tableHeader)*',
  // @ts-expect-error: tableRole is an internal tiptap property
  tableRole: 'row',
  renderHTML: ({ HTMLAttributes }) => ['tr', HTMLAttributes, 0],
});

export const TableHeader = Node.create({
  name: 'tableHeader',
  content: 'inline*',
  // @ts-expect-error: tableRole is an internal tiptap property
  tableRole: 'header_cell',
  isolating: true,
  renderHTML: ({ HTMLAttributes }) => ['th', { ...HTMLAttributes, class: 'border border-border p-2 bg-surface-2 font-bold text-left' }, 0],
});

export const TableCell = Node.create({
  name: 'tableCell',
  content: 'inline*',
  // @ts-expect-error: tableRole is an internal tiptap property
  tableRole: 'cell',
  isolating: true,
  renderHTML: ({ HTMLAttributes }) => ['td', { ...HTMLAttributes, class: 'border border-border p-2 text-left' }, 0],
});

export const TaskList = Node.create({
  name: 'taskList',
  group: 'block list',
  content: 'taskItem+',
  renderHTML: ({ HTMLAttributes }) => ['ul', { ...HTMLAttributes, 'data-type': 'taskList', class: 'list-none pl-0 space-y-1' }, 0],
});

export const TaskItem = Node.create({
  name: 'taskItem',
  content: 'paragraph block*',
  defining: true,
  addAttributes: () => ({
    checked: {
      default: false,
      parseHTML: el => el.getAttribute('data-checked') === 'true',
      renderHTML: attr => ({ 'data-checked': attr.checked }),
    },
  }),
  renderHTML: ({ HTMLAttributes }) => ['li', { ...HTMLAttributes, 'data-type': 'taskItem', class: 'flex items-start gap-2' }, 0],
});

export const Image = Node.create({
  name: 'image',
  group: 'inline',
  inline: true,
  draggable: true,
  addAttributes: () => ({
    src: { default: null },
    alt: { default: null },
    title: { default: null },
  }),
  renderHTML: ({ HTMLAttributes }) => ['img', { ...HTMLAttributes, class: 'rounded-xl max-w-full my-2' }],
});
