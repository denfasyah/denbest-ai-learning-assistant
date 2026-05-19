import axiosInstance from '../../../services/axiosInstance';

export const notesApi = {
  getNotes: (params) => axiosInstance.get('/notes', { params }),
  createNote: (data) => axiosInstance.post('/notes', data),
  updateNote: (id, data) => axiosInstance.patch(`/notes/${id}`, data),
  togglePin: (id) => axiosInstance.patch(`/notes/${id}/pin`),
  deleteNote: (id) => axiosInstance.delete(`/notes/${id}`),
};
