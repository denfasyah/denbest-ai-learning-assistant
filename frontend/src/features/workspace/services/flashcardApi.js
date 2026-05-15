import axiosInstance from '../../../services/axiosInstance';

export const flashcardApi = {
  getFlashcards: (workspaceId) =>
    axiosInstance.get(`/workspaces/${workspaceId}/flashcards`),

  generateFlashcards: (workspaceId, count = 10) =>
    axiosInstance.post(`/workspaces/${workspaceId}/flashcards/generate`, { count }),

  regenerateFlashcards: (workspaceId, count = 10) =>
    axiosInstance.post(`/workspaces/${workspaceId}/flashcards/regenerate`, { count }),

  reviewFlashcard: (workspaceId, flashcardId, rating) =>
    axiosInstance.patch(`/workspaces/${workspaceId}/flashcards/${flashcardId}/review`, { rating }),
};
