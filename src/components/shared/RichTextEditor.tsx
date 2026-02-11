"use client";

import { useRef } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link,
  Code,
  Lightbulb,
  BookOpen,
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

    // Cari awal baris
    const beforeCursor = value.substring(0, start);
    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const currentLine = value.substring(
      lineStart,
      value.indexOf("\n", start) !== -1
        ? value.indexOf("\n", start)
        : value.length,
    );

    // Cek apakah sudah ada prefix
    if (currentLine.trim().startsWith(prefix.trim())) {
      // Hapus prefix
      const newLine = currentLine.replace(
        new RegExp(`^\\s*${prefix.trim()}\\s*`),
        "",
      );
      const newText =
        value.substring(0, lineStart) +
        newLine +
        value.substring(
          value.indexOf("\n", start) !== -1
            ? value.indexOf("\n", start)
            : value.length,
        );
      onChange(newText);
    } else {
      // Tambah prefix
      const newText =
        value.substring(0, lineStart) +
        prefix +
        currentLine +
        value.substring(
          value.indexOf("\n", start) !== -1
            ? value.indexOf("\n", start)
            : value.length,
        );
      onChange(newText);
    }

    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      label: "Judul Besar",
      action: () => insertLinePrefix("# "),
    },
    {
      icon: Heading2,
      label: "Judul Sedang",
      action: () => insertLinePrefix("## "),
    },
    {
      icon: Bold,
      label: "Tebal",
      action: () => insertMarkdown("**", "**"),
    },
    {
      icon: Italic,
      label: "Miring",
      action: () => insertMarkdown("*", "*"),
    },
    {
      icon: Code,
      label: "Kode",
      action: () => insertMarkdown("`", "`"),
    },
    {
      icon: Link,
      label: "Tautan",
      action: () => insertMarkdown("[", "](url)"),
    },
    {
      icon: List,
      label: "Poin",
      action: () => insertLinePrefix("- "),
    },
    {
      icon: ListOrdered,
      label: "Nomor",
      action: () => insertLinePrefix("1. "),
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200">
      {/* Info Bantuan */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#27548A]/5 to-[#578FCA]/5 border-b border-gray-200">
        <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#27548A] flex-shrink-0" />
          <span className="font-semibold">Panduan:</span> Pilih teks lalu klik
          tombol di bawah untuk memformat, atau langsung klik tombol untuk
          menambahkan format baru.
        </p>
      </div>

      {/* Toolbar - Clean design */}
      <div className="flex items-center gap-1.5 p-3 bg-gray-50 flex-wrap border-b border-gray-200">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2.5 hover:bg-[#578FCA]/10 hover:text-[#27548A] rounded-lg transition-all duration-200 border border-transparent hover:border-[#578FCA]/30"
            title={button.label}
          >
            <button.icon className="w-5 h-5 text-gray-600 group-hover:text-[#27548A] transition-colors" />
          </button>
        ))}
      </div>

      {/* Text Area - No borders inside */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 min-h-[150px] resize-y text-sm leading-relaxed bg-white text-black"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: "1.6",
          border: "none",
          outline: "none",
          boxShadow: "none",
          color: "#000000",
        }}
      />

      {/* Helper Text - Clean design */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="text-xs text-gray-600 space-y-2">
          <div className="font-semibold text-[#27548A] mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Contoh Penggunaan:
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-[#27548A]/10 flex items-center justify-center">
                <Heading1 className="w-3.5 h-3.5 text-[#27548A]" />
              </div>
              <div className="flex-1">
                <strong className="text-[#27548A]"># Judul</strong> → digunakan
                untuk <strong>Judul Besar</strong>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-[#27548A]/10 flex items-center justify-center">
                <Heading2 className="w-3.5 h-3.5 text-[#27548A]" />
              </div>
              <div className="flex-1">
                <strong className="text-[#27548A]">## Subjudul</strong> →
                digunakan untuk <strong>Judul Sedang</strong>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-[#27548A]/10 flex items-center justify-center">
                <Bold className="w-3.5 h-3.5 text-[#27548A]" />
              </div>
              <div className="flex-1">
                <strong className="text-[#27548A]">**tebal**</strong> → membuat
                teks <strong>tebal</strong>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-[#27548A]/10 flex items-center justify-center">
                <Italic className="w-3.5 h-3.5 text-[#27548A]" />
              </div>
              <div className="flex-1">
                <strong className="text-[#27548A]">*miring*</strong> → membuat
                teks <em>miring</em>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-[#27548A]/10 flex items-center justify-center">
                <Code className="w-3.5 h-3.5 text-[#27548A]" />
              </div>
              <div className="flex-1">
                <strong className="text-[#27548A]">`kode`</strong> → format
                untuk{" "}
                <code className="bg-gray-200 px-1 rounded text-[10px]">
                  kode program
                </code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-[#27548A]/10 flex items-center justify-center">
                <Link className="w-3.5 h-3.5 text-[#27548A]" />
              </div>
              <div className="flex-1">
                <strong className="text-[#27548A]">[teks](url)</strong> →
                membuat tautan/link
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-[#27548A]/10 flex items-center justify-center">
                <List className="w-3.5 h-3.5 text-[#27548A]" />
              </div>
              <div className="flex-1">
                <strong className="text-[#27548A]">- item</strong> → membuat
                daftar poin (• item)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded bg-[#27548A]/10 flex items-center justify-center">
                <ListOrdered className="w-3.5 h-3.5 text-[#27548A]" />
              </div>
              <div className="flex-1">
                <strong className="text-[#27548A]">1. item</strong> → membuat
                daftar bernomor (1. item)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
