"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

function normalizeContent(value) {
  if (!value) return "<p></p>";

  // Pertahankan format HTML artikel yang sudah tersimpan.
  if (/<[a-z][\s\S]*>/i.test(value)) {
    return value;
  }

  // Ubah teks artikel lama menjadi paragraf HTML.
  return value
    .split(/\r?\n/)
    .map((line) => {
      const escaped = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `<p>${escaped || "<br>"}</p>`;
    })
    .join("");
}

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: normalizeContent(value),
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[280px] px-4 py-3 outline-none text-gray-800 leading-7",
      },
    },
  });

  // Sinkronkan isi editor ketika data artikel selesai dimuat.
  useEffect(() => {
    if (!editor) return;

    const nextContent = normalizeContent(value);

    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[280px] rounded-lg border border-gray-300 p-4 text-gray-500">
        Menyiapkan editor...
      </div>
    );
  }

  function toolbarButton(label, action, active = false) {
    return (
      <button
        key={label}
        type="button"
        title={label}
        aria-label={label}
        onClick={action}
        className={`rounded-md border px-3 py-2 text-sm font-medium ${
          active
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        {label}
      </button>
    );
  }

  function addLink() {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt(
      "Masukkan URL tautan:",
      previousUrl || "https://",
    );

    if (url === null) return;

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      const parsedUrl = new URL(trimmedUrl);

      if (!["http:", "https:", "mailto:"].includes(parsedUrl.protocol)) {
        window.alert("Gunakan URL HTTP, HTTPS, atau email yang valid.");
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: trimmedUrl })
        .run();
    } catch {
      window.alert(
        "URL tidak valid. Masukkan URL lengkap, misalnya https://example.com",
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3">
        {toolbarButton(
          "B",
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold"),
        )}

        {toolbarButton(
          "I",
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic"),
        )}

        {toolbarButton(
          "H2",
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 }),
        )}

        {toolbarButton(
          "H3",
          () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          editor.isActive("heading", { level: 3 }),
        )}

        {toolbarButton(
          "• List",
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList"),
        )}

        {toolbarButton(
          "1. List",
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList"),
        )}

        {toolbarButton(
          "Quote",
          () => editor.chain().focus().toggleBlockquote().run(),
          editor.isActive("blockquote"),
        )}

        {toolbarButton("Link", addLink, editor.isActive("link"))}

        {toolbarButton("Hapus Link", () =>
          editor.chain().focus().unsetLink().run(),
        )}

        {toolbarButton("Undo", () => editor.chain().focus().undo().run())}

        {toolbarButton("Redo", () => editor.chain().focus().redo().run())}
      </div>

      <EditorContent editor={editor} />

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
        Pilih teks terlebih dahulu untuk memformatnya.
      </div>
    </div>
  );
}
