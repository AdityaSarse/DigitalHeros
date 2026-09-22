import api from './client';

export const adminApi = {
  // Users
  getUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),

  // Charities
  getCharities: () => api.get('/admin/charities'),
  createCharity: (payload) => api.post('/admin/charities', payload),
  updateCharity: (id, payload) => api.patch(`/admin/charities/${id}`, payload),
  deleteCharity: (id) => api.delete(`/admin/charities/${id}`),

  // Draws
  getDraws: () => api.get('/admin/draws'),
  createDraw: (payload) => api.post('/admin/draws', payload),
  simulateDraw: (id) => api.post(`/admin/draws/${id}/simulate`),
  publishDraw: (id) => api.post(`/admin/draws/${id}/publish`),

  // Winners
  getWinners: (params = {}) => api.get('/admin/winners', { params }),
  verifyWinner: (id, payload) => api.patch(`/admin/winners/${id}/verify`, payload),
  payoutWinner: (id) => api.patch(`/admin/winners/${id}/payout`),
};

export default adminApi;
