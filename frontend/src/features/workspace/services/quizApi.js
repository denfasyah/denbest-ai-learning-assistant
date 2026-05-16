import api from '../../../services/axiosInstance';

export const quizApi = {
  generateQuiz: async (workspaceId, count = 5) => {
    return api.post(`/workspaces/${workspaceId}/quizzes`, { count });
  },

  submitQuiz: async (workspaceId, quizId, answers) => {
    return api.post(`/workspaces/${workspaceId}/quizzes/${quizId}/submit`, { answers });
  },

  getQuizResult: async (workspaceId, quizId) => {
    return api.get(`/workspaces/${workspaceId}/quizzes/${quizId}`);
  },

  getQuizHistory: async (workspaceId) => {
    return api.get(`/workspaces/${workspaceId}/quizzes`);
  }
};
