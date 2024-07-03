import QrScanner from "../components/QrScanner";
import QrScannerRack from "../components/QrScannerRack";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";

//stock kecil to gudang utama (transaction aman), status blm ada
export default function InsertTimbang() {
  const { setLoading } = useContext(UserContext);

  const [openQr, setOpenQr] = useState(true);
  const [openQrRack, setOpenQrRack] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [scanned, setScanned] = useState(undefined);
  const [scannedRack, setScannedRack] = useState(undefined);

  const [product, setProduct] = useState([]);
  const [rack, setRack] = useState([]);
  // const [newQty, setNewQty] = useState(0);

  // const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  // const url = "http://localhost:3000";
  const url = "http://192.168.1.24/api/ePemetaanGudang-dev";


  const navigate = useNavigate();

  const arrScanned = scanned?.split("#");
  const ttba = arrScanned?.[0]?.replace(/\//g, "-");
  const seqId = arrScanned?.[1];
  const vat = arrScanned?.[2];

  function encodeSpecialCharacters(input) {
    return input.replace(/\//g, "-").replace(/#/g, "$");
  }

  async function fetchProduct() {
    setLoading(true);
    const loadingToastId = toast.info("Fetching product data...", {
      autoClose: false,
    });
    try {
      const { data } = await axios.get(
        `${url}/productsByTtbaAndStockPosition/${ttba}/${seqId}/${vat}`, {headers: {authentication: sessionStorage.getItem("access_token")} }
      );
      if (data.length === 0) {
        toast.error("Product Not Found");
      } else {
        setProduct(data);
        toast.success("Product data fetched successfully");
      }
      // console.log(product);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
      });
      // toast.error(error?.response.data.message);
      setScanned(undefined);
      setProduct([]);
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  }

  async function fetchRack() {
    setLoading(true);
    const loadingToastId = toast.info("Fetching product data...", {
      autoClose: false,
    });
    try {
      const { data } = await axios.get(
        `${url}/racks/${scannedRack}/${encodeSpecialCharacters(scanned)}`, {headers: {authentication: sessionStorage.getItem("access_token")}}
      );

      if (data.length !== 0) {
        // console.log(data);
        throw new Error("Produk sudah terdaftar pada rak ini");
      }

      // ini yg lama
      // const { data } = await axios.get(
      //   `${url}/racks/${scannedRackInto}/${itemIdRev}/${noAnalisaRev}`
      // );
      // if (data.length === 0) {
      //   throw new Error("No data found in the rack.");
      // }
      setRack(data);
      toast.success("Rack data fetched successfully");
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error("Produk tidak ada di rak ini");
      } else {
        toast.error(error.message || "An unexpected error occurred.");
        // setRackInto([]);
        setScannedRack(undefined);
        setRack([]);
      }
      // setScannedRackInto(undefined);
      //   setOpenQrRack(true);
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      //validation harusnta
      await axios.post(`${url}/stockPosToRack/${scannedRack}/${encodeSpecialCharacters(scanned)}`, product, {headers: {authentication: sessionStorage.getItem("access_token")}});

      Swal.fire({
        title: 'Berhasil Menambahkan!',
        html: `
          <div style="font-size: 1.1em; margin-top: 10px;">
            <strong>TTBA:</strong> ${scanned}<br>
            <strong>Quantity:</strong> ${product?.recordsetStockPosition?.Qty}<br>
            <strong>Rack:</strong> ${scannedRack}
          </div>
        `,
        icon: 'success',
        iconColor: '#4caf50',
        confirmButtonText: 'OK',
        confirmButtonColor: '#4caf50',
        background: '#f0f8ff',
        customClass: {
          title: 'swal-title',
          htmlContainer: 'swal-html',
          confirmButton: 'swal-button'
        }
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding product to rack:", error);
      if (
        error.message ===
          "Start Vat Number must be smaller than End Vat Number" ||
        error.message ===
          "Start Vat Number and End Vat Number must be filled"
      ) {
        toast.error(error.message);
      } else {
        Swal.fire({
          title: error?.response?.data?.message,
          icon: "error",
        });
        setScannedRack(undefined);
        setRack([]);
        setOpenQrRack(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log(scanned, "ini scanned");
    if (scanned !== undefined) {
      fetchProduct();
      setOpenQr(false);
    }
  }, [scanned]);

  useEffect(() => {
    if (scannedRack !== undefined) {
      fetchRack();
      setOpenQrRack(false);
    }
  }, [scannedRack]);

  console.log(product, "ini product");

  console.log(rack, "ini rack");

  return (
    <>
      <div className="mt-8">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-800">
              Input Produk Timbang
            </p>
            <button
              className="btn btn-sm btn-neutral bg-[#4F6F52]"
              onClick={() => setOpenQr(!openQr)}
            >
              {openQr ? "Close" : "Open"} Scan QR
            </button>
          </div>
          {/* <ToastContainer position="bottom-right" draggable /> */}
          {openQr && <QrScanner setScanned={setScanned} />}
        </div>
        <div>
          {product ? (
            <>
              <table className="table table-xs">
                <tbody>
                  <tr>
                    <th>TTBA</th>
                    <td>{ttba}</td>
                  </tr>
                  <tr>
                    <th>Nama Produk</th>
                    <td>
                      {product?.recordsetTtba?.item_name}{" "}
                      {product?.recordsetTtba?.ttba_itemid}
                    </td>
                  </tr>
                  <tr>
                    <th>No. Analisa</th>
                    <td>{product?.recordsetTtba?.No_analisa}</td>
                  </tr>
                  <tr>
                    <th>Quantity</th>
                    <td>
                      {product?.recordsetStockPosition?.Qty}{" "}
                      {product?.recordsetTtba?.ttba_itemUnit}
                    </td>
                  </tr>
                  <tr>
                    <th>No. Vat</th>
                    <td>{product?.recordsetTtba?.ttba_vatno}</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div
                className="fixed bottom-0 w-full bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 m-5"
                role="alert"
              >
                <p className="font-bold">Scan Label Produk</p>
                <p>Silahkan Scan QR Produk dari Proses Timbang</p>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-center m-5">
          {scanned && (
            <button
              className="btn btn-sm btn-warning "
              onClick={() => setOpenQrRack(!openQrRack)}
            >
              {openQrRack ? "Close" : "Open"} Scan QR Rack
            </button>
          )}
        </div>
        {openQrRack && <QrScannerRack setScannedRack={setScannedRack} />}

        {/* {scannedRack && rack.length !== 0 && (
          <>
            <div>
              <p className=" ml-4 text-2xl font-bold text-gray-800">
                {scannedRack}{" "}
              </p>
              <p className="ml-4 text-xs text-gray-800">
                (Lokasi/Rak/Baris/Kolom)
              </p>

              <table className="table table-xs">
                <tr>
                  <th>Nama Item</th>
                  <th>No. TTBA</th>
                  <th>No. Analisa</th>
                </tr>
                {rack?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.Item_Name}</td>
                    <td>{item?.DNc_TTBANo}</td>
                    <td>{item?.DNc_No}</td>
                  </tr>
                ))}
              </table>
            </div>
            <div className="m-4">
              <form
                action=""
                // onSubmit={(e) => handleUpdate(e, newQty)}
              >
                <label className=" flex justify-center block text-gray-700 text-sm font-bold mb-2">
                  Update Jumlah
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-4"
                  id="newQty"
                  name="newQty"
                  type="number"
                  // max={maxQty}
                  // defaultValue={newQty}
                  // onChange={(e) => setNewQty(e.target.value)}
                />
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>
              </form>
            </div>
          </>
        )} */}

        {scannedRack && (
          <>
            <div>
              <div
                className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md m-5"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-teal-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">Informasi Rak: {scannedRack}</p>
                    <p className="text-sm">
                      Silahkan Input Product dengan no. ttba : {ttba} dan no.
                      analisa : {product?.recordsetTtba?.No_analisa}
                    </p>
                    {/* <p className="font-bold">Sisa Quantity : {maxQty}</p> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="m-5">
              <form
                action=""
                // onSubmit={(e) => handleUpdate(e, newQty)}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantity Sisa Timbang:
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="newQty"
                  name="newQty"
                  type="number"
                  value={product?.recordsetStockPosition?.Qty} 
                  readOnly
                  // onChange={(e) => setStartVatNo(Number(e.target.value))} // Update the startVatNo state on input change
                />
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
                  type="submit"
                  onClick={(e) => handleCreate(e)}
                >
                  Submit
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}
