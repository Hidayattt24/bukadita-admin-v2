# User Management Components

Komponen-komponen untuk halaman manajemen pengguna yang telah dipecah menjadi beberapa file untuk meningkatkan maintainability dan reusability.

## Struktur Komponen

### 1. `types.ts`
File yang berisi definisi tipe TypeScript yang digunakan di seluruh komponen user management.

**Exports:**
- `User` - Interface untuk data pengguna
- `PaginationData` - Interface untuk data pagination
- `UserFormData` - Interface untuk data form pengguna

### 2. `UserStatistics.tsx`
Komponen untuk menampilkan statistik pengguna dalam bentuk card.

**Props:**
- `totalUsers: number` - Total jumlah pengguna
- `adminUsers: number` - Jumlah admin/ketua posyandu
- `roleFilter: string` - Filter role yang aktif

**Features:**
- Menampilkan total pengguna
- Menampilkan jumlah admin (hanya jika roleFilter === "admin")
- Animasi hover
- Gradient background

### 3. `UserSearchBar.tsx`
Komponen untuk search bar dan filter pengguna.

**Props:**
- `searchTerm: string` - Kata kunci pencarian
- `roleFilter: string` - Filter role yang dipilih
- `roleFromUrl: string` - Role dari URL parameter
- `canManageAdmin: boolean` - Apakah user bisa manage admin
- `onSearch: (value: string) => void` - Handler untuk search
- `onRoleFilter: (role: string) => void` - Handler untuk filter role
- `onAddUser: () => void` - Handler untuk tambah user

**Features:**
- Search input dengan icon
- Dropdown filter role (hanya tampil jika tidak ada roleFromUrl)
- Tombol tambah pengguna dengan label dinamis

### 4. `UserTable.tsx`
Komponen untuk menampilkan tabel pengguna dengan pagination.

**Props:**
- `users: User[]` - Array data pengguna
- `loading: boolean` - Status loading
- `searchTerm: string` - Kata kunci pencarian (untuk empty state)
- `pagination: PaginationData` - Data pagination
- `itemsPerPage: number | "all"` - Jumlah item per halaman
- `isSelf: (user: User) => boolean` - Fungsi untuk cek apakah user adalah diri sendiri
- `onView: (user: User) => void` - Handler untuk view detail
- `onEdit: (user: User) => void` - Handler untuk edit
- `onDelete: (user: User) => void` - Handler untuk delete
- `onPageChange: (page: number) => void` - Handler untuk ganti halaman
- `onItemsPerPageChange: (value: string) => void` - Handler untuk ganti items per page

**Features:**
- Tabel responsif dengan kolom: Foto Profil, Nama, Telepon, Role, Registrasi, Aksi
- Menampilkan foto profil user real-time jika tersedia (profil_url)
- Fallback ke avatar inisial nama jika foto tidak tersedia atau gagal dimuat
- Loading state dengan spinner
- Empty state dengan animasi
- Pagination dengan dropdown items per page
- Action buttons: View, Edit, Delete
- Disable delete button untuk user sendiri

### 5. `UserFormModal.tsx`
Komponen modal untuk form tambah/edit pengguna.

**Props:**
- `isOpen: boolean` - Status modal terbuka/tertutup
- `isEditMode: boolean` - Mode edit atau tambah
- `formData: UserFormData` - Data form
- `formErrors: Record<string, string>` - Error validasi
- `roleFilter: string` - Filter role aktif
- `canManageAdmin: boolean` - Apakah bisa manage admin
- `onClose: () => void` - Handler untuk tutup modal
- `onSubmit: (e: React.FormEvent) => void` - Handler untuk submit form
- `onChange: (field: keyof UserFormData, value: string) => void` - Handler untuk perubahan field

**Features:**
- Form fields: Email, Nama Lengkap, Telepon, Role, Password, Alamat, Tanggal Lahir, URL Foto Profil
- Validasi real-time dengan error messages
- Password optional saat edit mode
- Animasi modal dengan framer-motion
- Gradient header
- Character counter untuk alamat

### 6. `UserDetailModal.tsx`
Komponen modal untuk menampilkan detail pengguna.

**Props:**
- `isOpen: boolean` - Status modal terbuka/tertutup
- `user: User | null` - Data pengguna yang akan ditampilkan
- `onClose: () => void` - Handler untuk tutup modal

**Features:**
- Menampilkan semua informasi pengguna
- Avatar dengan initial
- Badge role dengan warna berbeda
- Grid layout untuk detail
- Preview foto profil dengan link ke foto lengkap
- Format tanggal otomatis

### 7. `UserManagementPage.tsx`
Komponen utama yang mengintegrasikan semua sub-komponen.

**Features:**
- State management untuk semua data
- API integration dengan usersAPI
- Validasi form
- CRUD operations (Create, Read, Update, Delete)
- Search dan filter
- Pagination
- SweetAlert2 untuk konfirmasi dan notifikasi
- Role-based access control

## Cara Penggunaan

```tsx
import UserManagement from "@/components/admin/UserManagementPage";

export default function KelolaPenggunaPage() {
  return <UserManagement />;
}
```

## Dependencies

- `@/lib/api` - API client untuk user operations
- `@/contexts/AuthContext` - Context untuk autentikasi
- `sweetalert2` - Library untuk alert dan konfirmasi
- `framer-motion` - Library untuk animasi
- `lucide-react` - Icon library
- `next/navigation` - Next.js navigation hooks

## Notes

- Semua komponen menggunakan TypeScript untuk type safety
- Styling menggunakan Tailwind CSS
- Komponen responsive untuk mobile dan desktop
- Animasi smooth dengan framer-motion
- Error handling yang comprehensive
