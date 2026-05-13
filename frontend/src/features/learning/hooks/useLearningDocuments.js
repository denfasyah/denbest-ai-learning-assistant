import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLearningStore } from "../store/learningStore";
import Swal from "sweetalert2";

const useLearningDocuments = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("new-upload");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  const {
    workspaces,
    isLoading,
    isUploading,
    uploadProgress,
    error,
    fetchWorkspaces,
    uploadAndCreateWorkspace,
    removeWorkspace,
    updateWorkspaceTitle,
  } = useLearningStore();

  useEffect(() => {
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const documents = workspaces || [];

  console.log("documents:", documents);
  console.log("workspaces dari store:", workspaces);

  // search filter
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    if (search) {
      filtered = filtered.filter((doc) =>
        doc.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return filtered;
  }, [documents, search]);

  // pagination
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

 const handleUpload = async (eventOrFile) => {
  try {
    let file;
    if (eventOrFile?.target?.files) {
      file = eventOrFile.target.files[0];
    } else {
      file = eventOrFile;
    }
    if (!file) return;

    await uploadAndCreateWorkspace(file);
    // await fetchWorkspaces();

    Swal.fire({
      icon: "success",
      title: "Upload Berhasil",
      text: `"${file.name}" berhasil diupload!`,
      confirmButtonColor: "#3b82f6",
      background: "#050816",
      color: "#fff",
      backdrop: `rgba(0,0,0,0.45) blur(80px)`,
      customClass: {
        popup: "rounded-3xl border border-white/10 shadow-2xl",
        title: "text-white",
        htmlContainer: "text-slate-300",
      },
    });
    navigate("/learning");

  } catch (error) {
    // ← TAMBAHKAN INI
    if (error.response?.status === 409) {
       Swal.fire({
      icon: "error",
      title: "file sudah pernah di uplaod",
      confirmButtonColor: "#3b82f6",
      background: "#050816",
      color: "#fff",
      backdrop: `rgba(0,0,0,0.45) blur(80px)`,
      customClass: {
        popup: "rounded-3xl border border-white/10 shadow-2xl",
        title: "text-white",
        htmlContainer: "text-slate-300",
      },
    }); // "File X sudah pernah diupload"
    } else {
       Swal.fire({
      icon: "error",
      title: "Upload Gagal",
      confirmButtonColor: "#3b82f6",
      background: "#050816",
      color: "#fff",
      backdrop: `rgba(0,0,0,0.45) blur(80px)`,
      customClass: {
        popup: "rounded-3xl border border-white/10 shadow-2xl",
        title: "text-white",
        htmlContainer: "text-slate-300",
      },
    });
    }
  }
};

  const handleDelete = async (workspaceId) => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Hapus Workspace?",
    text: "Workspace dan semua dokumennya akan dihapus permanen.",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    background: "#050816",
    color: "#fff",
    backdrop: `rgba(0,0,0,0.45) blur(80px)`,
    customClass: {
      popup: "rounded-3xl border border-white/10 shadow-2xl",
      title: "text-white",
      htmlContainer: "text-slate-300",
    },
  });

  if (!result.isConfirmed) return;

  await removeWorkspace(workspaceId);

  // Fix pagination bug
  const { workspaces } = useLearningStore.getState();
  const newTotalPages = Math.ceil(workspaces.length / ITEMS_PER_PAGE);
  if (currentPage > newTotalPages && newTotalPages > 0) {
    setCurrentPage(newTotalPages);
  }

  Swal.fire({
    icon: "success",
    title: "Terhapus!",
    text: "Workspace berhasil dihapus.",
    confirmButtonColor: "#3b82f6",
    background: "#050816",
    color: "#fff",
    backdrop: `rgba(0,0,0,0.45) blur(80px)`,
    customClass: {
      popup: "rounded-3xl border border-white/10 shadow-2xl",
      title: "text-white",
      htmlContainer: "text-slate-300",
    },
  });
};

  const handleRename = async (workspaceId) => {
  const result = await Swal.fire({
    title: "Rename Workspace",
    input: "text",
    inputPlaceholder: "Masukkan nama baru...",
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
    background: "#050816",
    color: "#fff",
    backdrop: `rgba(0,0,0,0.45) blur(80px)`,
    customClass: {
      popup: "rounded-3xl border border-white/10 shadow-2xl",
      title: "text-white",
      input: "bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2",
    },
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return "Nama tidak boleh kosong!";
      }
    },
  });

  if (!result.isConfirmed) return;

  await updateWorkspaceTitle(workspaceId, result.value.trim());
};

  // placeholder dulu
  const handleFavorite = () => {};

  const formatTime = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleDateString();
  };

  return {
    documents,

    search,
    setSearch,

    filter,
    setFilter,

    currentPage,
    setCurrentPage,

    totalPages,

    filteredDocuments,
    paginatedDocuments,

    isLoading,
    isUploading,
    uploadProgress,
    error,

    handleUpload,
    handleDelete,
    handleRename,
    handleFavorite,

    formatTime,
  };
};

export default useLearningDocuments;
