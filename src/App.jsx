import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CrudView from './pages/CrudView';
import ProtectedRoute from './components/shared/ProtectedRoute';

// VEHÍCULOS 
const vehiculosColumns = [
  { key: 'imgBase64', label: 'Foto', isImage: true },
  { key: 'plate', label: 'Placa' },
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'year', label: 'Año' }
];

const vehiculosFields = [
  { name: 'imgBase64', label: 'Foto del Vehículo', type: 'file', required: false },
  { name: 'plate', label: 'Placa', type: 'text', required: true, pattern: "^[A-Z0-9-]+$", title: "Sin espacios (ej. ABC-123)" },
  { name: 'brand', label: 'Marca', type: 'text', required: true },
  { name: 'model', label: 'Modelo', type: 'text', required: true },
  { name: 'year', label: 'Año', type: 'number', required: true, min: 1950, max: 2026 },
  { name: 'color', label: 'Color', type: 'text', required: true },
  { name: 'type', label: 'Tipo', type: 'text', required: true },
  { name: 'mileage', label: 'Kilometraje', type: 'number', required: true, min: 0 },
  { name: 'description', label: 'Descripción', type: 'text', required: true }
];

// CONFIGURACIÓN DE CLIENTES 
const clientesColumns = [
  { key: 'imgBase64', label: 'Foto', isImage: true },
  { key: 'identification', label: 'Identificación' },
  { key: 'name', label: 'Nombre' },
  { key: 'last', label: 'Apellido' },
  { key: 'mail', label: 'Correo' }
];

const clientesFields = [
  { name: 'imgBase64', label: 'Foto de Perfil', type: 'file', required: false },
  { name: 'identification', label: 'Ident.', type: 'text', required: true, pattern: "^[0-9]{10}$", title: "10 números exactos" },
  { name: 'name', label: 'Nombre', type: 'text', required: true, pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ\\s]+$" },
  { name: 'last', label: 'Apellido', type: 'text', required: true, pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ\\s]+$" },
  { name: 'city', label: 'Ciudad', type: 'text', required: true },
  { name: 'address', label: 'Dirección', type: 'text', required: true },
  { name: 'phone', label: 'Teléfono', type: 'text', required: true, pattern: "^09[0-9]{8}$" },
  { name: 'mail', label: 'Correo', type: 'email', required: true },
  { name: 'birthDate', label: 'F. Nacimiento', type: 'date', required: true }
];

// CONFIGURACIÓN DE RESERVAS 

const reservasColumns = [
  { key: 'codigo', label: 'CÓDIGO RESERVA' },
  { key: 'clienteId', label: 'ID CLIENTE' },
  { key: 'vehiculoId', label: 'ID VEHÍCULO' },
  { key: 'estado', label: 'ESTADO' }
];


const reservasFields = [
  { name: 'codigo', label: 'Código de Reserva', type: 'text', required: true },
  { name: 'clienteId', label: 'Seleccionar Cliente', type: 'select', apiOptions: 'clientes', required: true },
  { name: 'vehiculoId', label: 'Seleccionar Vehículo', type: 'select', apiOptions: 'vehiculos', required: true },
  { name: 'estado', label: 'Estado de Reserva', type: 'text', required: true } // O puedes hacerlo tipo 'select' con opciones fijas
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/vehiculos" replace />} />
          <Route path="/vehiculos" element={<CrudView moduleName="Vehículos" endpointName="vehiculos" tableColumns={vehiculosColumns} formFields={vehiculosFields} hideEdit={true} />} />
          <Route path="/clientes" element={<CrudView moduleName="Clientes" endpointName="clientes" tableColumns={clientesColumns} formFields={clientesFields} hideEdit={true} />} />
          <Route path="/reservas" element={<CrudView moduleName="Reservas" endpointName="reservas" tableColumns={reservasColumns} formFields={reservasFields} hideEdit={true} />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;