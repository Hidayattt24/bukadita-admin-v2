"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Clock,
  CheckCheck,
  User,
  Mail,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { messagesAPI, progressMonitoringAPI, removeAdminMessage } from "@/lib/api";
import type { AdminMessage } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

interface SendMessagePageProps {
  userId: string;
}

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Pesan?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Pesan ini akan dihapus permanen dan juga akan hilang dari notifikasi pengguna.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isPending ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SendMessagePage({ userId }: SendMessagePageProps) {
  const queryClient = useQueryClient();
  const { toast, ToastContainer } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: userDetail, isLoading: isUserLoading } = useQuery({
    queryKey: ["user-detail-for-message", userId],
    queryFn: async () => {
      const res = await progressMonitoringAPI.getUserDetail(userId);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    enabled: !!userId,
  });

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["message-history", userId],
    queryFn: async () => {
      const res = await messagesAPI.getHistory(userId);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const res = await removeAdminMessage(messageId);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      setDeleteTargetId(null);
      toast.removed(
        "Berhasil Dihapus!",
        "Pesan telah dihapus dari riwayat dan notifikasi pengguna",
      );
      queryClient.invalidateQueries({ queryKey: ["message-history", userId] });
      void refetchHistory();
    },
    onError: (error: Error) => {
      setDeleteTargetId(null);
      toast.error("Gagal Menghapus", error.message);
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (data: { title: string; message: string }) => {
      const res = await messagesAPI.send({
        receiver_id: userId,
        title: data.title,
        message: data.message,
      });
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      setTitle("");
      setMessage("");
      toast.success("Pesan Terkirim!", "Pesan berhasil dikirim ke pengguna");
      queryClient.invalidateQueries({ queryKey: ["message-history", userId] });
      refetchHistory();
    },
    onError: (error: Error) => {
      toast.error("Gagal Mengirim", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    sendMutation.mutate({ title: title.trim(), message: message.trim() });
  };

  const user = userDetail as Record<string, unknown> | undefined;
  const userName =
    (user?.user_name as string) || (user?.full_name as string) || "Pengguna";
  const userEmail =
    (user?.user_email as string) || (user?.email as string) || "";
  const userPhoto =
    (user?.user_profil_url as string) || (user?.profil_url as string) || null;

  const messages: AdminMessage[] = historyData?.items ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToastContainer />

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) deleteMutation.mutate(deleteTargetId);
        }}
        isPending={deleteMutation.isPending}
      />

      {/* Back button + Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/progress"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kirim Pesan</h1>
          <p className="text-sm text-gray-500">
            Kirim pesan notifikasi ke pengguna
          </p>
        </div>
      </div>

      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#578FCA] to-[#27548A] rounded-xl p-5 text-white shadow-lg"
      >
        {isUserLoading ? (
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-14 h-14 bg-white/20 rounded-full" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-white/20 rounded" />
              <div className="h-4 w-56 bg-white/20 rounded" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold border-2 border-white/30 shrink-0 overflow-hidden">
              {userPhoto ? (
                <Image
                  src={userPhoto}
                  alt={userName}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <User className="w-4 h-4" />
                {userName}
              </h2>
              <p className="text-blue-100 text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                {userEmail}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Send Message Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            Tulis Pesan Baru
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Judul Pesan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Reminder Kuis Modul 1"
              className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Isi Pesan
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan untuk pengguna..."
              rows={4}
              className="w-full px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                sendMutation.isPending || !title.trim() || !message.trim()
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <Send className="w-4 h-4" />
              {sendMutation.isPending ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </div>
          {sendMutation.isError && (
            <p className="text-sm text-red-600">
              Gagal mengirim: {sendMutation.error.message}
            </p>
          )}
        </form>
      </motion.div>

      {/* Message History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Riwayat Pesan
            {messages.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {historyData?.pagination?.total ?? messages.length}
              </span>
            )}
          </h3>
        </div>
        <div className="p-5">
          {isHistoryLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Belum ada pesan yang dikirim</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {msg.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {msg.is_read ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5" />
                          Dibaca
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Belum dibaca
                        </span>
                      )}
                      <button
                        onClick={() => setDeleteTargetId(msg.id)}
                        className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                        title="Hapus pesan"
                      >
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
