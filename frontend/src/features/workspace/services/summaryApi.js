import axiosInstance from '../../../services/axiosInstance';

/**
 * Summary API services
 */
const summaryApi = {
  /**
   * Get existing summary for a workspace
   * GET /api/v1/workspaces/:workspaceId/summary
   */
  getSummary: async (workspaceId) => {
    const response = await axiosInstance.get(`/workspaces/${workspaceId}/summary`);
    return response.data;
  },

  /**
   * Generate new summary
   * POST /api/v1/workspaces/:workspaceId/summary/generate
   */
  generateSummary: async (workspaceId) => {
    const response = await axiosInstance.post(`/workspaces/${workspaceId}/summary/generate`);
    return response.data;
  },

  /**
   * Force regenerate summary
   * POST /api/v1/workspaces/:workspaceId/summary/regenerate
   */
  regenerateSummary: async (workspaceId) => {
    const response = await axiosInstance.post(`/workspaces/${workspaceId}/summary/regenerate`);
    return response.data;
  }
};

export default summaryApi;
