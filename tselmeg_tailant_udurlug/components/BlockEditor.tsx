"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  ImageIcon,
  Quote,
  Minus,
  Undo,
  Redo,
  FileUp,
  Loader2,
} from "lucide-react";

function ToolbarButton({
  onClick,
  active,
  title,
  children,
  className = "",
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 items-center justify-center gap-1.5 rounded px-2 transition text-xs font-semibold ${
        active
          ? "bg-brand-blue text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-brand-line" />;
}

export function BlockEditor({
  defaultValue = "",
  onChange,
}: {
  defaultValue?: string;
  onChange?: (html: string) => void;
}) {
  const [docxLoading, setDocxLoading] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Энд бичнэ үү... эсвэл .docx файл оруулна уу." }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultValue || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] focus:outline-none px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Зургийн URL оруулна уу:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt("Холбоосын URL оруулна уу:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  const handleDocxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocxLoading(true);
    setDocxError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/docx-to-html", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Хөрвүүлэлт амжилтгүй");
      }

      const { html } = await res.json();
      editor.commands.setContent(html);
      onChange?.(editor.getHTML());
    } catch (err: any) {
      setDocxError(err.message);
    } finally {
      setDocxLoading(false);
      // Reset input so same file can be re-uploaded
      if (docxInputRef.current) docxInputRef.current.value = "";
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-brand-line bg-white focus-within:border-brand-blue">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-line bg-brand-pale px-2 py-1.5">
        {/* DOCX import — highlighted as primary action */}
        <input
          ref={docxInputRef}
          type="file"
          accept=".docx,.pptx"
          className="hidden"
          onChange={handleDocxUpload}
        />
        <ToolbarButton
          title="Word (.docx) эсвэл PowerPoint (.pptx) файлаас оруулах"
          onClick={() => docxInputRef.current?.click()}
          className="border border-brand-blue/30 bg-brand-mist !text-brand-blue hover:!bg-brand-blue hover:!text-white"
        >
          {docxLoading ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
          <span>Word / PPT оруулах</span>
        </ToolbarButton>

        <Divider />

        {/* History */}
        <ToolbarButton title="Буцаах" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton title="Дахин хийх" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={14} />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          title="Гарчиг 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Гарчиг 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Гарчиг 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={14} />
        </ToolbarButton>

        <Divider />

        {/* Formatting */}
        <ToolbarButton
          title="Тод"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Налуу"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Доогуур зурсан"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={14} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          title="Зүүн"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Төв"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Баруун"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={14} />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          title="Жагсаалт"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Дугаарлагдсан жагсаалт"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Иш татах"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={14} />
        </ToolbarButton>
        <ToolbarButton
          title="Хэвтээ шугам"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={14} />
        </ToolbarButton>

        <Divider />

        {/* Media */}
        <ToolbarButton title="Холбоос нэмэх" active={editor.isActive("link")} onClick={setLink}>
          <Link2 size={14} />
        </ToolbarButton>
        <ToolbarButton title="Зураг нэмэх" onClick={addImage}>
          <ImageIcon size={14} />
        </ToolbarButton>
      </div>

      {/* DOCX error */}
      {docxError && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          ⚠ {docxError}
        </div>
      )}

      {/* DOCX loading overlay */}
      {docxLoading && (
        <div className="flex items-center gap-2 border-b border-brand-line bg-brand-mist px-4 py-2 text-sm text-brand-blue">
          <Loader2 size={14} className="animate-spin" />
          Word файлыг хөрвүүлж байна...
        </div>
      )}

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
