"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { PlusCircle, Folder, Edit, Trash2, BookOpen, ListChecks, X, Check, Clock, Search, Filter } from "lucide-react";
import Link from "next/link";
import { adminModulesApi, adminMaterialsApi } from "@/lib/api/admin";
import { quizService } from "@/lib/api/quiz";
import StatCard from "@/components/admin/shared/StatCard";

interface ModuleItem {
  id: string | number;
  title: string;
  slug?: string;
  description?: string;
  published?: boolean;
  duration_label?: string | null;
  duration_minutes?: number | null;
  lessons?: number | null;
  category?: string | null;
  materiCount?: number;
  quizCount?: number;
  // Alternative field names from backend
  materials_count?: number;
  quiz_count?: number;
  created_at?: string;
  updated_at?: string;
}

const STORAGE_KEY = "admin_modules";

export default function ModuleManagement() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modulesCounts, setModulesCounts] = useState<Record<string, { materials: number; quiz: number }>>({});

  // Create form state (not using SweetAlert for input)
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [durationLabel, setDurationLabel] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(""); // keep as string for an input
  const [lessons, setLessons] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit form state (inline, not using SweetAlert for input)
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [eTitle, setETitle] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [ePublished, setEPublished] = useState(false);
  const [eDurationLabel, setEDurationLabel] = useState("");
  const [eDurationMinutes, setEDurationMinutes] = useState("");
  const [eLessons, setELessons] = useState("");
  const [eCategory, setECategory] = useState("");
  const [eSubmitting, setESubmitting] = useState(false);

  // Load modules from backend with fallback to localStorage
  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminModulesApi.list();
        if (res.ok) {
          const dataAny = res.data as unknown as ModuleItem[] | { items?: ModuleItem[]; data?: ModuleItem[] };
          const items = Array.isArray(dataAny)
            ? dataAny
            : ((dataAny.items || dataAny.data || []) as ModuleItem[]);
          console.log("🛰️ Modules API list():", items);
          setModules(items);
          // Fetch real counts for materials and quiz
          refreshAllCounts(items);
          // sync to localStorage for sidebar fallback
          localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          window.dispatchEvent(new Event('modules:updated'));
          return;
        }
        console.warn("⚠️ Modules API list() failed:", res.error);
      } catch (e) {
        console.warn("⚠️ Modules API list() error:", e);
      }
      // fallback
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setModules(JSON.parse(raw));
        else setModules([]);
      } catch {
        setModules([]);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save modules to localStorage and notify sidebar
  const saveModules = (next: ModuleItem[]) => {
    setModules(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('modules:updated'));
    // Refresh counts after module changes (async call, no await to avoid blocking)
    refreshAllCounts(next).catch(console.error);
  };

  // Helpers for numeric nullable
  const toNumOrNull = (v: string) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPublished(false);
    setDurationLabel("");
    setDurationMinutes("");
    setLessons("");
    setCategory("");
  };

  // Helpers
  const parseList = (d: unknown): ModuleItem[] => {
    const dataAny = d as ModuleItem[] | { items?: ModuleItem[]; data?: ModuleItem[] };
    return Array.isArray(dataAny) ? dataAny : ((dataAny.items || dataAny.data || []) as ModuleItem[]);
  };

  // Function to fetch real counts for materials and quiz
  const fetchModuleCounts = useCallback(async (moduleId: string | number) => {
    try {
      // Fetch materials count
      const materialsRes = await adminMaterialsApi.list({ module_id: moduleId });
      const materialsCount = materialsRes.ok ?
        (Array.isArray(materialsRes.data) ? materialsRes.data.length :
          materialsRes.data?.items?.length || 0) : 0;

      // Fetch quiz count - use the same approach as ModuleItemsPage
      let quizCount = 0;

      // First try direct module_id approach
      const quizRes = await quizService.list({ module_id: moduleId });

      if (quizRes.ok && quizRes.data?.items) {
        quizCount = quizRes.data.items.length;
      } else if (quizRes.ok && !quizRes.data?.items && materialsRes.ok && materialsRes.data?.items) {
        // If no direct results, try sub_materi_id approach
        const allQuizzes: unknown[] = [];

        for (const material of materialsRes.data.items) {
          const subQuizRes = await quizService.list({ sub_materi_id: material.id });

          if (subQuizRes.ok) {
            const quizData = subQuizRes.data;
            const quizDataWithQuizzes = quizData as typeof quizData & { quizzes?: unknown[] };

            if (quizData.items) {
              allQuizzes.push(...quizData.items);
            } else if (quizDataWithQuizzes.quizzes) {
              allQuizzes.push(...quizDataWithQuizzes.quizzes);
            }
          }
        }

        quizCount = allQuizzes.length;
      }

      return { materials: materialsCount, quiz: quizCount };
    } catch (error) {
      console.error('Error fetching module counts:', error);
      return { materials: 0, quiz: 0 };
    }
  }, []);

  // Function to refresh counts for all modules
  const refreshAllCounts = useCallback(async (modulesList: ModuleItem[]) => {
    const countsPromises = modulesList.map(async (module) => {
      const counts = await fetchModuleCounts(module.id);
      return { id: String(module.id), counts };
    });

    const results = await Promise.all(countsPromises);
    const newCounts: Record<string, { materials: number; quiz: number }> = {};

    results.forEach(({ id, counts }) => {
      newCounts[id] = counts;
    });

    setModulesCounts(newCounts);
  }, [fetchModuleCounts]);

  const beginEdit = (m: ModuleItem) => {
    setEditingId(m.id);
    setETitle(m.title || "");
    setEDescription(m.description || "");
    setEPublished(!!m.published);
    setEDurationLabel(m.duration_label || "");
    setEDurationMinutes(
      typeof m.duration_minutes === 'number' && Number.isFinite(m.duration_minutes)
        ? String(m.duration_minutes)
        : ""
    );
    setELessons(
      typeof m.lessons === 'number' && Number.isFinite(m.lessons)
        ? String(m.lessons)
        : ""
    );
    setECategory(m.category || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setETitle("");
    setEDescription("");
    setEPublished(false);
    setEDurationLabel("");
    setEDurationMinutes("");
    setELessons("");
    setECategory("");
    setESubmitting(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || title.trim().length < 3) {
      await Swal.fire({ icon: 'warning', title: 'Judul minimal 3 karakter' });
      return;
    }
    const payload = {
      title: title.trim(),
      description: (description ?? '').trim(),
      published: !!published,
      duration_label: durationLabel?.trim() || null,
      duration_minutes: toNumOrNull(durationMinutes),
      lessons: toNumOrNull(lessons),
      category: category || null,
    };
    setSubmitting(true);
    try {
      const apiRes = await adminModulesApi.create(payload);
      if (apiRes.ok) {
        const listRes = await adminModulesApi.list();
        if (listRes.ok) {
          const items = parseList(listRes.data);
          saveModules(items);
        }
        await Swal.fire({ icon: 'success', title: 'Berhasil', text: `Modul "${payload.title}" ditambahkan.`, timer: 1400, showConfirmButton: false });
        resetForm();
        setShowForm(false);
      } else {
        const raw = (apiRes as { raw?: unknown; error?: string }) || {};
        const rawMsg = typeof raw.raw === 'object' && raw.raw && 'message' in (raw.raw as Record<string, unknown>)
          ? String((raw.raw as Record<string, unknown>).message)
          : undefined;
        const msg = rawMsg || raw.error || 'Gagal menambah modul';
        await Swal.fire({ icon: 'error', title: 'Gagal', text: msg });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan';
      await Swal.fire({ icon: 'error', title: 'Gagal', text: message });
    } finally {
      setSubmitting(false);
    }
  };

  const saveEdit = async (m: ModuleItem) => {
    if (!eTitle || eTitle.trim().length < 3) {
      await Swal.fire({ icon: 'warning', title: 'Judul minimal 3 karakter' });
      return;
    }
    const payload = {
      title: eTitle.trim(),
      description: (eDescription ?? '').trim(),
      published: !!ePublished,
      duration_label: eDurationLabel?.trim() || null,
      duration_minutes: toNumOrNull(eDurationMinutes),
      lessons: toNumOrNull(eLessons),
      category: eCategory || null,
    };
    setESubmitting(true);
    try {
      const apiRes = await adminModulesApi.update(m.id, payload);
      if (apiRes.ok) {
        const listRes = await adminModulesApi.list();
        if (listRes.ok) {
          const items = parseList(listRes.data);
          saveModules(items);
        }
        await Swal.fire({ icon: 'success', title: 'Tersimpan', text: `Modul "${payload.title}" berhasil diupdate.`, timer: 1000, showConfirmButton: false });
        cancelEdit();
        return;
      } else {
        console.warn('⚠️ Modules API update() failed:', apiRes.error);
      }
    } catch (e) {
      console.warn('⚠️ Modules API update() error:', e);
    }
  };

  const deleteModule = async (m: ModuleItem) => {
    const result = await Swal.fire({
      title: 'Hapus Modul?',
      text: `Modul "${m.title}" akan dihapus beserta sub-menu.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });
    if (result.isConfirmed) {
      try {
        const apiRes = await adminModulesApi.remove(m.id);
        if (apiRes.ok) {
          console.log("✅ Modules API remove():", m.id);
          const listRes = await adminModulesApi.list();
          if (listRes.ok) {
            const items = (listRes.data.items || listRes.data.data || []) as ModuleItem[];
            saveModules(items);
          }
          await Swal.fire({ icon: 'success', title: 'Dihapus', text: `Modul "${m.title}" berhasil dihapus.`, timer: 900, showConfirmButton: false });
          return;
        } else {
          console.warn("⚠️ Modules API remove() failed:", apiRes.error);
        }
      } catch (e) {
        console.warn("⚠️ Modules API remove() error:", e);
      }
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = modules;

    // Filter berdasarkan pencarian
    if (q) {
      result = result.filter(m => m.title.toLowerCase().includes(q));
    }

    // Filter berdasarkan status
    if (statusFilter) {
      if (statusFilter === "published") {
        result = result.filter(m => m.published === true);
      } else if (statusFilter === "draft") {
        result = result.filter(m => m.published !== true);
      }
    }

    return result;
  }, [modules, search, statusFilter]);

  // Calculate statistics
  const totalModules = modules.length;
  const publishedModules = modules.filter(m => m.published === true).length;
  const totalMaterials = Object.values(modulesCounts).reduce((acc, curr) => acc + curr.materials, 0);
  const totalQuiz = Object.values(modulesCounts).reduce((acc, curr) => acc + curr.quiz, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Kelola Modul</h1>
          </div>
        </div>
        <p className="text-gray-600">Tambah, ubah, dan hapus modul. Setiap modul memiliki Materi dan Kuis.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Modul"
          value={totalModules}
          icon={Folder}
          color="blue"
        />

        <StatCard
          title="Modul Aktif"
          value={publishedModules}
          icon={Check}
          color="green"
        />

        <StatCard
          title="Total Materi"
          value={totalMaterials}
          icon={BookOpen}
          color="purple"
        />

        <StatCard
          title="Total Kuis"
          value={totalQuiz}
          icon={ListChecks}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari modul..."
                className="pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Status */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Semua Status</option>
                <option value="published">Terbit</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowForm((v) => { if (v) resetForm(); return !v; })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow ${showForm ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            type="button"
          >
            {showForm ? (
              <X className="w-5 h-5" />
            ) : (
              <PlusCircle className="w-5 h-5" />
            )}
            {showForm ? 'Tutup Form' : 'Tambah Modul'}
          </button>
        </div>
      </div>

      {/* Create Module Form */}
      {showForm && (
        <form onSubmit={handleCreateSubmit} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tambah Modul Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Judul Modul *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Judul minimal 3 karakter"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                minLength={3}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Deskripsi</label>
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Opsional"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Label Durasi</label>
              <input
                value={durationLabel}
                onChange={e => setDurationLabel(e.target.value)}
                placeholder="mis. 4–6 minggu"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Durasi (menit)</label>
              <input
                type="number"
                min={0}
                value={durationMinutes}
                onChange={e => setDurationMinutes(e.target.value)}
                placeholder="mis. 120"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Jumlah Pelajaran</label>
              <input
                type="number"
                min={0}
                value={lessons}
                onChange={e => setLessons(e.target.value)}
                placeholder="mis. 10"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Kategori</label>
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="mis. Kesehatan Ibu"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={e => setPublished(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm text-gray-700">Terbitkan</label>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow disabled:opacity-60"
              >
                <Check className="w-5 h-5" />
                {submitting ? 'Menyimpan...' : 'Simpan Modul'}
              </button>
            </div>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-dashed">
          Belum ada modul. Klik &quot;Tambah Modul&quot; untuk membuat modul pertama.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
              {editingId === m.id ? (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center text-white">
                        <Folder className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Ubah Modul</h3>
                        <p className="text-xs text-gray-500">Perbarui detail modul lalu simpan perubahan.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm text-gray-600">Judul Modul *</label>
                      <input
                        value={eTitle}
                        onChange={e => setETitle(e.target.value)}
                        placeholder="Judul minimal 3 karakter"
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Deskripsi</label>
                      <input
                        value={eDescription}
                        onChange={e => setEDescription(e.target.value)}
                        placeholder="Opsional"
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Label Durasi</label>
                      <input
                        value={eDurationLabel}
                        onChange={e => setEDurationLabel(e.target.value)}
                        placeholder="mis. 4–6 minggu"
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Durasi (menit)</label>
                      <input
                        type="number"
                        min={0}
                        value={eDurationMinutes}
                        onChange={e => setEDurationMinutes(e.target.value)}
                        placeholder="mis. 120"
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Jumlah Pelajaran</label>
                      <input
                        type="number"
                        min={0}
                        value={eLessons}
                        onChange={e => setELessons(e.target.value)}
                        placeholder="mis. 10"
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>                    <div>
                      <label className="text-sm text-gray-600">Kategori</label>
                      <input
                        value={eCategory}
                        onChange={e => setECategory(e.target.value)}
                        placeholder="mis. Kesehatan Ibu"
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        id={`published-${m.id}`}
                        type="checkbox"
                        checked={ePublished}
                        onChange={e => setEPublished(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor={`published-${m.id}`} className="text-sm text-gray-700">Terbitkan</label>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(m)}
                      disabled={eSubmitting}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow disabled:opacity-60"
                    >
                      {eSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header Section with Status Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center text-white shadow-lg">
                        <Folder className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">{m.title}</h3>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${m.published
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                            {m.published ? (
                              <>
                                <Check className="w-3 h-3" />
                                Terbit
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                Draft
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {m.description || 'Tidak ada deskripsi'}
                        </p>

                        {/* Module Info Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {m.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                              <Folder className="w-3 h-3 mr-1" />
                              {m.category}
                            </span>
                          )}
                          {(m.duration_minutes || m.duration_label) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {m.duration_label || `${m.duration_minutes} menit`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 ml-2">
                      {editingId !== m.id && (
                        <button
                          onClick={() => beginEdit(m)}
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors group"
                          title="Ubah Modul"
                        >
                          <Edit className="w-4 h-4 text-green-600 group-hover:text-green-700" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteModule(m)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
                        title="Hapus Modul"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                      </button>
                    </div>
                  </div>

                  {/* Content Navigation Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href={`/admin/modul/${encodeURIComponent(m.id)}/materi`}
                      className="group relative rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500 grid place-items-center text-white shadow-md group-hover:bg-blue-600 transition-colors">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700">Materi</div>
                            <div className="text-xs text-gray-600">Kelola konten pembelajaran</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 group-hover:text-blue-700">
                            {modulesCounts[String(m.id)]?.materials ?? m.materiCount ?? m.materials_count ?? 0}
                          </div>
                          <div className="text-xs text-gray-500">Materi</div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={`/admin/modul/${encodeURIComponent(m.id)}/kuis`}
                      className="group relative rounded-xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 hover:border-purple-200 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500 grid place-items-center text-white shadow-md group-hover:bg-purple-600 transition-colors">
                            <ListChecks className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-purple-700">Kuis</div>
                            <div className="text-xs text-gray-600">Evaluasi pembelajaran</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700">
                            {modulesCounts[String(m.id)]?.quiz ?? m.quizCount ?? m.quiz_count ?? 0}
                          </div>
                          <div className="text-xs text-gray-500">Kuis</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}