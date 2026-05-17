import { create } from 'zustand';

export const useWorkspaceStore = create((set) => ({
  activeWorkspaceId: null,
  isLayoutCollapsed: false,
  
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  toggleLayout: () => set((state) => ({ isLayoutCollapsed: !state.isLayoutCollapsed })),
  setLayoutCollapsed: (collapsed) => set({ isLayoutCollapsed: collapsed }),
}));
