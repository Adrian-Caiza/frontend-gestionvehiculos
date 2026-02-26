const GenericTable = ({ columns, data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8 font-medium px-4">No hay registros para mostrar en este momento.</p>;
  }

  return (
    
    <div className="w-full overflow-x-auto shadow-sm border border-gray-200 sm:rounded-lg">
      <table className="min-w-full w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-200 text-gray-700">
            {columns.map((col, index) => (
              <th key={index} className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                {col.label}
              </th>
            ))}
            <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold uppercase tracking-wider text-center whitespace-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-blue-50 transition duration-150">
              
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-800">
                  {col.isImage ? (
                    row[col.key] ? (
                      <img src={`data:image/png;base64,${row[col.key]}`} alt="Foto" className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm" />
                    ) : (
                      <span className="inline-block px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-full">Sin foto</span>
                    )
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              
              <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-center">
                
                <div className="flex flex-col sm:flex-row justify-center gap-2">
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1.5 px-4 rounded shadow-sm transition">
                      Editar
                    </button>
                  )}
                  <button onClick={() => onDelete(row.id || row._id)} className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-4 rounded shadow-sm transition">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;