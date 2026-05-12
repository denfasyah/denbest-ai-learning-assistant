import { useState } from "react";
import { GraduationCap } from "lucide-react";
import useLearningDocuments from "../../features/learning/hooks/useLearningDocuments";
import LearningToolbar from "../../features/learning/components/LearningToolbar";
import DocumentGrid from "../../features/learning/components/DocumentGrid";
import EmptyState from "../../features/learning/components/EmptyState";
import Pagination from "../../features/learning/components/Pagination";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const LearningPage = () => {
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
    formatTime,
  } = useLearningDocuments();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
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
        onUpload={handleUpload}
      />

      {/* CONTENT AREA */}
      {documents.length === 0 ? (
        <EmptyState 
          title="No Documents Yet" 
          description="Upload your first material to start learning with AI."
          onAction={handleUpload} 
        />
      ) : filteredDocuments.length === 0 ? (
        <EmptyState 
          title="No Matches Found" 
          description="Try adjusting your search or filters."
          showAction={false}
        />
      ) : (
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
      )}
    </div>
  );
};

export default LearningPage;
