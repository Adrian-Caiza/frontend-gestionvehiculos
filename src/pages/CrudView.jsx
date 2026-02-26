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
      const payloadLimpio = { ...formData, imgBase64: formData.imgBase64 !== undefined ? formData.imgBase64 : "" };

      if (payloadLimpio.clieId) payloadLimpio.clieId = Number(payloadLimpio.clieId);
      if (payloadLimpio.vehId) payloadLimpio.vehId = Number(payloadLimpio.vehId);
      if (payloadLimpio.year) payloadLimpio.year = Number(payloadLimpio.year);
      if (payloadLimpio.mileage) payloadLimpio.mileage = Number(payloadLimpio.mileage);

      if (currentRecord) { await apiService.update(endpointName, { ...payloadLimpio, id: currentRecord.id }); } 
      else { await apiService.create(endpointName, payloadLimpio); }
      
      setIsModalOpen(false); fetchData();
    } catch (error) {
      if (error.response && error.response.data) alert(`Error: ${JSON.stringify(error.response.data)}`);
      else alert("Error al guardar el registro.");
    }
  };

  const getNavClass = (path) => `flex-1 sm:flex-none text-center px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg font-bold transition whitespace-nowrap ${location.pathname === path ? 'bg-blue-600 text-white shadow' : 'text-blue-600 hover:bg-blue-100'}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        
        
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100 gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {userImage ? (
              <img src={`data:image/png;base64,${userImage}`} alt="Perfil" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm shrink-0" />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-sm shrink-0">U</div>
            )}
            <div className="truncate">
              <p className="text-xs sm:text-sm text-gray-500 m-0">Bienvenido,</p>
              <h2 className="text-base sm:text-lg font-bold text-gray-800 m-0 truncate">{userName}</h2>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition text-sm sm:text-base">
            Salir
          </button>
        </div>


        <div className="flex overflow-x-auto gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100 hide-scrollbar">
          <Link to="/vehiculos" className={getNavClass('/vehiculos')}>🚗 Vehículos</Link>
          <Link to="/clientes" className={getNavClass('/clientes')}>👥 Clientes</Link>
          <Link to="/reservas" className={getNavClass('/reservas')}>📅 Reservas</Link>
        </div>
        
       
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800">Gestión de {moduleName}</h3>
          <button onClick={handleCreateNew} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition transform hover:-translate-y-0.5 text-sm sm:text-base">
            + Nuevo Registro
          </button>
        </div>

        
        <GenericTable columns={tableColumns} data={data} onEdit={hideEdit ? null : handleEdit} onDelete={handleDelete} />

        <GenericModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} title={currentRecord ? `Editar ${moduleName}` : `Crear ${moduleName}`} fields={formFields} initialData={currentRecord} />
      </div>
    </div>
  );
};

export default CrudView;