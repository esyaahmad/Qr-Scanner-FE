import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import StockOpnamePrint from "../components/StockOpnamePrint";

export default function StockGudang() {
  const { loading, setLoading } = useContext(UserContext);
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(50); // Initial limit
  const [options] = useState([50, 100, 200]); // Options for items per page
  const [selectedType, setSelectedType] = useState(""); // State for selected item type

  const url = "http://localhost:3000";
  const navigate = useNavigate();
  const tableRef = useRef(null);

  // For hiding same name and itemID
  let previousItemId = null;
  let previousItemName = null;

  const handlePrint = () => {
    const currentPage = page // assuming page number is inside a DOM element with ref "pageRef"
    const pageToPrint = parseInt(currentPage) || 1; // fallback to page 1 if not a valid number
    window.print(pageToPrint);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to the first page when limit changes
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setPage(1); // Reset to the first page when type changes
  };

  async function fetchAllProduct() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/getAllGudangProducts?page=${page}&limit=${limit}`);
      if (data.data.length === 0) {
        toast.error("Product Not Found");
      } else {
        setProduct(data.data);
        setTotalPages(Math.ceil(data.total / limit));
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
      });
      setProduct([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllProduct();
  }, [page, limit]);

  // Filter products based on selected type
  const filteredProducts = selectedType ? product.filter(row => row.Item_Type === selectedType) : product;

  // console.log(loading);
  return (
    <>
      <StockOpnamePrint product={filteredProducts} limit={limit} options={options} handleLimitChange={handleLimitChange} page={page} setPage={setPage} totalPages={totalPages} tableRef={tableRef} />
      <div className="mt-8 h-screen">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-800">Stock Opname</p>
            <div className="relative">
              <select
                className="block appearance-none w-32 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={limit}
                onChange={(e) => handleLimitChange(e.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.293 8.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L9 10.586V4a1 1 0 1 1 2 0v6.586l1.293-1.293z"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                className="block appearance-none w-32 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={selectedType}
                onChange={handleTypeChange}
              >
                <option value="">All</option>
                <option value="BB">BB</option>
                <option value="BK">BK</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.293 8.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L9 10.586V4a1 1 0 1 1 2 0v6.586l1.293-1.293z"
                  />
                </svg>
              </div>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handlePrint()}
            >
              Print
            </button>
          </div>
          <ToastContainer />
          <div className="overflow-x-auto print-preview-button" ref={tableRef}>
            <table className="table-xs w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">No</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Item ID</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Nama Item</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Lok</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Rack</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Row</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Col</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Quantity</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">No. Analisa</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Item Type</th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">Process Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((row, index) => {
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
                      <td className="border px-4 py-2">{row.RowNum}</td>
                      <td className="border px-4 py-2">{showItemId ? row.Item_ID : ''}</td>
                      <td className="border px-4 py-2">{showItemName ? row.Item_Name : ''}</td>
                      <td className="border px-4 py-2">{row.Lokasi}</td>
                      <td className="border px-4 py-2">{row.Rak}</td>
                      <td className="border px-4 py-2">{row.Baris}</td>
                      <td className="border px-4 py-2">{row.Kolom}</td>
                      <td className="border px-4 py-2">{Math.ceil(row.Qty)}</td>
                      <td className="border px-4 py-2">{row.DNc_No}</td>
                      <td className="border px-4 py-2">{row.Item_Type}</td>
                      <td className="border px-4 py-2">{new Date(row.Process_Date).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              disabled={page === 1}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              Previous
            </button>
            <span className="self-center">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
              disabled={page === totalPages}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
