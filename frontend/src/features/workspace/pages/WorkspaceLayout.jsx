import { useState, useEffect, useCallback } from "react";
import { useParams, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useWorkspaceStore } from "../store/workspaceStore";
import { WorkspaceContext } from "../context/WorkspaceContext";
import { getWorkspaceById, getWorkspaceDocuments } from "../services/workspaceApi";
import WorkspaceHeader from "../components/WorkspaceHeader";
import WorkspaceTabs from "../components/WorkspaceTabs";
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

const WorkspaceLayout = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveWorkspace } = useWorkspaceStore();
  
  const [workspace, setWorkspace] = useState(null);
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isRootPath = location.pathname === `/learning/workspace/${workspaceId}`
      || location.pathname === `/learning/workspace/${workspaceId}/`;
    if (isRootPath) {
      navigate('content', { replace: true });
    }
  }, [location.pathname, workspaceId, navigate]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const workspaceRes = await getWorkspaceById(workspaceId);
      const docsRes = await getWorkspaceDocuments(workspaceId);
      
      setWorkspace(workspaceRes.data);
      setDocument(docsRes.data[0] || null);
      setActiveWorkspace(workspaceId);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404 || status === 403) {
        Swal.fire({
          ...swalConfig,
          icon: "error",
          title: "Akses Ditolak",
          text: "Workspace tidak ditemukan atau Anda tidak memiliki akses.",
        }).then(() => {
          navigate("/learning");
        });
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan saat memuat workspace.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, navigate, setActiveWorkspace]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contextValue = {
    workspaceId,
    workspace,
    document,
    isLoading,
    error,
    refetch: fetchData,
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-8 animate-pulse">
          <div className="h-96 w-full rounded-[2.5rem] bg-white/5 border border-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 w-full rounded-[2rem] bg-white/5 border border-white/10" />
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-white/10 rounded-[2.5rem]">
          <h2 className="text-2xl font-black text-white mb-4 tracking-tight">Waduh! Ada Masalah</h2>
          <p className="text-slate-400 mb-8 max-w-sm font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black italic tracking-tight transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    if (document?.processingStatus === "processing") {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
          <div className="text-center space-y-3">
            <h3 className="text-xl font-black text-white tracking-tight">Mengekstraksi Pengetahuan...</h3>
            <p className="text-slate-500 text-sm font-medium">AI sedang memproses dokumenmu untuk pengalaman belajar terbaik.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    );
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      <div className="space-y-8 animate-in fade-in duration-700 max-w-full overflow-x-hidden pb-12">
        {/* Header Section */}
        <WorkspaceHeader />

        {/* Navigation Section */}
        <WorkspaceTabs />

        {/* Content Section */}
        <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {renderContent()}
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceLayout;
