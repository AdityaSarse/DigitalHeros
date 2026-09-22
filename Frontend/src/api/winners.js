import api from './client';

export const winnerApi = {
  getMyWinnings: () => api.get('/winners'),
  getWinnerById: (id) => api.get(`/winners/${id}`),
  submitProof: (id, payload) => api.post(`/winners/${id}/proof`, payload),
};

export default winnerApi;
