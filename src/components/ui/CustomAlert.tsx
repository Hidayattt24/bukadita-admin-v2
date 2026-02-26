"use client";

import Swal, { SweetAlertOptions } from "sweetalert2";

// Custom styles for SweetAlert with brand colors
const getCustomStyles = () => `
  .swal2-popup {
    border-radius: 24px !important;
    padding: 2rem !important;
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(39, 84, 138, 0.1) !important;
    box-shadow: 0 20px 60px rgba(39, 84, 138, 0.15) !important;
  }

  .swal2-title {
    font-size: 1.75rem !important;
    font-weight: 700 !important;
    color: #27548A !important;
    margin-bottom: 0.5rem !important;
    font-family: 'Poppins', sans-serif !important;
  }

  .swal2-html-container {
    font-size: 1rem !important;
    color: #64748b !important;
    line-height: 1.6 !important;
    margin: 1rem 0 1.5rem !important;
    font-family: 'Poppins', sans-serif !important;
  }

  .swal2-icon {
    margin: 1.5rem auto 1rem !important;
    border-width: 3px !important;
  }

  .swal2-icon.swal2-success {
    border-color: #10b981 !important;
  }

  .swal2-icon.swal2-success .swal2-success-ring {
    border-color: rgba(16, 185, 129, 0.3) !important;
  }

  .swal2-icon.swal2-success [class^='swal2-success-line'] {
    background-color: #10b981 !important;
  }

  .swal2-icon.swal2-error {
    border-color: #ef4444 !important;
  }

  .swal2-icon.swal2-error [class^='swal2-x-mark-line'] {
    background-color: #ef4444 !important;
  }

  .swal2-icon.swal2-warning {
    border-color: #f59e0b !important;
    color: #f59e0b !important;
  }

  .swal2-icon.swal2-info {
    border-color: #3b82f6 !important;
    color: #3b82f6 !important;
  }

  .swal2-confirm {
    background: linear-gradient(91deg, #27548A 1.11%, #578FCA 105.6%) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 0.875rem 2rem !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 12px rgba(39, 84, 138, 0.3) !important;
    transition: all 0.2s ease !important;
    font-family: 'Poppins', sans-serif !important;
  }

  .swal2-confirm:hover {
    box-shadow: 0 6px 20px rgba(39, 84, 138, 0.4) !important;
    transform: translateY(-2px) !important;
  }

  .swal2-confirm:focus {
    box-shadow: 0 0 0 3px rgba(87, 143, 202, 0.3) !important;
  }

  .swal2-cancel {
    background: #e2e8f0 !important;
    color: #475569 !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 0.875rem 2rem !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    margin-right: 0.75rem !important;
    transition: all 0.2s ease !important;
    font-family: 'Poppins', sans-serif !important;
  }

  .swal2-cancel:hover {
    background: #cbd5e1 !important;
  }

  .swal2-actions {
    margin-top: 1.5rem !important;
    gap: 0.75rem !important;
  }

  .swal2-timer-progress-bar {
    background: linear-gradient(91deg, #27548A 1.11%, #578FCA 105.6%) !important;
  }

  /* Danger/Delete variant */
  .swal2-popup.swal2-danger .swal2-confirm {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%) !important;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3) !important;
  }

  .swal2-popup.swal2-danger .swal2-confirm:hover {
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4) !important;
  }

  .swal2-popup.swal2-danger .swal2-title {
    color: #dc2626 !important;
  }

  /* Success variant */
  .swal2-popup.swal2-success-custom .swal2-title {
    color: #059669 !important;
  }

  @media (max-width: 640px) {
    .swal2-popup {
      padding: 1.5rem !important;
      width: 90% !important;
    }

    .swal2-title {
      font-size: 1.5rem !important;
    }

    .swal2-html-container {
      font-size: 0.9rem !important;
    }
  }
`;

// Inject custom styles
if (typeof window !== "undefined") {
  const styleId = "custom-swal-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = getCustomStyles();
    document.head.appendChild(style);
  }
}

type CustomAlertOptions = Partial<SweetAlertOptions>;

export const showAlert = {
  success: (title: string, text?: string, options?: CustomAlertOptions) => {
    return Swal.fire({
      ...options,
      icon: "success",
      title,
      text,
      confirmButtonText: "OK",
    } as SweetAlertOptions);
  },

  error: (title: string, text?: string, options?: CustomAlertOptions) => {
    return Swal.fire({
      ...options,
      icon: "error",
      title,
      text,
      confirmButtonText: "OK",
    } as SweetAlertOptions);
  },

  warning: (title: string, text?: string, options?: CustomAlertOptions) => {
    return Swal.fire({
      ...options,
      icon: "warning",
      title,
      text,
      confirmButtonText: "OK",
    } as SweetAlertOptions);
  },

  info: (title: string, text?: string, options?: CustomAlertOptions) => {
    return Swal.fire({
      ...options,
      icon: "info",
      title,
      text,
      confirmButtonText: "OK",
    } as SweetAlertOptions);
  },

  confirm: (title: string, text?: string, options?: CustomAlertOptions) => {
    return Swal.fire({
      ...options,
      icon: "warning",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Ya, Lanjutkan",
      cancelButtonText: "Batal",
    } as SweetAlertOptions);
  },

  loading: (title: string = "Memproses...", text?: string) => {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  close: () => {
    Swal.close();
  },

  // Modern styled alerts for specific use cases
  deleteBlock: () => {
    return Swal.fire({
      title: "Hapus Blok? 🗑️",
      html: '<p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Apakah Anda yakin ingin menghapus blok ini? Tindakan ini tidak dapat dibatalkan.</p>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: '<span style="font-weight: 600;">✓ Ya, Hapus</span>',
      cancelButtonText: '<span style="font-weight: 600;">✕ Batal</span>',
      reverseButtons: true,
      customClass: {
        popup: "swal2-danger rounded-2xl shadow-2xl border-2 border-gray-100",
        title: "text-2xl font-bold",
        htmlContainer: "text-base",
        confirmButton:
          "px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
        cancelButton:
          "px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300",
      },
      buttonsStyling: true,
    });
  },

  deleteSuccess: () => {
    return Swal.fire({
      title: "Berhasil! ✓",
      html: '<p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Blok tersebut telah berhasil dihapus dari konten.</p>',
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: "swal2-success-custom rounded-2xl shadow-2xl border-2 border-green-100",
      },
    });
  },

  logoutConfirm: () => {
    return Swal.fire({
      title: "Keluar dari Area Admin?",
      html: '<p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Apakah Anda yakin ingin keluar dari aplikasi?</p>',
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#27548A",
      cancelButtonColor: "#6b7280",
      confirmButtonText: '<span style="font-weight: 600;">✓ Ya, Keluar</span>',
      cancelButtonText: '<span style="font-weight: 600;">✕ Tetap Disini</span>',
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl shadow-2xl border-2 border-gray-100",
        title: "text-2xl font-bold",
        htmlContainer: "text-base",
        confirmButton:
          "px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
        cancelButton:
          "px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300",
      },
      buttonsStyling: true,
    });
  },

  logoutSuccess: () => {
    return Swal.fire({
      title: "Berhasil Keluar! ✓",
      html: '<p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Anda telah keluar. Mengalihkan...</p>',
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: "swal2-success-custom rounded-2xl shadow-2xl border-2 border-green-100",
      },
    });
  },
};

export default showAlert;

