import { useMemo, useState } from "react";
import Swal from "sweetalert2";

const DOCUMENTS_PER_PAGE = 6;

const useLearningDocuments = () => {
  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("new-upload");

  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // CREATE DOCUMENT
  // =========================
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    const mappedFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type.includes("pdf") ? "pdf" : "file",
      size: (file.size / 1024 / 1024).toFixed(2),
      file,
      url: URL.createObjectURL(file),
      favorite: false,
      createdAt: new Date(),
    }));

    setDocuments((prev) => [...mappedFiles, ...prev]);

    Swal.fire({
      icon: "success",
      title: "Upload Berhasil",
      text: `${files.length} dokumen berhasil ditambahkan`,
      timer: 1500,
      showConfirmButton: false,
      background: "#050816",
      color: "#fff",
    });
  };

  // =========================
  // DELETE DOCUMENT
  // =========================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Dokumen?",
      text: "Dokumen yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      background: "#050816",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));

        Swal.fire({
          title: "Berhasil",
          text: "Dokumen berhasil dihapus",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#050816",
          color: "#fff",
        });
      }
    });
  };

  // =========================
  // RENAME DOCUMENT
  // =========================
  const handleRename = async (id, currentName) => {
    const { value: newName } = await Swal.fire({
      title: "Rename Document",
      input: "text",
      inputValue: currentName,
      inputPlaceholder: "Masukkan nama baru...",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      background: "#050816",
      color: "#fff",
    });

    if (!newName) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              name: newName,
            }
          : doc,
      ),
    );

    Swal.fire({
      icon: "success",
      title: "Rename Berhasil",
      timer: 1200,
      showConfirmButton: false,
      background: "#050816",
      color: "#fff",
    });
  };

  // =========================
  // FAVORITE DOCUMENT
  // =========================
  const handleFavorite = (id) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              favorite: !doc.favorite,
            }
          : doc,
      ),
    );
  };

  // =========================
  // FILTER DOCUMENTS
  // =========================
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    filtered = filtered.filter((doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (filter === "favorite") {
      filtered = filtered.filter((doc) => doc.favorite);
    }

    if (filter === "new-upload") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (filter === "latest-upload") {
      filtered.sort((a, b) => a.createdAt - b.createdAt);
    }

    return filtered;
  }, [documents, search, filter]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    filteredDocuments.length / DOCUMENTS_PER_PAGE,
  );

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * DOCUMENTS_PER_PAGE;
    const endIndex = startIndex + DOCUMENTS_PER_PAGE;

    return filteredDocuments.slice(startIndex, endIndex);
  }, [filteredDocuments, currentPage]);

  // =========================
  // FORMAT TIME
  // =========================
  const formatUploadTime = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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

    handleUpload,
    handleDelete,
    handleRename,
    handleFavorite,

    formatUploadTime,
  };
};

export default useLearningDocuments;