import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import {
  Bold,
  Italic,
  Underline as U,
  Strikethrough,
  Heading,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Expand,
  Minimize,
  Heading2,
} from "lucide-react";

const extensions = [StarterKit, Underline];

const TiptapEditor = ({ onChange, value = "" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Sync external value prop to editor content
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false); // false: don't emit update event
    }
  }, [value, editor]);

  // Prevent body scroll when fullscreen active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  if (!editor) return null;

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const buttonClass = (isActive) =>
    `px-3 py-1 rounded text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-yellow-500 text-white"
        : "bg-white text-yellow-800 hover:bg-yellow-200"
    }`;

  const toolbarButtons = [
    {
      icon: <Bold size={18} aria-label="Bold" />,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: <Italic size={18} aria-label="Italic" />,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: <U size={18} aria-label="Underline" />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      label: "Underline",
    },
    {
      icon: <Strikethrough size={18} aria-label="Strikethrough" />,
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      label: "Strikethrough",
    },
    {
      icon: <Heading size={18} aria-label="Heading 1" />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      label: "Heading 1",
    },
    {
      icon: <Heading2 size={18} aria-label="Heading 2" />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: <List size={18} aria-label="Bullet List" />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: <ListOrdered size={18} aria-label="Ordered List" />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      label: "Ordered List",
    },
    {
      icon: <Quote size={18} aria-label="Blockquote" />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      label: "Blockquote",
    },
    {
      icon: <Code size={18} aria-label="Code Block" />,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      label: "Code Block",
    },
    {
      icon: <Undo size={18} aria-label="Undo" />,
      action: () => editor.chain().focus().undo().run(),
      active: false,
      label: "Undo",
    },
    {
      icon: <Redo size={18} aria-label="Redo" />,
      action: () => editor.chain().focus().redo().run(),
      active: false,
      label: "Redo",
    },
    {
      icon: isFullscreen ? (
        <Minimize size={18} aria-label="Minimize Editor" />
      ) : (
        <Expand size={18} aria-label="Expand Editor" />
      ),
      action: toggleFullscreen,
      active: false,
      label: "Toggle Fullscreen",
    },
  ];

  return (
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-white p-4" : ""}>
      <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 border border-gray-300 rounded-md shadow-sm">
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              btn.action();
            }}
            className={buttonClass(btn.active)}
            aria-label={btn.label}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.action();
              }
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      <EditorContent
        editor={editor}
        className={`${
          isFullscreen ? "h-[80vh]" : "h-[30vh]"
        } w-full p-2 border border-gray-300 rounded-md overflow-y-auto scrollbar-thin`}
      />
    </div>
  );
};

export default TiptapEditor;
