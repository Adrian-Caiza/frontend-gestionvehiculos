const GenericTable = ({ columns, data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8 font-medium">No hay registros para mostrar en este momento.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-200 text-gray-700">
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 text-sm font-bold uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-blue-50 transition duration-150">
              
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
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
              
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {onEdit && (
                  <button onClick={() => onEdit(row)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1.5 px-4 rounded shadow-sm transition mr-2">
                    Editar
                  </button>
                )}
                <button onClick={() => onDelete(row.id || row._id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-4 rounded shadow-sm transition">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;