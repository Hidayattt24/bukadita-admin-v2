"use client";

import { FileText } from "lucide-react";
import type { Poin } from "@/lib/api";
import PoinListItem from "./PoinListItem";

interface PoinListProps {
  poins: Poin[];
  onEditPoin: (poin: Poin) => void;
  onDeletePoin: (poin: Poin) => void;
}

export default function PoinList({
  poins,
  onEditPoin,
  onDeletePoin,
}: PoinListProps) {
  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#27548A] via-[#578FCA] to-[#27548A]"></div>
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#27548A] to-[#578FCA] flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Daftar Poin Materi
              </h2>
              <p className="text-sm text-gray-500">
                Total {poins.length} poin pembelajaran
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white font-bold rounded-xl shadow-lg">
            {poins.length}
          </div>
        </div>
      </div>

      {poins.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 font-semibold mb-2">
            Belum ada poin materi
          </p>
          <p className="text-sm text-gray-500">
            Klik &quot;Tambah Poin Baru&quot; untuk mulai membuat konten materi
            pembelajaran
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {poins
            .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
            .map((poin, index) => (
              <PoinListItem
                key={poin.id}
                poin={poin}
                index={index}
                onEdit={onEditPoin}
                onDelete={onDeletePoin}
              />
            ))}
        </div>
      )}
    </div>
  );
}
