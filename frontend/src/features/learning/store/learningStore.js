import { create } from "zustand";
import {
  getWorkspaces,
  createWorkspace,
  uploadDocument,
  deleteWorkspace,
  renameWorkspace,
} from "../services/learningApi";

export const useLearningStore = create((set, get) => ({
  workspaces: [],
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,

  currentPage: 1,
  totalPages: 1,

  // Di learningStore.js, pastikan tidak ada yang menyebabkan
  // store re-create fungsi fetchWorkspaces setiap saat

  fetchWorkspaces: async (page = 1, limit = 10) => {
    // Tambah guard: jangan fetch kalau sudah loading

    try {
      set({ isLoading: true, error: null });
      const response = await getWorkspaces(page, limit);

      set({
        workspaces: response.data || [],
        currentPage: response.pagination?.page || 1,
        totalPages: response.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error(error);
      set({
        error: error.response?.data?.message || "Failed to fetch workspaces",
      });
    } finally {
      set({ isLoading: false });
    }
  },

 uploadAndCreateWorkspace: async (file) => {
  let workspace = null; // ← tambah ini di luar try

  try {
    set({ isUploading: true, uploadProgress: 0, error: null });

    const workspaceResponse = await createWorkspace({
      title: file.name.replace(/\.[^/.]+$/, ""),
    });

    workspace = workspaceResponse.data; // ← simpan ke variable luar

    await uploadDocument(workspace._id, file, (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      set({ uploadProgress: percent });
    });

    await get().fetchWorkspaces();
    return workspace;

  } catch (error) {
    console.error(error);

    // ← TAMBAHKAN INI: rollback workspace kalau upload gagal
    if (workspace?._id) {
      try {
        await deleteWorkspace(workspace._id);
      } catch (deleteError) {
        console.error("Rollback failed:", deleteError);
      }
    }

    const message =
      error.response?.status === 409
        ? error.response.data.message
        : error.response?.data?.message || "Upload failed";

    set({ error: message });
    throw error;

  } finally {
    set({ isUploading: false, uploadProgress: 0 });
  }
},

  removeWorkspace: async (workspaceId) => {
    try {
      await deleteWorkspace(workspaceId);

      set((state) => ({
        workspaces: state.workspaces.filter(
          (workspace) => workspace._id !== workspaceId,
        ),
      }));
    } catch (error) {
      console.error(error);

      set({
        error: error.response?.data?.message || "Delete failed",
      });
    }
  },

  updateWorkspaceTitle: async (workspaceId, title) => {
    try {
      const response = await renameWorkspace(workspaceId, title);

      const updatedWorkspace = response.data;

      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace._id === workspaceId ? updatedWorkspace : workspace,
        ),
      }));
    } catch (error) {
      console.error(error);

      set({
        error: error.response?.data?.message || "Rename failed",
      });
    }
  },
  clearError: () => set({ error: null })
}));
