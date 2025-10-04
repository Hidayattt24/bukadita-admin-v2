"use client";

import { useEffect, useMemo, useState } from "react";
import type React from "react";
import Swal from "sweetalert2";
import { RefreshCw } from "lucide-react";
import DataTable from "./DataTable";
import { adminMaterialsApi, type MaterialRecord, type MaterialsListResponse } from "@/lib/api/admin";
import { quizService, type QuizRecord } from "@/lib/api/quiz";

type ResourceType = "materi" | "kuis";

export interface ModuleItemRow {
  id: string;
  title: string;
  description?: string;
  updated_at?: string;
  published?: boolean;
  // Optional fields per resource type
  contentLength?: number; // materi
  questionCount?: number; // kuis
}

interface ModuleItemsPageProps {
  moduleId: string;
  resource: ResourceType;
}

const STORAGE_PREFIX = "admin_module_resource_";

export default function ModuleItemsPage({ moduleId, resource }: ModuleItemsPageProps) {
  const title = resource === "materi" ? "Materi" : "Kuis";
  const searchPlaceholder = resource === "materi" ? "Cari materi..." : "Cari kuis...";
  const storageKey = `${STORAGE_PREFIX}${resource}_${moduleId}`;

  const [rows, setRows] = useState<ModuleItemRow[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [aTitle, setATitle] = useState("");
  const [aPublished, setAPublished] = useState(false);
  const [aSlug, setASlug] = useState(""); // materi optional
  const [aContent, setAContent] = useState(""); // materi
  const [aDescription, setADescription] = useState(""); // kuis
  const [aTimeLimit, setATimeLimit] = useState<string>(""); // kuis time limit in seconds
  const [aPassingScore, setAPassingScore] = useState<string>(""); // kuis passing score
  const [aSubmitting, setASubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper to format server error from our apiFetch union result
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatServerError = (res: { ok: false; status: number; error: string; raw?: any }) => {
    const j = res.raw && typeof res.raw === 'object' ? (res.raw as Record<string, unknown>) : undefined;
    const code = typeof j?.code === 'string' ? j?.code : undefined;
    const message = (typeof j?.message === 'string' && j?.message) || res.error;
    const details = typeof j?.details === 'string' ? j?.details : undefined;
    const head = code ? `[${code}] ${message}` : message;
    return details ? `${head}\nDetail: ${details}` : head;
  };

  // Helper function to refetch materials list
  const refetchMaterialsList = async (bypassCache = false) => {
    const params = {
      module_id: moduleId,
      ...(bypassCache && { _t: Date.now() })
    };

    const res = await adminMaterialsApi.list(params);

    if (res.ok) {
      const data = res.data as MaterialsListResponse;

      // Handle multiple possible response structures
      let arr: MaterialRecord[] = [];
      if (Array.isArray(data)) {
        arr = data as MaterialRecord[];
      } else if (Array.isArray(data.items)) {
        arr = data.items;
      } else if (Array.isArray(data.data)) {
        arr = data.data;
      } else if (data && typeof data === 'object' && 'length' in data) {
        arr = Array.from(data as ArrayLike<MaterialRecord>);
      }

      const mapped: ModuleItemRow[] = arr.map((m) => ({
        id: String(m.id),
        title: m.title,
        description: typeof m.content === 'string' ? m.content.slice(0, 140) : undefined,
        updated_at: m.updated_at || m.created_at,
        published: !!m.published,
        contentLength: typeof m.content === 'string' ? m.content.length : 0,
      }));

      setRows(mapped);
      try { localStorage.setItem(storageKey, JSON.stringify(mapped)); } catch { }
      return true;
    } else {
      console.error('Failed to refetch materials:', res.error);
      return false;
    }
  };

  // Helper function to refetch quiz list
  const refetchQuizList = async (bypassCache = false) => {
    const params = {
      module_id: moduleId,
      ...(bypassCache && { _t: Date.now() })
    };

    const res = await quizService.list(params);

    if (res.ok) {
      const data = res.data;
      const arr: QuizRecord[] = Array.isArray(data.items) ? data.items : [];
      const mapped: ModuleItemRow[] = arr.map((q) => ({
        id: String(q.id),
        title: q.title,
        description: q.description?.slice(0, 140),
        updated_at: q.updated_at || q.created_at,
        published: true,
        questionCount: q.questions?.length || 0,
      }));

      setRows(mapped);
      try { localStorage.setItem(storageKey, JSON.stringify(mapped)); } catch { }
      return true;
    } else {
      console.error('Failed to refetch quizzes:', res.error);
      return false;
    }
  };

  // Load data from backend for both materi and kuis
  useEffect(() => {
    const load = async () => {
      if (resource === "materi") {
        const res = await adminMaterialsApi.list({
          module_id: moduleId
        });

        if (res.ok) {
          const data = res.data as MaterialsListResponse;

          // Handle multiple possible response structures
          let arr: MaterialRecord[] = [];
          if (Array.isArray(data)) {
            arr = data as MaterialRecord[];
          } else if (Array.isArray(data.items)) {
            arr = data.items;
          } else if (Array.isArray(data.data)) {
            arr = data.data;
          } else if (data && typeof data === 'object' && 'length' in data) {
            arr = Array.from(data as ArrayLike<MaterialRecord>);
          }

          const mapped: ModuleItemRow[] = arr.map((m) => ({
            id: String(m.id),
            title: m.title,
            description: typeof m.content === 'string' ? m.content.slice(0, 140) : undefined,
            updated_at: m.updated_at || m.created_at,
            published: !!m.published,
            contentLength: typeof m.content === 'string' ? m.content.length : 0,
          }));

          setRows(mapped);
          try { localStorage.setItem(storageKey, JSON.stringify(mapped)); } catch { }
          return;
        } else {
          console.error('Failed to load materials:', res.error);
        }
      } else if (resource === "kuis") {
        const res = await quizService.list({ module_id: moduleId });
        if (res.ok) {
          const data = res.data;
          const arr: QuizRecord[] = Array.isArray(data.items) ? data.items : [];
          const mapped: ModuleItemRow[] = arr.map((q) => ({
            id: String(q.id),
            title: q.title,
            description: q.description?.slice(0, 140),
            updated_at: q.updated_at || q.created_at,
            published: true, // Assume published if in API response
            questionCount: q.questions?.length || 0,
          }));
          setRows(mapped);
          try { localStorage.setItem(storageKey, JSON.stringify(mapped)); } catch { }
          return;
        }
      }

      // Fallback to local storage
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          setRows(JSON.parse(raw));
          return;
        }
      } catch { }

      // If no data available, set empty
      setRows([]);
    };
    load();
  }, [moduleId, resource, storageKey]);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    } catch {
      // ignore
    }
  }, [rows, storageKey]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ColumnDef = { key: string; label: string; render?: (value: any, row: ModuleItemRow) => React.ReactNode };
  const columns: ColumnDef[] = useMemo(() => {
    return [
      {
        key: "title",
        label: title,
        render: (_: unknown, row: ModuleItemRow) => (
          <div>
            {resource === "kuis" ? (
              <a
                href={`/admin/kuis/${row.id}/pertanyaan`}
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                title="Kelola pertanyaan"
              >
                {row.title}
              </a>
            ) : (
              <a
                href={`/admin/materi/${row.id}/poin`}
                className="font-medium text-green-600 hover:text-green-800 hover:underline"
                title="Kelola poin materi"
              >
                {row.title}
              </a>
            )}
            {row.description && (
              <div className="text-sm text-gray-500 truncate max-w-[360px]">{row.description}</div>
            )}
          </div>
        )
      },
      {
        key: resource === "materi" ? "contentLength" : "questionCount",
        label: resource === "materi" ? "Panjang Konten" : "Jumlah Soal",
        render: (val: number | undefined) => (
          <span className="text-sm text-gray-700">{val ?? 0} {resource === "materi" ? "kata" : "soal"}</span>
        )
      },
      {
        key: "published",
        label: "Status",
        render: (v: boolean | undefined) => (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
            {v ? "Terbit" : "Draf"}
          </span>
        )
      },
      {
        key: "updated_at",
        label: "Diubah",
        render: (val?: string) => (
          <span className="text-sm text-gray-700">{val ? new Date(val).toLocaleString("id-ID") : "-"}</span>
        )
      }
    ];
  }, [resource, title]);

  const onAdd = () => setShowAdd((v) => !v);

  const onManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (resource === 'materi') {
        await refetchMaterialsList(true);
      } else {
        await refetchQuizList(true);
      }
      await Swal.fire({
        icon: 'success',
        title: 'Data diperbarui',
        timer: 1000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Manual refresh failed:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Gagal memperbarui',
        text: 'Terjadi kesalahan saat memperbarui data'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = aTitle.trim();
    if (!titleVal || titleVal.length < 3) {
      await Swal.fire({ icon: 'warning', title: 'Judul minimal 3 karakter' });
      return;
    }

    if (resource === 'materi') {
      const contentVal = aContent.trim();
      if (!contentVal || contentVal.length < 10) {
        await Swal.fire({ icon: 'warning', title: 'Konten minimal 10 karakter' });
        return;
      }
      setASubmitting(true);

      const res = await adminMaterialsApi.createNested(moduleId, {
        title: titleVal,
        content: contentVal,
        published: aPublished,
        slug: aSlug ? aSlug.trim() : undefined,
      });

      setASubmitting(false);

      if (!res.ok) {
        await Swal.fire({ icon: 'error', title: 'Gagal', text: formatServerError(res as unknown as { ok: false; status: number; error: string; raw?: unknown }) || 'Gagal membuat materi' });
        return;
      }

      // Force refetch all materials to ensure UI shows complete list
      await refetchMaterialsList();

      await Swal.fire({ icon: 'success', title: 'Berhasil', timer: 900, showConfirmButton: false });
      // reset & close
      setATitle(""); setAContent(""); setASlug(""); setAPublished(false); setShowAdd(false);
      return;
    }

    // Kuis: create via backend API
    if (resource === 'kuis') {
      setASubmitting(true);
      const payload = {
        module_id: moduleId,
        title: titleVal,
        description: aDescription || undefined,
        time_limit_seconds: aTimeLimit ? Number(aTimeLimit) : undefined,
        passing_score: aPassingScore ? Number(aPassingScore) : undefined,
      };

      const res = await quizService.create(payload);
      setASubmitting(false);

      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: formatServerError(res as unknown as { ok: false; status: number; error: string; raw?: unknown }) || 'Gagal membuat kuis'
        });
        return;
      }

      // Force refetch all quizzes to ensure UI shows complete list
      await refetchQuizList();

      await Swal.fire({ icon: 'success', title: 'Berhasil', timer: 900, showConfirmButton: false });
      // Reset form
      setATitle(""); setADescription(""); setAPublished(false);
      setATimeLimit(""); setAPassingScore(""); setShowAdd(false);
      return;
    }
  };

  const onEdit = async (row: ModuleItemRow) => {
    if (resource === 'materi') {
      const { value: formValues, isConfirmed } = await Swal.fire<
        { title?: string; content?: string; published?: boolean } | undefined
      >({
        title: `Edit ${title}`,
        html:
          `<input id="f-title" class="swal2-input" placeholder="Judul (min 3)" value="${row.title.replace(/"/g, '&quot;')}"/>` +
          `<textarea id="f-content" class="swal2-textarea" placeholder="Konten (min 10 karakter)"></textarea>` +
          `<label style="display:flex;align-items:center;gap:8px;justify-content:center;margin-top:6px"><input type="checkbox" id="f-pub" ${row.published ? 'checked' : ''}/> Terbitkan</label>`,
        focusConfirm: false,
        preConfirm: () => {
          const t = (document.getElementById('f-title') as HTMLInputElement)?.value?.trim();
          const c = (document.getElementById('f-content') as HTMLTextAreaElement)?.value?.trim();
          const p = (document.getElementById('f-pub') as HTMLInputElement)?.checked;
          const payload: { title?: string; content?: string; published?: boolean } = {};
          if (t && t.length >= 3) payload.title = t;
          if (c && c.length >= 10) payload.content = c;
          payload.published = !!p;
          if (!payload.title && !payload.content && typeof payload.published === 'undefined') {
            Swal.showValidationMessage('Tidak ada perubahan yang valid.');
            return undefined;
          }
          return payload;
        },
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal'
      });
      if (!isConfirmed || !formValues) return;
      const res = await adminMaterialsApi.update(row.id, formValues);
      if (!res.ok) {
        await Swal.fire({ icon: 'error', title: 'Gagal', text: formatServerError(res as unknown as { ok: false; status: number; error: string; raw?: unknown }) || 'Gagal memperbarui materi' });
        return;
      }
      // Force refetch to ensure UI is up to date
      await refetchMaterialsList();
      await Swal.fire({ icon: 'success', title: 'Tersimpan', timer: 900, showConfirmButton: false });
      return;
    }
    // kuis: update via backend API
    const { value: formValues, isConfirmed } = await Swal.fire<{ title: string; description?: string; time_limit_seconds?: number; passing_score?: number } | undefined>({
      title: `Edit ${title}`,
      html:
        `<input id="f-title" class="swal2-input" placeholder="Judul" value="${row.title.replace(/"/g, '&quot;')}"/>` +
        `<input id="f-desc" class="swal2-input" placeholder="Deskripsi (opsional)" value="${(row.description || '').replace(/"/g, '&quot;')}"/>` +
        `<input id="f-time" class="swal2-input" type="number" placeholder="Batas waktu (detik)" value=""/>` +
        `<input id="f-score" class="swal2-input" type="number" placeholder="Nilai lulus (%)" value=""/>`,
      focusConfirm: false,
      preConfirm: () => {
        const t = (document.getElementById('f-title') as HTMLInputElement)?.value?.trim();
        const d = (document.getElementById('f-desc') as HTMLInputElement)?.value?.trim();
        const time = (document.getElementById('f-time') as HTMLInputElement)?.value;
        const score = (document.getElementById('f-score') as HTMLInputElement)?.value;
        if (!t || t.length < 3) {
          Swal.showValidationMessage('Judul minimal 3 karakter');
          return undefined;
        }
        const payload: { title: string; description?: string; time_limit_seconds?: number; passing_score?: number } = { title: t };
        if (d) payload.description = d;
        if (time && Number(time) > 0) payload.time_limit_seconds = Number(time);
        if (score && Number(score) > 0) payload.passing_score = Number(score);
        return payload;
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal'
    });

    if (!isConfirmed || !formValues) return;

    const res = await quizService.update(row.id, formValues);
    if (!res.ok) {
      await Swal.fire({ icon: 'error', title: 'Gagal', text: formatServerError(res as unknown as { ok: false; status: number; error: string; raw?: unknown }) || 'Gagal memperbarui kuis' });
      return;
    }

    // Force refetch to ensure UI is up to date
    await refetchQuizList();

    await Swal.fire({ icon: 'success', title: 'Tersimpan', timer: 900, showConfirmButton: false });
  };

  const onDelete = async (row: ModuleItemRow) => {
    const result = await Swal.fire({
      title: `Hapus ${title}?`,
      text: `Item \"${row.title}\" akan dihapus.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });
    if (!result.isConfirmed) return;
    if (resource === 'materi') {
      const res = await adminMaterialsApi.remove(row.id);
      if (!res.ok) {
        await Swal.fire({ icon: 'error', title: 'Gagal', text: formatServerError(res as unknown as { ok: false; status: number; error: string; raw?: unknown }) || 'Gagal menghapus materi' });
        return;
      }
      // Force refetch to ensure UI is accurate
      await refetchMaterialsList();
    } else if (resource === 'kuis') {
      const res = await quizService.remove(row.id);
      if (!res.ok) {
        await Swal.fire({ icon: 'error', title: 'Gagal', text: formatServerError(res as unknown as { ok: false; status: number; error: string; raw?: unknown }) || 'Gagal menghapus kuis' });
        return;
      }
      // Force refetch to ensure UI is accurate
      await refetchQuizList();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      {/* Add form section */}
      {showAdd && (
        <form onSubmit={submitAdd} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tambah {title} Baru</h2>
          {resource === 'materi' ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-600">Judul *</label>
                <input value={aTitle} onChange={(e) => setATitle(e.target.value)} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Judul minimal 3 karakter" required minLength={3} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Konten *</label>
                <textarea value={aContent} onChange={(e) => setAContent(e.target.value)} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-32" placeholder="Konten minimal 10 karakter" required />
              </div>
              <div className="flex items-center gap-2">
                <input id="a-published" type="checkbox" checked={aPublished} onChange={(e) => setAPublished(e.target.checked)} className="w-4 h-4" />
                <label htmlFor="a-published" className="text-sm text-gray-700">
                  Terbitkan
                  <span className="text-xs text-gray-500 ml-1">
                    (Draft juga akan tampil di admin, tapi tidak di user)
                  </span>
                </label>
              </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Slug (opsional)</label>
                  <input value={aSlug} onChange={(e) => setASlug(e.target.value)} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="biarkan kosong untuk auto" />
                </div>
              </div> */}
              <div>
                <button type="submit" disabled={aSubmitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow disabled:opacity-60">
                  {aSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow">
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-600">Judul *</label>
                <input value={aTitle} onChange={(e) => setATitle(e.target.value)} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Judul minimal 3 karakter" required minLength={3} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Deskripsi</label>
                <input value={aDescription} onChange={(e) => setADescription(e.target.value)} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Opsional" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Batas Waktu (detik)</label>
                  <input type="number" min={0} value={aTimeLimit} onChange={(e) => setATimeLimit(e.target.value)} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="mis. 1800 (30 menit)" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Nilai Lulus (%)</label>
                  <input type="number" min={0} max={100} value={aPassingScore} onChange={(e) => setAPassingScore(e.target.value)} className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="mis. 70" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input id="q-published" type="checkbox" checked={aPublished} onChange={(e) => setAPublished(e.target.checked)} className="w-4 h-4" />
                <label htmlFor="q-published" className="text-sm text-gray-700">Terbitkan</label>
              </div>
              <div>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow">
                  Simpan
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow">
                  Batal
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title} Modul</h2>
            <p className="text-sm text-gray-500 mt-1">
              Mode Admin: Menampilkan semua {title.toLowerCase()} termasuk draft
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Memuat...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* DataTable content */}
        <div className="p-4">
          <DataTable<ModuleItemRow>
            title=""
            data={rows}
            columns={columns}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            searchPlaceholder={searchPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
