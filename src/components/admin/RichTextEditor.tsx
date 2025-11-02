"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Code,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis konten di sini...",
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    let newText: string;
    let newCursorPos: number;

    if (selectedText) {
      // Ada teks yang dipilih
      newText = beforeText + before + selectedText + after + afterText;
      newCursorPos = start + before.length + selectedText.length + after.length;
    } else {
      // Tidak ada teks yang dipilih
      newText = beforeText + before + after + afterText;
      newCursorPos = start + before.length;
    }

    onChange(newText);

    // Set cursor position setelah render
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Cari awal baris
    const beforeCursor = value.substring(0, start);
    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const currentLine = value.substring(
      lineStart,
      value.indexOf("\n", start) !== -1 ? value.indexOf("\n", start) : value.length
    );

    // Cek apakah sudah ada prefix
    if (currentLine.trim().startsWith(prefix.trim())) {
      // Hapus prefix
      const newLine = currentLine.replace(new RegExp(`^\\s*${prefix.trim()}\\s*`), "");
      const newText =
        value.substring(0, lineStart) +
        newLine +
        value.substring(
          value.indexOf("\n", start) !== -1 ? value.indexOf("\n", start) : value.length
        );
      onChange(newText);
    } else {
      // Tambah prefix
      const newText =
        value.substring(0, lineStart) +
        prefix +
        currentLine +
        value.substring(
          value.indexOf("\n", start) !== -1 ? value.indexOf("\n", start) : value.length
        );
      onChange(newText);
    }

    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertMarkdown("**", "**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertMarkdown("*", "*"),
    },
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertLinePrefix("# "),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => insertLinePrefix("## "),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertLinePrefix("- "),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertLinePrefix("1. "),
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: () => insertMarkdown("[", "](url)"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("`", "`"),
    },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2 hover:bg-gray-200 rounded transition-colors group relative"
            title={button.label}
          >
            <button.icon className="w-4 h-4 text-gray-700" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {button.label}
            </span>
          </button>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 min-h-[200px] resize-y focus:outline-none font-mono text-sm"
        style={{ fontFamily: "ui-monospace, monospace" }}
      />

      {/* Helper Text */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        Mendukung Markdown: **bold**, *italic*, # heading, - list, [link](url)
      </div>
    </div>
  );
}
