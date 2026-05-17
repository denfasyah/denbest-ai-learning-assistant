import { create } from "zustand";
import {
  getWorkspaces,
  // eslint-disable-next-line no-unused-vars
  createWorkspace,
  // eslint-disable-next-line no-unused-vars
  uploadDocument,
  uploadWorkspaceAndDocument,
  deleteWorkspace,
  renameWorkspace,
  toggleFavorite,
} from "../services/learningApi";

// eslint-disable-next-line no-unused-vars
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
    try {
      set({ isLoading: true, error: null });
      const response = await getWorkspaces(page, limit);

      // response is { success, data, pagination, message }
      set({
        workspaces: response.data || [],
        currentPage: response.pagination?.page || 1,
        totalPages: response.pagination?.totalPages || 1,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch workspaces",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadAndCreateWorkspace: async (file) => {
    try {
      set({ isUploading: true, uploadProgress: 0, error: null });

      const response = await uploadWorkspaceAndDocument(file, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        set({ uploadProgress: percent });
      });

      // response is { success, data: { workspace, document }, message }
      const newWorkspace = response.data.workspace;

      set((state) => ({
        workspaces: [newWorkspace, ...state.workspaces],
        // Kita tidak refetch semua supaya instan, 
        // tapi jika perlu sinkronisasi pagination bisa fetchWorkspaces()
      }));

      return newWorkspace;
    } catch (error) {
      const message = error.response?.data?.message || "Upload failed";
      set({ error: message });
      throw error;
    } finally {
      set({ isUploading: false, uploadProgress: 0 });
    }
  },

  removeWorkspace: async (workspaceId) => {
    try {
      // Optimistic update bisa di sini, tapi kita hapus setelah sukses sesuai permintaan stabilisasi
      await deleteWorkspace(workspaceId);

      set((state) => ({
        workspaces: state.workspaces.filter((w) => w._id !== workspaceId),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Delete failed" });
      throw error;
    }
  },

  updateWorkspaceTitle: async (workspaceId, title) => {
    try {
      const response = await renameWorkspace(workspaceId, title);
      const updatedWorkspace = response.data;

      set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w._id === workspaceId ? { ...w, ...updatedWorkspace } : w
        ),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Rename failed" });
      throw error;
    }
  },

  toggleFavoriteAction: async (workspaceId) => {
    try {
      const response = await toggleFavorite(workspaceId);
      const updatedWorkspace = response.data;

      set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w._id === workspaceId ? { ...w, ...updatedWorkspace } : w
        ),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Favorite failed" });
    }
  },

  clearError: () => set({ error: null }),
}));
