import { useAuth } from "../../context/AuthContext";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";
import ToolbarLearning from "../../components/dashboard/learning/ToolbarLearning";
import EmptyDocumentLearning from "../../components/dashboard/learning/EmptyDocumentLearning";
import EmptyFavoriteLearning from "../../components/dashboard/learning/EmptyFavoriteLearning";
import DocumentGridLearning from "../../components/dashboard/learning/DocumentGridLearning";
import PaginationLearning from "../../components/dashboard/learning/PaginationLearning";

const LearningPage = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("new-upload");
  const [openMenuId, setOpenMenuId] = useState(null);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const DOCUMENTS_PER_PAGE = 6;

  // logout
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
        });
      }
    });
  };

  // create document
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

  // delete document
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

  // rename document
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

  // favorite document
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

  // format time
  const formatUploadTime = (date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // filter document
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

  // pagination
  const totalPages = Math.ceil(filteredDocuments.length / DOCUMENTS_PER_PAGE);

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * DOCUMENTS_PER_PAGE;
    const endIndex = startIndex + DOCUMENTS_PER_PAGE;

    return filteredDocuments.slice(startIndex, endIndex);
  }, [filteredDocuments, currentPage]);

  return (
    <div className="flex min-h-screen bg-linear-to-b from-black via-[#050816] to-violet-950 text-white">
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <SidebarDashboard
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        user={user}
      />

      {/* MAIN */}
      <main className="flex flex-1 flex-col lg:ml-72">
        {/* NAVBAR */}
        <NavbarDashboard
          title={"Learning"}
          description={"Kelola materi dan mulai belajar bersama AI Assistant."}
          setSidebarOpen={setSidebarOpen}
          user={user}
          handleLogout={handleLogout}
        />

        {/* CONTENT */}
        <div className="px-5 py-5 lg:px-8">
          {/* TOP ACTION */}
          <ToolbarLearning
            filter={filter}
            search={search}
            onChangeFilter={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            onChangeUpload={handleUpload}
            onChangeSearch={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* EMPTY GLOBAL */}
          {documents.length === 0 ? (
            <EmptyDocumentLearning onChangeUpload={handleUpload} />
          ) : filteredDocuments.length === 0 ? (
            /* EMPTY FILTER */
            <EmptyFavoriteLearning />
          ) : (
            <>
              {/* DOCUMENT GRID */}
              <DocumentGridLearning
                documents={paginatedDocuments}
                handleFavorite={handleFavorite}
                handleRename={handleRename}
                handleDelete={handleDelete}
                formatUploadTime={formatUploadTime}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />

              {/* PAGINATION */}
              {totalPages > 1 && (
                <PaginationLearning
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default LearningPage;
