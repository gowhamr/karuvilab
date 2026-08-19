import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  SquareCode,
  Minus,
  ListTodo,
  Table as TableIcon,
  Link as LinkIcon,
  Trash2,
  Rows2,
  Columns2,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  Plus
} from "lucide-react";
import { markdownToTipTap, tipTapToMarkdown } from "../transformer/markdown-tiptap";
import { MarkdownService } from "../MarkdownService";
import { Table, TableRow, TableHeader, TableCell, TaskList, TaskItem, Image } from "../extensions";
import {
  isCursorInTable,
  insertTable,
  addRow,
  deleteRow,
  addColumn,
  deleteColumn,
  deleteTable
} from "../utils/table-commands";

export interface MarkdownVisualEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  fontSize?: number;
}

export function MarkdownVisualEditor({
  markdown,
  onChange,
  fontSize = 14,
}: MarkdownVisualEditorProps) {
  const lastEmittedRef = useRef(markdown);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [inTable, setInTable] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
      }),
      Placeholder.configure({
        placeholder: "Start typing your markdown visually...",
      }),
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem,
      Image
    ],
    content: markdownToTipTap(markdown) as any,
    onSelectionUpdate: ({ editor }) => {
      setInTable(isCursorInTable(editor));
    },
    onUpdate: ({ editor }) => {
      setInTable(isCursorInTable(editor));
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        const json = editor.getJSON();
        const newMarkdown = tipTapToMarkdown(json);
        lastEmittedRef.current = newMarkdown;
        onChange(newMarkdown);
      }, 150);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-full p-4 md:p-6 text-text max-w-none"
      }
    }
  });

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // If editor is actively focused or document is already synchronized, skip updating
    if (!editor || editor.isDestroyed || editor.isFocused) {
      return;
    }
    if (lastEmittedRef.current === markdown) {
      return;
    }

    lastEmittedRef.current = markdown;

    let active = true;
    MarkdownService.parseToTipTap(markdown).then(doc => {
      if (active && editor && !editor.isDestroyed && !editor.isFocused) {
        editor.commands.setContent(doc, { emitUpdate: false });
      }
    });

    return () => {
      active = false;
    };
  }, [markdown, editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    label,
    children,
    danger = false,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    label: string;
    children: React.ReactNode;
    danger?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      onMouseEnter={() => setHoveredLabel(label)}
      onMouseLeave={() => setHoveredLabel(null)}
      onFocus={() => setHoveredLabel(label)}
      onBlur={() => setHoveredLabel(null)}
      className={`group relative p-2 rounded-xl border transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-blue active:scale-95 flex items-center justify-center shrink-0 ${
        danger
          ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-xs"
          : isActive
          ? "bg-blue text-white border-blue shadow-xs"
          : "bg-surface border-border text-text-3 hover:border-blue/50 hover:text-blue hover:bg-blue/5"
      } ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Primary Formatting Toolbar */}
      <div className="flex items-center justify-between p-2.5 border-b border-border bg-surface/50 overflow-x-auto shrink-0 gap-1.5 scrollbar-thin">
        <div className="flex items-center gap-1.5 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            label="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            label="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-border mx-1 shrink-0" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph") && !editor.isActive("heading")}
            label="Normal Text"
          >
            <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">P</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            label="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            label="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            label="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-border mx-1 shrink-0" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            label="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            label="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            label="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            label="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Enter URL");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              } else if (url === "") {
                editor.chain().focus().unsetLink().run();
              }
            }}
            isActive={editor.isActive("link")}
            label="Insert / Edit Link"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-border mx-1 shrink-0" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            label="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor.chain().focus().insertContent([
                {
                  type: 'taskList',
                  content: [
                    { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Task item' }] }] }
                  ]
                },
                { type: 'paragraph' }
              ]).run();
            }}
            isActive={editor.isActive("taskList")}
            label="Task List"
          >
            <ListTodo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            label="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            label="Code Block"
          >
            <SquareCode className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              insertTable(editor);
            }}
            isActive={editor.isActive("table") || inTable}
            label="Insert Table (3×3)"
          >
            <TableIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            label="Horizontal Rule"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Dynamic Tooltip Label Indicator */}
        <div className="hidden lg:flex items-center px-2 py-0.5 text-tiny font-bold text-text-muted bg-surface/80 rounded-md border border-border/50 shrink-0 h-7 transition-opacity">
          {hoveredLabel || (inTable ? "Table Active" : "WYSIWYG Mode")}
        </div>
      </div>

      {/* Contextual Table Control Strip (Visible when editing inside a Table) */}
      {inTable && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-blue/5 border-b border-blue/20 overflow-x-auto shrink-0 text-xs animate-fadeIn">
          <span className="font-bold text-blue flex items-center gap-1 mr-1.5 shrink-0">
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table:</span>
          </span>

          <div className="flex items-center gap-1 shrink-0">
            {/* Row Controls */}
            <button
              onClick={() => addRow(editor, 'below')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border text-text hover:border-blue hover:text-blue transition-all active:scale-95 text-xs font-semibold cursor-pointer"
              title="Add Row Below"
              aria-label="Add Row Below"
            >
              <Rows2 className="w-3.5 h-3.5 text-blue" />
              <Plus className="w-3 h-3" />
              <ArrowDown className="w-3 h-3" />
              <span className="hidden sm:inline">Row Below</span>
            </button>

            <button
              onClick={() => addRow(editor, 'above')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border text-text hover:border-blue hover:text-blue transition-all active:scale-95 text-xs font-semibold cursor-pointer"
              title="Add Row Above"
              aria-label="Add Row Above"
            >
              <Rows2 className="w-3.5 h-3.5 text-blue" />
              <Plus className="w-3 h-3" />
              <ArrowUp className="w-3 h-3" />
              <span className="hidden sm:inline">Row Above</span>
            </button>

            <button
              onClick={() => deleteRow(editor)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border text-text-muted hover:border-red-500 hover:text-red-400 transition-all active:scale-95 text-xs font-semibold cursor-pointer"
              title="Delete Current Row"
              aria-label="Delete Current Row"
            >
              <Rows2 className="w-3.5 h-3.5 text-red-400" />
              <Minus className="w-3 h-3" />
              <span className="hidden sm:inline">Row</span>
            </button>

            <div className="w-px h-4 bg-border mx-1 shrink-0" />

            {/* Column Controls */}
            <button
              onClick={() => addColumn(editor, 'right')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border text-text hover:border-blue hover:text-blue transition-all active:scale-95 text-xs font-semibold cursor-pointer"
              title="Add Column Right"
              aria-label="Add Column Right"
            >
              <Columns2 className="w-3.5 h-3.5 text-blue" />
              <Plus className="w-3 h-3" />
              <ArrowRight className="w-3 h-3" />
              <span className="hidden sm:inline">Col Right</span>
            </button>

            <button
              onClick={() => addColumn(editor, 'left')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border text-text hover:border-blue hover:text-blue transition-all active:scale-95 text-xs font-semibold cursor-pointer"
              title="Add Column Left"
              aria-label="Add Column Left"
            >
              <Columns2 className="w-3.5 h-3.5 text-blue" />
              <Plus className="w-3 h-3" />
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Col Left</span>
            </button>

            <button
              onClick={() => deleteColumn(editor)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border text-text-muted hover:border-red-500 hover:text-red-400 transition-all active:scale-95 text-xs font-semibold cursor-pointer"
              title="Delete Current Column"
              aria-label="Delete Current Column"
            >
              <Columns2 className="w-3.5 h-3.5 text-red-400" />
              <Minus className="w-3 h-3" />
              <span className="hidden sm:inline">Col</span>
            </button>

            <div className="w-px h-4 bg-border mx-1 shrink-0" />

            {/* Delete Table Control */}
            <button
              onClick={() => {
                deleteTable(editor);
                setInTable(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95 text-xs font-semibold cursor-pointer"
              title="Delete Entire Table"
              aria-label="Delete Entire Table"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Table</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor Surface */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-transparent" style={{ fontSize: `${fontSize}px` }}>
        <EditorContent editor={editor} className="min-h-full outline-none" />
      </div>
    </div>
  );
}

