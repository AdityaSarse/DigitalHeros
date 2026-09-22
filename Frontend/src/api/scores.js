import api from './client';

export const scoreApi = {
  getScores: () => api.get('/scores'),
  createScore: (payload) => api.post('/scores', payload),
  updateScore: (id, payload) => api.put(`/scores/${id}`, payload),
  deleteScore: (id) => api.delete(`/scores/${id}`),
};

export default scoreApi;
