import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const data = await apiService.login({ email, password });
      const nombreFinal = data.name ? `${data.name} ${data.last}` : 'Usuario';
      
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userName', nombreFinal);
      localStorage.setItem('userImage', data.imgBase64 || '');
      navigate('/materias'); 
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inicio de Sesión</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center text-sm font-semibold">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Clave:</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
            />
          </div>
          <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-md">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;