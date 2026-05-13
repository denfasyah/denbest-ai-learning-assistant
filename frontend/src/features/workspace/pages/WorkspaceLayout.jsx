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

  // Fix Bug 2: Redirect to /content if at root workspace path
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

  // Function to render content based on state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-full min-h-[500px] w-full rounded-3xl bg-white/5 border border-white/10" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Waduh! Ada Masalah</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    if (document?.processingStatus === "processing") {
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Sedang memproses dokumen...</h3>
            <p className="text-slate-400">AI sedang mengekstraksi informasi berharga untukmu.</p>
          </div>
        </div>
      );
    }

    return <Outlet />;
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      <div className="flex flex-col gap-6 animate-in fade-in duration-700 h-full">
        {/* Shell is always visible */}
        <WorkspaceHeader />

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 flex-1 min-h-0">
          {/* Document Viewer Area (60%) */}
          <div className="lg:col-span-6 flex flex-col min-h-[500px]">
            <div className="flex-1 rounded-[2.5rem] bg-[#050816]/40 border border-white/5 backdrop-blur-xl overflow-hidden relative group">
               <div className="absolute top-0 left-0 right-0 h-14 bg-white/5 border-b border-white/5 flex items-center px-6 justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interactive View Engine</span>
                  </div>
               </div>

               <div className="h-full flex items-center justify-center p-12">
                  <div className="text-center space-y-4">
                    <div className="h-20 w-20 mx-auto rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                      <div className="h-10 w-10 text-indigo-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white">Quantum Document Engine</h3>
                    <p className="text-slate-500 text-sm max-w-xs font-medium">
                      High-fidelity document rendering and AI context extraction is active.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Tabs & Content Area (40%) */}
          <div className="lg:col-span-4 flex flex-col min-h-0">
            <WorkspaceTabs />
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceLayout;
