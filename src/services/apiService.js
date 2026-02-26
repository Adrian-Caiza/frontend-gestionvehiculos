import axios from 'axios';


const API_URL = 'https://crudcrud.com/api/911d1e40e80544a1a6c8f935f000177c'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

export const apiService = {
  login: async () => {
    // Simulamos un login exitoso directo para esta emergencia
    return { token: "token-salvavidas", name: "Usuario", last: "Admin" }; 
  },

  getAll: async (endpointName) => {
    try {
      const response = await api.get(`/${endpointName}`);
      
      return response.data.map(item => ({ ...item, id: item._id }));
    } catch (e) {
      return []; 
    }
  },

  create: async (endpointName, data) => {
    const response = await api.post(`/${endpointName}`, data);
    return response.data;
  },

  update: async (endpointName, data) => {
    const id = data.id || data._id;
    const payload = { ...data };
    
    
    delete payload.id; 
    delete payload._id;
    
    const response = await api.put(`/${endpointName}/${id}`, payload);
    return response.data;
  },

  delete: async (endpointName, id) => {
    const response = await api.delete(`/${endpointName}/${id}`);
    return response.data;
  }
};

export default apiService;