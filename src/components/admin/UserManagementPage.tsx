"use client";

import { useState, useEffect, useCallback } from "react";
import { usersAPI, type Profile, type VisibilityRules } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import { Users } from "lucide-react";

// Import sub-components
import UserStatistics from "./user-management/UserStatistics";
import UserSearchBar from "./user-management/UserSearchBar";
import UserTable from "./user-management/UserTable";
import UserFormModal from "./user-management/UserFormModal";
import UserDetailModal from "./user-management/UserDetailModal";

// Import types
import type { User, PaginationData, UserFormData } from "./user-management/types";

export default function UserManagement() {
  const searchParams = useSearchParams();
  const roleFromUrl = searchParams?.get("role") || "";
  const { profile: currentProfile } = useAuth();

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
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    full_name: "",
    phone: "",
    role: "pengguna",
    password: "",
    address: "",
    date_of_birth: "",
    profil_url: "",
  });

  // Validation helpers
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone: string) => {
    return /^\+?\d{9,15}$/.test(phone.replace(/\s|-/g, ""));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = "Format email tidak valid";
    }
    if (!formData.full_name || formData.full_name.length < 2) {
      errors.full_name = "Nama lengkap minimal 2 karakter";
    }
    if (!formData.phone) {
      errors.phone = "Nomor telepon harus diisi";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Format nomor telepon tidak valid";
    }
    if (!isEditModalOpen && (!formData.password || formData.password.length < 6)) {
      errors.password = "Password minimal 6 karakter";
    }
    if (formData.address && formData.address.length > 500) {
      errors.address = "Alamat maksimal 500 karakter";
    }
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (birthDate > today) {
        errors.date_of_birth = "Tanggal lahir tidak boleh di masa depan";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch users
  const fetchUsers = useCallback(
    async (page = 1, search = "", role = "", limit: number | "all" = 10) => {
      setLoading(true);
      try {
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
        console.error("❌ Error fetching users:", error);
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
  }, [searchTerm, roleFilter, itemsPerPage]);

  // Handler functions
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleItemsPerPageChange = (value: string) => {
    const newValue = value === "all" ? "all" : parseInt(value);
    setItemsPerPage(newValue);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchUsers(newPage, searchTerm, roleFilter, itemsPerPage);
    }
  };

  const handleAddUser = () => {
    const defaultRole = roleFilter === "admin" ? "admin" : "pengguna";
    setFormData({
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
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
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
          <p class="text-slate-700 mb-3">Apakah Anda yakin ingin menghapus pengguna:</p>
          <div class="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border-2 border-slate-200 mt-2">
            <p class="text-slate-800"><strong class="text-[#27548A]">Nama:</strong> ${user.full_name}</p>
            <p class="text-slate-800 mt-1"><strong class="text-[#27548A]">Email:</strong> ${user.email}</p>
          </div>
          <p class="text-red-600 text-sm mt-3 font-medium">⚠️ Tindakan ini tidak dapat dibatalkan!</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        title: "text-slate-800 font-semibold",
        confirmButton: "rounded-xl px-6 py-3 font-semibold",
        cancelButton: "rounded-xl px-6 py-3 font-semibold",
      },
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Menghapus...",
          text: "Sedang menghapus pengguna",
          allowOutsideClick: false,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-2xl",
            title: "text-slate-800 font-semibold",
          },
          willOpen: () => {
            Swal.showLoading();
          },
        });

        const deleteResult = await usersAPI.remove(user.id);

        if (!deleteResult.ok) {
          throw new Error(deleteResult.error || "Gagal menghapus pengguna");
        }

        await Swal.fire({
          icon: "success",
          title: "Berhasil Dihapus!",
          html: `
            <div class="text-center">
              <p class="text-slate-700 mb-2">Pengguna <strong class="text-[#27548A]">"${user.full_name}"</strong> berhasil dihapus dari sistem</p>
            </div>
          `,
          confirmButtonColor: "#27548A",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "rounded-2xl",
            title: "text-green-600 font-semibold",
            confirmButton:
              "rounded-xl px-6 py-3 font-semibold bg-gradient-to-r from-[#27548A] to-[#578FCA]",
          },
        });

        fetchUsers(pagination.page, searchTerm, roleFilter, itemsPerPage);
      } catch (error) {
        console.error("Error deleting user:", error);
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Gagal menghapus pengguna. Silakan coba lagi.",
          confirmButtonColor: "#27548A",
          customClass: {
            popup: "rounded-2xl",
            title: "text-red-600 font-semibold",
            confirmButton: "rounded-xl px-6 py-3 font-semibold",
          },
        });
      }
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const isEditing = isEditModalOpen;

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
        const updatePayload: {
          full_name: string;
          email: string;
          phone: string;
          address?: string;
          date_of_birth?: string;
          profil_url?: string;
        } = {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || undefined,
          date_of_birth: formData.date_of_birth || undefined,
          profil_url: formData.profil_url || undefined,
        };

        const updateResult = await usersAPI.update(selectedUser.id, updatePayload);

        if (!updateResult.ok) {
          throw new Error(updateResult.error || "Gagal mengupdate pengguna");
        }

        if (formData.role !== selectedUser.role) {
          const roleResult = await usersAPI.updateRole(selectedUser.id, formData.role);
          if (!roleResult.ok) {
            throw new Error(roleResult.error || "Gagal mengupdate role pengguna");
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
        const createResult = await usersAPI.create({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role,
          address: formData.address || undefined,
          date_of_birth: formData.date_of_birth || undefined,
          profil_url: formData.profil_url || undefined,
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

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setFormData({
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

  const handleFormChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Statistics
  const totalUsers = pagination.total;
  const adminUsers = users.filter(
    (user) => user.role === "admin" || user.role === "superadmin"
  ).length;

  const canManageAdmin = Boolean(visibility?.allowed_roles?.includes("admin"));
  const isSelf = (u: User) => currentProfile?.id === u.id;

  // Page title based on role filter
  const pageTitle =
    roleFilter === "admin"
      ? "Kelola Ketua Posyandu / Admin"
      : roleFilter === "pengguna"
      ? "Kelola Kader"
      : "Kelola Pengguna";
  const pageSubtitle =
    roleFilter === "admin"
      ? "Manajemen ketua posyandu dan admin sistem"
      : roleFilter === "pengguna"
      ? "Manajemen kader posyandu"
      : "Manajemen pengguna dan admin sistem";

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-2xl shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-[#27548A]">{pageTitle}</h1>
          <p className="text-slate-600 text-sm mt-1">{pageSubtitle}</p>
        </div>
      </div>

      {/* Statistics */}
      <UserStatistics
        totalUsers={totalUsers}
        adminUsers={adminUsers}
        roleFilter={roleFilter}
      />

      {/* Search and Actions Bar */}
      <UserSearchBar
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        roleFromUrl={roleFromUrl}
        canManageAdmin={canManageAdmin}
        onSearch={handleSearch}
        onRoleFilter={handleRoleFilter}
        onAddUser={handleAddUser}
      />

      {/* Users Table */}
      <UserTable
        users={users}
        loading={loading}
        searchTerm={searchTerm}
        pagination={pagination}
        itemsPerPage={itemsPerPage}
        isSelf={isSelf}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Add/Edit User Modal */}
      <UserFormModal
        isOpen={isAddModalOpen || isEditModalOpen}
        isEditMode={isEditModalOpen}
        formData={formData}
        formErrors={formErrors}
        roleFilter={roleFilter}
        canManageAdmin={canManageAdmin}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        onSubmit={handleSubmitUser}
        onChange={handleFormChange}
      />

      {/* View User Detail Modal */}
      <UserDetailModal
        isOpen={isViewModalOpen}
        user={selectedUser}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
}
