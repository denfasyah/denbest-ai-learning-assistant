// src/hooks/useLogout.js

import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const useLogout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Anda yakin ingin keluar dari akun?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
      background: "#050816",
      color: "#fff",

      backdrop: `
        rgba(0,0,0,0.45)
        blur(12px)
      `,

      customClass: {
        popup:
          "rounded-[28px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();

        Swal.fire({
          title: "Logout Berhasil",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#050816",
          color: "#fff",

          backdrop: `
            rgba(0,0,0,0.45)
            blur(12px)
          `,

          customClass: {
            popup:
              "rounded-[28px] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.55)]",
          },
        });
      }
    });
  };

  return { handleLogout };
};

export default useLogout;