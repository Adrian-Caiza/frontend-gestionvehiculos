import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import GenericTable from '../components/shared/GenericTable';
import GenericModal from '../components/shared/GenericModal';
import apiService from '../services/apiService';

const CrudView = ({ moduleName, endpointName, tableColumns, formFields, hideEdit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'Usuario';
  const userImage = localStorage.getItem('userImage'); 

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const fetchData = async () => {
    try {
      const result = await apiService.getAll(endpointName);
      setData(result);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => { fetchData(); }, [endpointName]);

  const handleLogout = () => {
    localStorage.removeItem('userToken'); 
    localStorage.removeItem('userName'); 
    localStorage.removeItem('userImage');
    navigate('/login');
  };

  const handleCreateNew = () => { setCurrentRecord(null); setIsModalOpen(true); };
  const handleEdit = (row) => { setCurrentRecord(row); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    if(window.confirm('¿Estás seguro de eliminar este registro?')) {
      try { await apiService.delete(endpointName, id); fetchData(); } 
      catch (error) { console.error("Error eliminando:", error); }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      // 1. Limpiamos los datos básicos
      const payloadLimpio = {
        ...formData,
        imgBase64: formData.imgBase64 !== undefined ? formData.imgBase64 : "" 
      };

      // 2. CONVERSIÓN NUMÉRICA: Transformamos los IDs y números si existen en el formulario
      if (payloadLimpio.clieId) payloadLimpio.clieId = Number(payloadLimpio.clieId);
      if (payloadLimpio.vehId) payloadLimpio.vehId = Number(payloadLimpio.vehId);
      if (payloadLimpio.year) payloadLimpio.year = Number(payloadLimpio.year);
      if (payloadLimpio.mileage) payloadLimpio.mileage = Number(payloadLimpio.mileage);

      // 3. Enviamos al backend
      if (currentRecord) { 
        await apiService.update(endpointName, { ...payloadLimpio, id: currentRecord.id }); 
      } else { 
        await apiService.create(endpointName, payloadLimpio); 
      }
      
      setIsModalOpen(false); 
      fetchData();
    } catch (error) {
      if (error.response && error.response.data) alert(`Error: ${JSON.stringify(error.response.data)}`);
      else alert("Error al guardar el registro.");
    }
  };

  const getNavClass = (path) => `px-4 py-2 rounded-lg font-bold transition ${location.pathname === path ? 'bg-blue-600 text-white shadow' : 'text-blue-600 hover:bg-blue-100'}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* ENCABEZADO SUPERIOR */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            {userImage ? (
              <img src={`data:image/png;base64,${userImage}`} alt="Perfil" className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-sm">U</div>
            )}
            <div>
              <p className="text-sm text-gray-500 m-0">Bienvenido de vuelta,</p>
              <h2 className="text-lg font-bold text-gray-800 m-0">{userName}</h2>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition">
            Salir del sistema
          </button>
        </div>

        {/* MENÚ DE NAVEGACIÓN ACTUALIZADO */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <Link to="/vehiculos" className={getNavClass('/vehiculos')}>🚗 Vehículos</Link>
          <Link to="/clientes" className={getNavClass('/clientes')}>👥 Clientes</Link>
          <Link to="/reservas" className={getNavClass('/reservas')}>📅 Reservas</Link>
        </div>
        
        {/* TÍTULO Y BOTÓN NUEVO */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-extrabold text-gray-800">Gestión de {moduleName}</h3>
          <button onClick={handleCreateNew} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition transform hover:-translate-y-0.5">
            + Nuevo Registro
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <GenericTable columns={tableColumns} data={data} onEdit={hideEdit ? null : handleEdit} onDelete={handleDelete} />
        </div>

        <GenericModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} title={currentRecord ? `Editar ${moduleName}` : `Crear ${moduleName}`} fields={formFields} initialData={currentRecord} />
      </div>
    </div>
  );
};

export default CrudView;