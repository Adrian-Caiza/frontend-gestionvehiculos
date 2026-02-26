import axios from 'axios';


const API_URL = 'http://localhost:8080/api'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiService = {
  login: async (credentials) => {
    
    const { data } = await api.post('/auth/login', credentials); 
    return data;
  },

  getAll: async (endpointName) => {
    
    const { data } = await api.get(`/${endpointName}/listar`); 
    return data;
  },

  create: async (endpointName, payload) => {
    
    const suffix = endpointName === 'reservas' ? '/crear' : '/registrar'; 
    const { data } = await api.post(`/${endpointName}${suffix}`, payload);
    return data;
  },

  update: async (endpointName, payload) => {
    
    if (endpointName === 'reservas') {
      const { data } = await api.patch(`/${endpointName}/estado/${payload.id}`, { status: payload.status });
      return data;
    }
    throw new Error("El backend no soporta actualización general para este módulo.");
  },

  delete: async (endpointName, id) => {
    
    const { data } = await api.delete(`/${endpointName}/eliminar/${id}`); 
    return data;
  }
};

export default apiService;