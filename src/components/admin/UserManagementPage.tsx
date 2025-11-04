"use client";

import { useState, useEffect, useCallback } from "react";
import { usersAPI, type Profile, type VisibilityRules } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Modal from "@/components/admin/shared/Modal";
import StatCard from "@/components/admin/shared/StatCard";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Mail,
  Phone,
  Shield,
  MapPin,
} from "lucide-react";
import Image from "next/image";

// Perluas tipe Profile dengan field opsional untuk tampilan
interface User extends Profile {
  address?: string;
  date_of_birth?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UserManagement() {
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams?.get("role") || "";

  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(roleFromUrl);
  const [visibility, setVisibility] = useState<VisibilityRules | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newUserData, setNewUserData] = useState({
    email: "",
    full_name: "",
    phone: "",
    role: "pengguna" as "pengguna" | "admin",
    password: "",
    address: "",
    date_of_birth: "",
    profil_url: "",
  });

  // Helpers: validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(String(email).toLowerCase());
  };
  const validatePhone = (phone: string) => {
    // allow digits, optional +, length 9-15
    return /^\+?\d{9,15}$/.test(phone.replace(/\s|-/g, ""));
  };
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!newUserData.email || !validateEmail(newUserData.email)) {
      errors.email = "Format email tidak valid";
    }
    if (!newUserData.full_name || newUserData.full_name.length < 2) {
      errors.full_name = "Nama lengkap minimal 2 karakter";
    }
    if (!newUserData.phone) {
      errors.phone = "Nomor telepon harus diisi";
    } else if (!validatePhone(newUserData.phone)) {
      errors.phone = "Format nomor telepon tidak valid";
    }
    if (
      !isEditModalOpen &&
      (!newUserData.password || newUserData.password.length < 6)
    ) {
      errors.password = "Password minimal 6 karakter";
    }
    // Validasi untuk field opsional
    if (newUserData.address && newUserData.address.length > 500) {
      errors.address = "Alamat maksimal 500 karakter";
    }
    if (newUserData.date_of_birth) {
      const birthDate = new Date(newUserData.date_of_birth);
      const today = new Date();
      if (birthDate > today) {
        errors.date_of_birth = "Tanggal lahir tidak boleh di masa depan";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const { profile: currentProfile } = useAuth();

  // Fetch users from new backend with visibility rules
  const fetchUsers = useCallback(
    async (page = 1, search = "", role = "", limit: number | "all" = 10) => {
      setLoading(true);

      try {
        // If "all" is selected, use a very large limit (e.g., 10000)
        const actualLimit = limit === "all" ? 10000 : limit;
        const res = await usersAPI.list({
          page: limit === "all" ? 1 : page,
          limit: actualLimit,
          search,
          role,
        });

        if (!res.ok) {
          throw new Error(res.error || `Gagal memuat pengguna (${res.status})`);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload = res.data as any;

        const array: Profile[] = payload.items || payload.data || [];

        const transformedUsers: User[] = array.map(
          (u): User => ({
            id: u.id,
            email: u.email || "",
            full_name: u.full_name || "",
            phone: u.phone || "",
            role: u.role,
            created_at: u.created_at,
            address: u.address || undefined,
            date_of_birth: u.date_of_birth || undefined,
            profil_url: u.profil_url || undefined,
          })
        );

        const meta = payload.pagination || {
          page,
          limit: 10,
          total: transformedUsers.length,
          totalPages: 1,
        };

        setUsers(transformedUsers);
        setPagination({
          page: meta.page || meta.currentPage || page,
          limit: meta.limit || 10,
          total: meta.total || meta.totalCount || transformedUsers.length,
          totalPages: meta.totalPages || 1,
        });
        setVisibility(payload.visibility || payload.visibility_rules || null);
      } catch (error) {
        console.error("❌ Error fetching users from backend:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat data pengguna";

        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorMessage,
          confirmButtonColor: "#3b82f6",
        });

        // Set empty state on error
        setUsers([]);
        setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update roleFilter when URL changes
  useEffect(() => {
    if (roleFromUrl !== roleFilter) {
      setRoleFilter(roleFromUrl);
    }
  }, [roleFromUrl, roleFilter]);

  useEffect(() => {
    fetchUsers(pagination.page, searchTerm, roleFilter, itemsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter, itemsPerPage]); // Only trigger on search/filter change, not pagination

  // Handler functions
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const handleItemsPerPageChange = (value: string) => {
    const newValue = value === "all" ? "all" : parseInt(value);
    setItemsPerPage(newValue);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const handleAddUser = () => {
    // Set default role based on current filter
    const defaultRole = roleFilter === "admin" ? "admin" : "pengguna";

    setNewUserData({
      email: "",
      full_name: "",
      phone: "",
      role: defaultRole as "pengguna" | "admin",
      password: "",
      address: "",
      date_of_birth: "",
      profil_url: "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleViewUser = async (user: User) => {
    // Langsung gunakan data user yang sudah ada, tidak perlu API call
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUserData({
      email: user.email,
      full_name: user.full_name,
      phone: user.phone || "",
      role: user.role === "admin" ? "admin" : "pengguna",
      password: "",
      address: user.address || "",
      date_of_birth: user.date_of_birth || "",
      profil_url: user.profil_url || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    const result = await Swal.fire({
      title: "Hapus Pengguna?",
      html: `
        <div class="text-left">
          <p>Apakah Anda yakin ingin menghapus pengguna:</p>
          <div class="bg-gray-100 p-3 rounded-lg mt-2">
            <p><strong>Nama:</strong> ${user.full_name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
          </div>
          <p class="text-red-600 text-sm mt-2">⚠️ Tindakan ini tidak dapat dibatalkan!</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        // Show loading
        Swal.fire({
          title: "Menghapus...",
          text: "Sedang menghapus pengguna",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        // Delete via API (server-side)
        const deleteResult = await usersAPI.remove(user.id);

        if (!deleteResult.ok) {
          throw new Error(deleteResult.error || "Gagal menghapus pengguna");
        }

        // Success
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Pengguna "${user.full_name}" berhasil dihapus`,
          confirmButtonColor: "#10b981",
          timer: 2000,
        });

        // Refresh data
        fetchUsers(pagination.page, searchTerm, roleFilter, itemsPerPage);
      } catch (error) {
        console.error("Error deleting user:", error);
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Gagal menghapus pengguna. Silakan coba lagi.",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      return;
    }

    try {
      const isEditing = isEditModalOpen;

      // Show loading
      Swal.fire({
        title: isEditing ? "Mengupdate..." : "Menambahkan...",
        text: isEditing
          ? "Sedang mengupdate pengguna"
          : "Sedang menambahkan pengguna baru",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      if (isEditing && selectedUser) {
        // Update existing user via API
        const updatePayload: {
          full_name: string;
          email: string;
          phone: string;
          address?: string;
          date_of_birth?: string;
          profil_url?: string;
        } = {
          full_name: newUserData.full_name,
          email: newUserData.email,
          phone: newUserData.phone,
          address: newUserData.address || undefined,
          date_of_birth: newUserData.date_of_birth || undefined,
          profil_url: newUserData.profil_url || undefined,
        };

        const updateResult = await usersAPI.update(
          selectedUser.id,
          updatePayload
        );

        if (!updateResult.ok) {
          throw new Error(updateResult.error || "Gagal mengupdate pengguna");
        }

        // Update role if changed (using separate endpoint)
        if (newUserData.role !== selectedUser.role) {
          const roleResult = await usersAPI.updateRole(
            selectedUser.id,
            newUserData.role
          );
          if (!roleResult.ok) {
            throw new Error(
              roleResult.error || "Gagal mengupdate role pengguna"
            );
          }
        }

        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data pengguna berhasil diupdate",
          confirmButtonColor: "#10b981",
          timer: 2000,
        });
      } else {
        // Create new user via API (server-side creates auth + profile)
        const createResult = await usersAPI.create({
          email: newUserData.email,
          password: newUserData.password,
          full_name: newUserData.full_name,
          phone: newUserData.phone,
          role: newUserData.role,
          address: newUserData.address || undefined,
          date_of_birth: newUserData.date_of_birth || undefined,
          profil_url: newUserData.profil_url || undefined,
        });

        if (!createResult.ok) {
          throw new Error(createResult.error || "Gagal menambahkan pengguna");
        }

        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Pengguna baru berhasil ditambahkan",
          confirmButtonColor: "#10b981",
          timer: 2000,
        });
      }

      // Close modals and refresh data
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setNewUserData({
        email: "",
        full_name: "",
        phone: "",
        role: "pengguna",
        password: "",
        address: "",
        date_of_birth: "",
        profil_url: "",
      });
      setFormErrors({});
      fetchUsers(pagination.page, searchTerm, roleFilter, itemsPerPage);
    } catch (error: unknown) {
      console.error("Error saving user:", error);

      let errorMessage = "Gagal menyimpan data pengguna. Silakan coba lagi.";

      if (error && typeof error === "object" && "message" in error) {
        const apiError = error as { message: string };
        errorMessage = apiError.message;
      }

      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  // Helper functions
  const getAvatarText = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Format tidak valid";

    // Simple date format
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getNestedValue = (obj: User, key: string): unknown => {
    if (key.includes(".")) {
      const keys = key.split(".");
      let value: unknown = obj;
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
        if (value === undefined) break;
      }
      return value;
    }
    return (obj as unknown as Record<string, unknown>)[key];
  };

  const columns = [
    {
      key: "avatar",
      label: "Avatar",
      render: (_: unknown, row: User) => (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
          {getAvatarText(row.full_name)}
        </div>
      ),
    },
    {
      key: "profile.full_name",
      label: "Nama Lengkap",
      render: (_: unknown, row: User) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.full_name || "Tidak ada nama"}
          </div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: "profile.phone",
      label: "Telepon",
      render: (_: unknown, row: User) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{row.phone || "-"}</span>
        </div>
      ),
    },
    {
      key: "profile.role",
      label: "Role",
      render: (_: unknown, row: User) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          <Shield className="w-3 h-3 mr-1" />
          {row.role === "admin"
            ? "Admin"
            : row.role === "superadmin"
            ? "Superadmin"
            : "Pengguna"}
        </span>
      ),
    },
    {
      key: "profile.created_at",
      label: "Registrasi",
      render: (_: unknown, row: User) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{formatDate(row.created_at)}</span>
        </div>
      ),
    },
  ];

  const canManageAdmin = Boolean(visibility?.allowed_roles?.includes("admin"));
  const isSelf = (u: User) => currentProfile?.id === u.id;

  const actionButtons = (user: User) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleViewUser(user)}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Lihat Detail"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleEditUser(user)}
        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteUser(user)}
        className={`p-1 rounded transition-colors ${
          isSelf(user)
            ? "text-gray-400 cursor-not-allowed"
            : "text-red-600 hover:bg-red-50"
        }`}
        title={isSelf(user) ? "Tidak dapat menghapus akun sendiri" : "Hapus"}
        disabled={isSelf(user)}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  // Statistics
  const totalUsers = pagination.total;
  const adminUsers = users.filter(
    (user) => user.role === "admin" || user.role === "superadmin"
  ).length;
  const regularUsers = users.filter((user) => user.role === "pengguna").length;

  // Page title based on role filter
  const pageTitle =
    roleFilter === "admin"
      ? "Kelola Admin"
      : roleFilter === "pengguna"
      ? "Kelola Pengguna"
      : "Kelola Pengguna";
  const pageSubtitle =
    roleFilter === "admin"
      ? "Manajemen admin sistem"
      : roleFilter === "pengguna"
      ? "Manajemen pengguna biasa"
      : "Manajemen pengguna dan admin sistem";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
          </div>
        </div>
        <p className="text-gray-600">{pageSubtitle}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Pengguna"
          value={totalUsers}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Admin"
          value={adminUsers}
          icon={Shield}
          color="purple"
        />

        <StatCard
          title="Pengguna Biasa"
          value={regularUsers}
          icon={Users}
          color="green"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau nomor hp..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border text-black/60 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />
            </div>

            {/* Filter - Only show if no role filter from URL */}
            {!roleFromUrl && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={roleFilter}
                  onChange={(e) => handleRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Semua Role</option>
                  <option value="pengguna">Pengguna</option>
                  {canManageAdmin && <option value="admin">Admin</option>}
                </select>
              </div>
            )}
          </div>

          {/* Add User Button */}
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {roleFilter === "admin"
              ? "Tambah Admin"
              : roleFilter === "pengguna"
              ? "Tambah Pengguna"
              : canManageAdmin
              ? "Tambah Pengguna/Admin"
              : "Tambah Pengguna"}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Memuat data pengguna...</div>
          </div>
        ) : (
          <div className="overflow-x-auto text-black">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {column.render
                          ? column.render(
                              getNestedValue(user, column.key),
                              user
                            )
                          : String(getNestedValue(user, column.key) || "")}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {actionButtons(user)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Items Per Page Selector & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-black px-6 py-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-3">
            <label
              htmlFor="itemsPerPage"
              className="text-sm text-gray-700 whitespace-nowrap"
            >
              Tampilkan:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">Semua</option>
            </select>
            <span className="text-sm text-gray-700">
              {itemsPerPage === "all"
                ? `Menampilkan semua ${pagination.total} pengguna`
                : `Menampilkan ${Math.min(
                    (pagination.page - 1) * pagination.limit + 1,
                    pagination.total
                  )} - ${Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )} dari ${pagination.total} pengguna`}
            </span>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={
          roleFilter === "admin" ? "Tambah Admin Baru" : "Tambah Pengguna Baru"
        }
        size="lg"
      >
        <form onSubmit={handleSubmitUser} className="space-y-4 text-black/80">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="contoh@email.com"
                required
              />
            </div>
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={newUserData.full_name}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  full_name: e.target.value,
                }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.full_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan nama lengkap"
              required
            />
            {formErrors.full_name && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.full_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                value={newUserData.phone}
                onChange={(e) =>
                  setNewUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="08123456789"
                required
              />
            </div>
            {formErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={newUserData.role}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  role: e.target.value as "pengguna" | "admin",
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="pengguna">Pengguna</option>
              {canManageAdmin && <option value="admin">Admin</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Minimal 6 karakter"
              required
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat (Opsional)
            </label>
            <textarea
              value={newUserData.address}
              onChange={(e) =>
                setNewUserData((prev) => ({ ...prev, address: e.target.value }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                formErrors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan alamat lengkap (maksimal 500 karakter)"
              rows={3}
              maxLength={500}
            />
            {formErrors.address && (
              <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {newUserData.address.length}/500 karakter
            </p>
          </div>

          {/* Date of Birth Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Lahir (Opsional)
            </label>
            <input
              type="date"
              value={newUserData.date_of_birth}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  date_of_birth: e.target.value,
                }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.date_of_birth ? "border-red-500" : "border-gray-300"
              }`}
              max={new Date().toISOString().split("T")[0]} // Tidak boleh di masa depan
            />
            {formErrors.date_of_birth && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.date_of_birth}
              </p>
            )}
          </div>

          {/* Profile URL Field - Add */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Foto Profil (Opsional)
            </label>
            <input
              type="url"
              value={newUserData.profil_url}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  profil_url: e.target.value,
                }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.profil_url ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/profile.jpg"
            />
            {formErrors.profil_url && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.profil_url}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {roleFilter === "admin" ? "Tambah Admin" : "Tambah Pengguna"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Pengguna"
        size="lg"
      >
        <form onSubmit={handleSubmitUser} className="space-y-4 text-black/80">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="contoh@email.com"
                required
              />
            </div>
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={newUserData.full_name}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  full_name: e.target.value,
                }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.full_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan nama lengkap"
              required
            />
            {formErrors.full_name && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.full_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                value={newUserData.phone}
                onChange={(e) =>
                  setNewUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={`pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="08123456789"
                required
              />
            </div>
            {formErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={newUserData.role}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  role: e.target.value as "pengguna" | "admin",
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="pengguna">Pengguna</option>
              {canManageAdmin && <option value="admin">Admin</option>}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kosongkan jika tidak ingin mengubah password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kosongkan jika tidak ingin mengubah password
            </p>
          </div>

          {/* Address Field - Edit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat (Opsional)
            </label>
            <textarea
              value={newUserData.address}
              onChange={(e) =>
                setNewUserData((prev) => ({ ...prev, address: e.target.value }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                formErrors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan alamat lengkap (maksimal 500 karakter)"
              rows={3}
              maxLength={500}
            />
            {formErrors.address && (
              <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {newUserData.address.length}/500 karakter
            </p>
          </div>

          {/* Date of Birth Field - Edit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Lahir (Opsional)
            </label>
            <input
              type="date"
              value={newUserData.date_of_birth}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  date_of_birth: e.target.value,
                }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.date_of_birth ? "border-red-500" : "border-gray-300"
              }`}
              max={new Date().toISOString().split("T")[0]} // Tidak boleh di masa depan
            />
            {formErrors.date_of_birth && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.date_of_birth}
              </p>
            )}
          </div>

          {/* Profile URL Field - Edit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Foto Profil (Opsional)
            </label>
            <input
              type="url"
              value={newUserData.profil_url}
              onChange={(e) =>
                setNewUserData((prev) => ({
                  ...prev,
                  profil_url: e.target.value,
                }))
              }
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.profil_url ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/profile.jpg"
            />
            {formErrors.profil_url && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.profil_url}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Pengguna
            </button>
          </div>
        </form>
      </Modal>

      {/* View User Detail Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detail Pengguna"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6 text-black/80">
            {/* User Basic Info */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {getAvatarText(selectedUser.full_name)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedUser.full_name}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {selectedUser.role === "admin"
                      ? "Admin"
                      : selectedUser.role === "superadmin"
                      ? "Superadmin"
                      : "Pengguna"}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Nomor Telepon
                  </span>
                </div>
                <p className="text-gray-900">
                  {selectedUser.phone || "Tidak ada nomor telepon"}
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Email
                  </span>
                </div>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Tanggal Registrasi
                  </span>
                </div>
                <p className="text-gray-900">
                  {formatDate(selectedUser.created_at)}
                </p>
              </div>

              {/* Address Field */}
              <div className="p-4 border border-gray-200 rounded-lg md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Alamat
                  </span>
                </div>
                <p className="text-gray-900">
                  {selectedUser.address || "Tidak ada alamat"}
                </p>
              </div>

              {/* Date of Birth Field */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Tanggal Lahir
                  </span>
                </div>
                <p className="text-gray-900">
                  {formatDate(selectedUser.date_of_birth || "Belum di isi")}
                </p>
              </div>

              {/* Profile Photo URL */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Foto Profil
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={selectedUser.profil_url || "/default-profile.png"}
                    alt="Foto Profil"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={() => {
                      // Handle error silently
                    }}
                  />
                  <a
                    href={selectedUser.profil_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm underline"
                  >
                    <button className="p-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg">
                      Lihat Foto Lengkap
                    </button>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
