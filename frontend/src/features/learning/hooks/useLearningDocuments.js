import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLearningStore } from "../store/learningStore";
import Swal from "sweetalert2";

const swalConfig = {
  background: "#050816",
  color: "#fff",
  confirmButtonColor: "#3b82f6",
  backdrop: `rgba(0,0,0,0.45) blur(80px)`,
  customClass: {
    popup: "rounded-3xl border border-white/10 shadow-2xl",
    title: "text-white",
    htmlContainer: "text-slate-300",
  },
};

const useLearningDocuments = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("new-upload");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadStatus, setUploadStatus] = useState(null); // { current, total, name }

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
    toggleFavoriteAction,
  } = useLearningStore();

  useEffect(() => {
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const documents = workspaces || [];

  // Map and filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents.map((doc) => ({
      ...doc,
      favorite: doc.isFavorite, // Map to what DocumentCard expects
      uploadTime: doc.createdAt, // Map to what DocumentCard expects
    }));

    // Search filter
    if (search) {
      filtered = filtered.filter((doc) =>
        doc.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort/Filter by type
    if (filter === "favorite") {
      filtered = filtered.filter((doc) => doc.favorite);
    } else if (filter === "new-upload") {
      filtered.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
    } else if (filter === "latest-upload") {
      filtered.sort((a, b) => new Date(a.uploadTime) - new Date(b.uploadTime));
    }

    return filtered;
  }, [documents, search, filter]);

  // pagination
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);

  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleUpload = async (eventOrFiles) => {
    let files = [];
    if (eventOrFiles?.target?.files) {
      files = Array.from(eventOrFiles.target.files);
    } else if (eventOrFiles instanceof FileList || eventOrFiles instanceof Array) {
      files = Array.from(eventOrFiles);
    } else if (eventOrFiles instanceof File) {
      files = [eventOrFiles];
    }

    if (files.length === 0) return;

    const results = {
      success: 0,
      failed: [],
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadStatus({ current: i + 1, total: files.length, name: file.name });

      try {
        await uploadAndCreateWorkspace(file);
        results.success++;
      } catch (error) {
        let reason = "Terjadi kesalahan";
        if (error.response?.status === 409) {
          reason = "File sudah pernah diupload";
        } else if (error.response?.data?.message) {
          reason = error.response.data.message;
        }
        results.failed.push({ name: file.name, reason });
      }
    }

    setUploadStatus(null);

    // Show Summary Modal
    const failedText = results.failed
      .map((f) => `• <b>${f.name}</b>: ${f.reason}`)
      .join("<br/>");

    Swal.fire({
      ...swalConfig,
      icon: results.failed.length === 0 ? "success" : "info",
      title: "Upload Selesai",
      html: `
        <div class="text-left space-y-2">
          <p>Berhasil: <span class="text-emerald-400 font-bold">${results.success}</span> file</p>
          ${
            results.failed.length > 0
              ? `<p>Gagal: <span class="text-rose-400 font-bold">${results.failed.length}</span> file</p>
                 <div class="mt-2 text-xs text-slate-400 max-h-32 overflow-y-auto border border-white/5 p-2 rounded-lg bg-black/20">
                   ${failedText}
                 </div>`
              : ""
          }
        </div>
      `,
    });

    if (results.success > 0) {
      navigate("/learning");
    }
  };

  const handleDelete = async (workspaceId) => {
    const result = await Swal.fire({
      ...swalConfig,
      icon: "warning",
      title: "Hapus Workspace?",
      text: "Workspace dan semua dokumennya akan dihapus permanen.",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    await removeWorkspace(workspaceId);

    const { workspaces } = useLearningStore.getState();
    const newTotalPages = Math.ceil(workspaces.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }

    Swal.fire({
      ...swalConfig,
      icon: "success",
      title: "Terhapus!",
      text: "Workspace berhasil dihapus.",
    });
  };

  const handleRename = async (workspaceId) => {
    const result = await Swal.fire({
      ...swalConfig,
      title: "Rename Workspace",
      input: "text",
      inputPlaceholder: "Masukkan nama baru...",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      cancelButtonColor: "#6b7280",
      customClass: {
        ...swalConfig.customClass,
        input: "bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2",
      },
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Nama tidak boleh kosong!";
        }
      },
    });

    if (!result.isConfirmed) return;

    const newTitle = result.value.trim();
    try {
      await updateWorkspaceTitle(workspaceId, newTitle);
      Swal.fire({
        ...swalConfig,
        icon: "success",
        title: "Berhasil!",
        text: `Nama workspace berhasil diubah menjadi "${newTitle}"`,
      });
    } catch (error) {
      if (error.response?.status === 409) {
        Swal.fire({
          ...swalConfig,
          icon: "error",
          title: "Gagal Rename",
          text: "Nama workspace sudah digunakan oleh workspace lain.",
        });
      } else {
        Swal.fire({
          ...swalConfig,
          icon: "error",
          title: "Terjadi Kesalahan",
          text: error.response?.data?.message || "Gagal mengubah nama workspace.",
        });
      }
    }
  };

  const handleFavorite = (workspaceId) => {
    toggleFavoriteAction(workspaceId);
  };

  const formatTime = (date) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Unknown";

    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    uploadStatus,
    error,

    handleUpload,
    handleDelete,
    handleRename,
    handleFavorite,

    formatTime: (date) => formatTime(date), // Ensure it's correctly passed
  };
};

export default useLearningDocuments;
