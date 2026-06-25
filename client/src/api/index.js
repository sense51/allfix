import storage, { KEYS } from '../utils/storage';

const API = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const token = storage.get(KEYS.TOKEN);
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Server returned ${res.status} ${res.statusText}. Expected JSON but got HTML. Check that the backend server is running and VITE_API_URL is set correctly.`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const auth = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  sendOtp: (phone) => request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, otp) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),
  google: (credential, role) => request('/auth/google', { method: 'POST', body: JSON.stringify({ credential, role }) }),
};

export const services = {
  list: (category) => request(`/services${category ? `?category=${category}` : ''}`),
  get: (id) => request(`/services/${id}`),
  my: () => request('/services/my'),
  create: (body) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/services/${id}`, { method: 'DELETE' }),
};

export const bookings = {
  list: () => request('/bookings'),
  create: (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id, status, otp) => request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, otp }) }),
};

export const reviews = {
  get: (bookingId) => request(`/reviews/booking/${bookingId}`),
  create: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  forProvider: () => request('/reviews/provider'),
};
