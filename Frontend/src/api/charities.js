import api from './client';

export const charityApi = {
  getCharities: (search = '') => api.get(`/charities${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getMyCharity: () => api.get('/charities/my'),
  getCharityById: (id) => api.get(`/charities/${id}`),
  selectCharity: (payload) => api.post('/charities/select', payload),
};

export default charityApi;
