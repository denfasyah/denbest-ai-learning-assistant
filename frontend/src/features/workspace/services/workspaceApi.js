import axiosInstance from '../../../services/axiosInstance';

export const getWorkspaceById = async (workspaceId) => {
  const response = await axiosInstance.get(`/workspaces/${workspaceId}`);
  return response.data;
};

export const getWorkspaceDocuments = async (workspaceId) => {
  const response = await axiosInstance.get(`/workspaces/${workspaceId}/documents`);
  return response.data;
};
