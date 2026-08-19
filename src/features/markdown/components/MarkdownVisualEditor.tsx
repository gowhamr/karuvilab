import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
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
  Link as LinkIcon
} from "lucide-react";
import { markdownToTipTap, tipTapToMarkdown } from "../transformer/markdown-tiptap";
import { Table, TableRow, TableHeader, TableCell, TaskList, TaskItem, Image } from "../extensions";

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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing your markdown visually...",
      }),
      Link.configure({ openOnClick: false }),
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem,
      Image
    ],
    content: markdownToTipTap(markdown) as any,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const newMarkdown = tipTapToMarkdown(json);
      onChange(newMarkdown);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-full p-4 md:p-6 text-text max-w-none"
      }
    }
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && !editor.isFocused) {
      const currentMd = tipTapToMarkdown(editor.getJSON());
      if (currentMd.trim() !== markdown.trim() && currentMd !== markdown) {
        editor.commands.setContent(markdownToTipTap(markdown) as any);
      }
    }
  }, [markdown, editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-xl border transition-all ${
        isActive
          ? "bg-blue text-white border-blue"
          : "bg-surface border-border text-text-3 hover:border-blue hover:text-blue"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1.5 p-3 border-b border-border bg-surface/50 overflow-x-auto shrink-0">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="w-4 h-4" />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1 shrink-0" />
        
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive("paragraph")}>
          <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">P</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })}>
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })}>
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })}>
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1 shrink-0" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}>
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}>
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")}>
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive("code")}>
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {
          const url = window.prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          } else if (url === "") {
            editor.chain().focus().unsetLink().run();
          }
        }} isActive={editor.isActive("link")}>
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1 shrink-0" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")}>
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleList('taskList', 'taskItem').run()} isActive={editor.isActive("taskList")}>
          <ListTodo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")}>
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")}>
          <SquareCode className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {
          editor.chain().focus().insertContent(`
            <table class="border-collapse border border-border w-full my-4">
              <tbody>
                <tr>
                  <th class="border border-border p-2 bg-surface-2 font-bold text-left">Header 1</th>
                  <th class="border border-border p-2 bg-surface-2 font-bold text-left">Header 2</th>
                  <th class="border border-border p-2 bg-surface-2 font-bold text-left">Header 3</th>
                </tr>
                <tr>
                  <td class="border border-border p-2 text-left">Row 1 Cell 1</td>
                  <td class="border border-border p-2 text-left">Row 1 Cell 2</td>
                  <td class="border border-border p-2 text-left">Row 1 Cell 3</td>
                </tr>
                <tr>
                  <td class="border border-border p-2 text-left">Row 2 Cell 1</td>
                  <td class="border border-border p-2 text-left">Row 2 Cell 2</td>
                  <td class="border border-border p-2 text-left">Row 2 Cell 3</td>
                </tr>
              </tbody>
            </table>
          `).run();
        }}>
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-transparent" style={{ fontSize: `${fontSize}px` }}>
        <EditorContent editor={editor} className="min-h-full outline-none" />
      </div>
    </div>
  );
}
