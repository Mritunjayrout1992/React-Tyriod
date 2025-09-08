import React from 'react';

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="min-w-full border-collapse text-sm text-left text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`px-4 py-3 font-semibold border-b border-gray-300 ${col.className || ''}`}
                style={col.style || {}}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.accessor}
                    className={`px-4 py-2 border-b border-gray-200 ${col.className || ''}`}
                  >
                    {typeof col.cell === 'function'
                      ? col.cell(row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : 
          <tr>
            <td
              colSpan={columns.length}
              className="text-center text-gray-500 py-4"
            >
              No data found.
            </td>
          </tr>}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
