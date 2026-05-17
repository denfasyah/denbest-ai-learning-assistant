import axiosInstance from "../../../services/axiosInstance";

export const getWorkspaces = async (
  page = 1,
  limit = 10
) => {
  const response = await axiosInstance.get(
    `/workspaces?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const createWorkspace = async (
  payload
) => {
  const response = await axiosInstance.post(
    "/workspaces",
    payload
  );

  return response.data;
};

export const uploadWorkspaceAndDocument = async (
  file,
  onUploadProgress
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    "/workspaces/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }
  );

  return response.data;
};

export const uploadDocument = async (
  workspaceId,
  file,
  onUploadProgress
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axiosInstance.post(
    `/workspaces/${workspaceId}/documents`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
      onUploadProgress,
    }
  );

  return response.data;
};

export const deleteWorkspace = async (
  workspaceId
) => {
  const response = await axiosInstance.delete(
    `/workspaces/${workspaceId}`
  );

  return response.data;
};

export const renameWorkspace = async (
  workspaceId,
  title
) => {
  const response = await axiosInstance.patch(
    `/workspaces/${workspaceId}`,
    { title }
  );

  return response.data;
};

export const toggleFavorite = async (workspaceId) => {
  const response = await axiosInstance.patch(`/workspaces/${workspaceId}/favorite`);
  return response.data;
};