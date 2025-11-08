"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onCustomAction?: (item: T) => void;
  customActionIcon?: React.ReactNode;
  customActionTitle?: string;
  customActionColor?: string;
  searchPlaceholder?: string;
}

export default function DataTable<T = Record<string, unknown>>({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onCustomAction,
  customActionIcon,
  customActionTitle = "Custom Action",
  // customActionColor = "purple-600",
  searchPlaceholder = "Cari data...",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    Object.values(item as Record<string, unknown>).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            Total: {filteredData.length} data
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Add Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          )}
        </div>
      </div>

      {/* Table - Optimized for performance */}
      <div className="overflow-x-auto table-container">
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
              {(onEdit || onDelete || onView || onCustomAction) && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (onEdit || onDelete || onView || onCustomAction ? 1 : 0)
                  }
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {searchTerm
                    ? "Tidak ada data yang sesuai pencarian"
                    : "Belum ada data"}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render((item as Record<string, unknown>)[column.key], item)
                        : String((item as Record<string, unknown>)[column.key] || "")}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView || onCustomAction) && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        {onCustomAction && (
                          <button
                            onClick={() => onCustomAction(item)}
                            className="flex items-center justify-center gap-2 px-3 py-1 w-20 bg-purple-300 text-purple-600 hover:bg-purple-400 rounded"
                            title={customActionTitle}
                          >
                            {customActionIcon || <Plus className="w-4 h-4" />}
                            <p className="text-sm">Poin</p>
                          </button>
                        )}
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="flex items-center justify-center gap-2 px-3 py-1 w-20 bg-blue-300 text-blue-600 hover:bg-blue-400 rounded"
                            title="Lihat"
                          >
                            <Eye className="w-4 h-4" />
                            <p className="text-sm">Lihat</p>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="flex items-center justify-center gap-2 px-3 py-1 w-20 bg-green-300 text-green-600 hover:bg-green-400 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                            <p className="text-sm">Edit</p>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="flex items-center justify-center gap-2 px-3 py-1 w-20 bg-red-300 text-red-600 hover:bg-red-400 rounded"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                            <p className="text-sm">Hapus</p>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Menampilkan {startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
            {filteredData.length} data
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
