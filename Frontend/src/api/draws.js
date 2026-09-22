import api from './client';

export const drawApi = {
  getDraws: () => api.get('/draws'),
  getDrawById: (id) => api.get(`/draws/${id}`),
  getMyEntries: (id) => api.get(`/draws/${id}/entries`),
  enterDraw: (id, payload) => api.post(`/draws/${id}/enter`, payload),
};

export default drawApi;
