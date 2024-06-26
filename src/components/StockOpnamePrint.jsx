import React from 'react';

export default function StockOpnamePrint({ product, tableRef }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Adjust the locale as needed
  };

  const currentDate = new Date().toLocaleDateString('en-GB');
  // For hiding same name and itemID
  let previousItemId = null;
  let previousItemName = null;
  return (
    <>
      <div className="overflow-x-auto print-component">
        <table className="min-w-full border-collapse border border-gray-800 leading-normal">
          <thead>
            <tr>
              <th
                className="px-2 py-1 border border-gray-800 text-xs font-bold text-gray-600"
                colSpan="12"
              >
                Stok Opname Bahan Baku per Tgl ({currentDate})
              </th>
            </tr>
            <tr>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                No
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                Item ID
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                Nama Item
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                No. Analisa
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                Stn
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                Qty
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                Fisik
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                Selisih
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                No. Rak
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                Jml di Rak
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600">
                Expire Date
              </th>
              <th className="px-2 py-1 border border-gray-800 text-xs font-semibold text-gray-600" style={{ minWidth: '150px' }}>
                Item Rev
              </th>
            </tr>
          </thead>
          <tbody>
            {product.map((row, index) => {
              const showItemId = previousItemId !== row.Item_ID;
              const showItemName = previousItemName !== row.Item_Name;
              if (showItemId) {
                previousItemId = row.Item_ID;
              }
              if (showItemName) {
                previousItemName = row.Item_Name;
              }
            
            return (
            
              <tr key={index}>
                <td className="px-2 py-1 border border-gray-800 text-sm">{row.RowNum}</td>
                <td className="px-2 py-1 border border-gray-800 text-sm">{showItemId ? row.Item_ID : ''}</td>
                <td className="px-2 py-1 border border-gray-800 text-sm">{showItemName ? row.Item_Name : ''}</td>
                <td className="px-2 py-1 border border-gray-800 text-sm">{row.DNc_No}</td>
                <td className="px-2 py-1 border border-gray-800 text-sm">{row.Item_Unit}</td>
                <td className="px-2 py-1 border border-gray-800 text-sm">{Math.ceil(row.Qty)}</td>
                <td className="px-2 py-1 border border-gray-800 text-sm"></td>
                <td className="px-2 py-1 border border-gray-800 text-sm"></td>
                <td className="px-2 py-1 border border-gray-800 text-sm"></td>
                <td className="px-2 py-1 border border-gray-800 text-sm"></td>
                <td className="px-2 py-1 border border-gray-800 text-sm">{formatDate(row.st_ED)}</td>
                <td className="px-2 py-1 border border-gray-800 text-sm"></td>
              </tr>
            );
          })}

          </tbody>
        </table>
      </div>
    </>
  );
}
