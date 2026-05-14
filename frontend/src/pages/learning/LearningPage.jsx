import { useState, useRef } from "react";
import { GraduationCap, Upload } from "lucide-react";
import useLearningDocuments from "../../features/learning/hooks/useLearningDocuments";
import LearningToolbar from "../../features/learning/components/LearningToolbar";
import DocumentGrid from "../../features/learning/components/DocumentGrid";
import EmptyState from "../../features/learning/components/EmptyState";
import Pagination from "../../features/learning/components/Pagination";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";


const LearningPage = () => {
  const fileInputRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
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
    isLoading,
    isUploading,
    uploadProgress,
    uploadStatus,
    handleUpload,
    handleDelete,
    handleRename,
    handleFavorite,
    formatTime,
  } = useLearningDocuments();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 w-full animate-pulse rounded-3xl bg-white/5 border border-white/10" />
          ))}
        </div>
      );
    }

    if (isUploading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-6 bg-white/5 border border-white/10 rounded-[40px] animate-pulse">
          <div className="relative">
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
            {uploadStatus && (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-indigo-400">
                {uploadProgress}%
              </div>
            )}
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">
              {uploadStatus 
                ? `Mengupload (${uploadStatus.current}/${uploadStatus.total})` 
                : "Memproses Dokumen..."}
            </h3>
            <p className="text-slate-400 font-medium max-w-xs truncate">
              {uploadStatus?.name || "Mohon tunggu sebentar..."}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      );
    }

    // ✅ Tidak ada dokumen sama sekali
    if (documents.length === 0) {
      return (
        <EmptyState
          type="documents"
          onAction={() => fileInputRef.current?.click()}
        />
      );
    }

    // ✅ Ada dokumen tapi filter tidak cocok
    if (filteredDocuments.length === 0) {
      if (filter === "favorite") {
        return (
          <EmptyState
            type="favorites"
            onAction={() => {
              setFilter("new-upload");
              setCurrentPage(1);
            }}
          />
        );
      }

      if (search) {
        return (
          <EmptyState
            type="search"
            onAction={() => {
              setSearch("");
              setCurrentPage(1);
            }}
          />
        );
      }

      return (
        <EmptyState
          title="No Matches Found"
          description="Try adjusting your search or filters."
          showAction={false}
        />
      );
    }

    // ✅ Tampilkan grid normal
    return (
      <div className="space-y-10">
        <DocumentGrid
          documents={paginatedDocuments}
          onFavorite={handleFavorite}
          onRename={handleRename}
          onDelete={handleDelete}
          formatTime={formatTime}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
        />

        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="relative space-y-8 animate-in fade-in duration-700 min-h-150"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* DRAG OVERLAY */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/60 backdrop-blur-sm p-6 pointer-events-none animate-in fade-in duration-300">
          <div className="flex flex-col items-center justify-center gap-6 w-full max-w-lg aspect-video rounded-[40px] border-4 border-dashed border-indigo-500/40 bg-[#0f111a]/80 shadow-2xl animate-in zoom-in duration-300">
            <div className="h-20 w-20 rounded-3xl bg-indigo-500 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)]">
              <Upload className="h-10 w-10 text-white animate-bounce" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-white tracking-tight">Drop files to upload</h2>
              <p className="text-slate-400 font-medium mt-1">Support PDF, TXT, and Markdown</p>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <Card variant="glass" className="p-7">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div className="max-w-3xl">
            <Badge variant="indigo" className="mb-3">Education Engine</Badge>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Smart Learning Workspace
            </h1>
            <p className="mt-4 leading-relaxed text-slate-400 font-medium">
              Upload your learning materials and let AI help you generate summaries, quizzes, flashcards, and study insights.
            </p>
          </div>
        </div>
      </Card>

      {/* TOOLBAR */}
      <LearningToolbar
        filter={filter}
        search={search}
        onFilterChange={(val) => {
          setFilter(val);
          setCurrentPage(1);
        }}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        onUpload={() => fileInputRef.current?.click()}
      />

      {/* HIDDEN FILE INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept=".pdf,.txt,.md"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            handleUpload(e.target.files);
            e.target.value = ""; // Reset value so same file can be selected again
          }
        }}
      />

      {/* CONTENT AREA */}
      {renderContent()}
    </div>
  );
};

export default LearningPage;