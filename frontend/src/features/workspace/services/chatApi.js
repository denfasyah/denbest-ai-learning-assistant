import axiosInstance from '../../../services/axiosInstance';

/**
 * Send a message to the AI for a specific workspace
 * @param {string} workspaceId 
 * @param {string} message 
 */
export const sendMessage = (workspaceId, message) =>
  axiosInstance.post(`/workspaces/${workspaceId}/chat`, { message });

/**
 * Get chat history for a specific workspace
 * @param {string} workspaceId 
 */
export const getChatHistory = (workspaceId) =>
  axiosInstance.get(`/workspaces/${workspaceId}/chat/history`);
