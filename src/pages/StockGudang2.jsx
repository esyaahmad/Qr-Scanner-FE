import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";
import StockOpnamePrint from "../components/StockOpnamePrint";

export default function StockGudang2() {
  const { setLoading } = useContext(UserContext);
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10) // You can change this to whatever page size you want
  const [totalItems, setTotalItems] = useState(0);

  const url = "http://localhost:3000";

  const handlePrint = () => {
    window.print();
  };

//awdadwpjokadwqwe2

  async function fetchAllProduct(page, pageSize) {
    setLoading(true);
    try {
      const { data } = await axios.get(`${url}/getAllGudangProducts`, {
        params: { page, pageSize }
      });
      if (data.data.length === 0) {
        toast.error("Product Not Found");
      } else {
        setProduct(data.data);
        setTotalItems(data.totalItems);
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

  //untuk hide nama dan itemID yg sama
  let previousItemId = null;
  let previousItemName = null;
  useEffect(() => {
    fetchAllProduct(page, pageSize);
  }, [page, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);
  // console.log(product, "<<< PRODUCT");
  // console.log(page, "<<< PAGE");
  // console.log(totalPages, "<<< TOTAL PAGES");
  // console.log(totalItems, "<<< TOTAL ITEMS");
  // console.log(pageSize, "<<< PAGE SIZE");
  // console.log();
  return (
    <>
      {/* <StockOpnamePrint product={product} />
      <div className="mt-8 h-screen">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-800">Stock Gudang</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handlePrint()}
            >
              Print
            </button>
          </div>
          <ToastContainer />
          <div className="overflow-x-auto print-preview-button">
            <table className="table-xs w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    No
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    Item ID
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    Nama Item
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    Lok
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    Rack
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    Row
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    Col
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    Quantity
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    No. Analisa
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    No. TTBA
                  </th>
                  <th className="px-4 py-2 bg-gray-200 text-gray-600 border">
                    Process Date
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
                      <td className="border px-4 py-2">{index + 1 + (page - 1) * pageSize}</td>
                      <td className="border px-4 py-2">
                        {showItemId ? row.Item_ID : ""}
                      </td>
                      <td className="border px-4 py-2">
                        {showItemName ? row.Item_Name : ""}
                      </td>
                      <td className="border px-4 py-2">{row.Lokasi}</td>
                      <td className="border px-4 py-2">{row.Rak}</td>
                      <td className="border px-4 py-2">{row.Baris}</td>
                      <td className="border px-4 py-2">{row.Kolom}</td>
                      <td className="border px-4 py-2">{Math.ceil(row.Qty)}</td>
                      <td className="border px-4 py-2">{row.DNc_No}</td>
                      <td className="border px-4 py-2">
                        {row.DNc_TTBANo || "-"}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(row.Process_Date).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <p className="text-gray-800">
                Page {page} of {totalPages}
              </p>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
