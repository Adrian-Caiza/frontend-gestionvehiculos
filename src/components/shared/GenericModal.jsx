import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const GenericModal = ({ isOpen, onClose, onSubmit, title, fields, initialData }) => {
  const [formData, setFormData] = useState({});
  const [optionsData, setOptionsData] = useState({});

  useEffect(() => {
    if (initialData) { setFormData(initialData); } 
    else {
      const emptyForm = {};
      fields.forEach(field => emptyForm[field.name] = field.type === 'multi-select' ? [] : '');
      setFormData(emptyForm);
    }
  }, [initialData, fields, isOpen]);

  useEffect(() => {
    const loadOptions = async () => {
      if (!isOpen) return;
      const newOptions = {};
      for (const field of fields) {
        if (field.apiOptions) {
          try { newOptions[field.name] = await apiService.getAll(field.apiOptions); } 
          catch (e) { console.error(`Error options:`, e); }
        }
      }
      setOptionsData(newOptions);
    };
    loadOptions();
  }, [isOpen, fields]);

  const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  
  const handleMultiSelect = (e, fieldName) => {
    const values = Array.from(e.target.selectedOptions, option => Number(option.value));
    setFormData(prev => ({ ...prev, [fieldName]: values }));
  };
  
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setFormData(prev => ({ ...prev, [fieldName]: reader.result.split(',')[1] })); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 m-0">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition">&times;</button>
        </div>

        
        <div className="p-6 overflow-y-auto">
          <form id="generic-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}:</label>
                
                {field.type === 'file' ? (
                  <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, field.name)} required={field.required && !formData[field.name]} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    {formData[field.name] && <img src={`data:image/png;base64,${formData[field.name]}`} alt="Preview" className="mt-3 w-16 h-16 object-cover rounded-full mx-auto border-2 border-blue-100 shadow-sm" />}
                  </div>
                ) : field.type === 'select' ? (
                  <select name={field.name} value={formData[field.name] || ''} onChange={handleChange} required={field.required} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white">
                    <option value="">Seleccione...</option>
                    {optionsData[field.name]?.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.nombre} {opt.apellido || ''} {opt.identificacion ? `(${opt.identificacion})` : ''}</option>
                    ))}
                  </select>
                ) : field.type === 'multi-select' ? (
                  <select multiple name={field.name} value={formData[field.name] || []} onChange={(e) => handleMultiSelect(e, field.name)} required={field.required} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white h-24">
                    {optionsData[field.name]?.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.nombre} ({opt.codigo || opt.id})</option>
                    ))}
                  </select>
                ) : (
                  
                  <input 
                    type={field.type || 'text'} 
                    name={field.name} 
                    value={formData[field.name] || ''} 
                    onChange={handleChange} 
                    required={field.required} 
                    pattern={field.pattern}
                    title={field.title}
                    min={field.min}
                    max={field.max}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                  />
                )}
              </div>
            ))}
          </form>
        </div>

        
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 font-semibold transition shadow-sm">Cancelar</button>
          <button type="submit" form="generic-form" className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-bold transition shadow-sm">Guardar</button>
        </div>

      </div>
    </div>
  );
};

export default GenericModal;

