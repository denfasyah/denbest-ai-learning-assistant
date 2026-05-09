import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import useLearningDocuments from "../../hooks/useLearningDocuments";
import useLogout from "../../hooks/useLogout";

import SidebarDashboard from "../../components/dashboard/layout/SidebarDashboard";
import NavbarDashboard from "../../components/dashboard/layout/NavbarDashboard";
import ToolbarLearning from "../../components/dashboard/learning/ToolbarLearning";
import EmptyDocumentLearning from "../../components/dashboard/learning/EmptyDocumentLearning";
import EmptyFavoriteLearning from "../../components/dashboard/learning/EmptyFavoriteLearning";
import DocumentGridLearning from "../../components/dashboard/learning/DocumentGridLearning";
import PaginationLearning from "../../components/dashboard/learning/PaginationLearning";


const LearningPage = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const {
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
  } = useLearningDocuments();


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
