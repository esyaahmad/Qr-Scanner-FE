import QrScanner from "../components/QrScanner";
import QrScannerRack from "../components/QrScannerRack";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//handleupdate udah bener, tinggal create
export default function Scanner() {
  const [openQr, setOpenQr] = useState(true);
  const [openQrRack, setOpenQrRack] = useState(false);
  const [loading, setLoading] = useState(false);

  const [scanned, setScanned] = useState(undefined);
  const [scannedRack, setScannedRack] = useState(undefined);

  const [product, setProduct] = useState([]);
  const [rack, setRack] = useState([]);

  const [newQty, setNewQty] = useState(0);
  const [maxQty, setMaxQty] = useState(0);

  // const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  const url = "http://localhost:3000";

  const navigate = useNavigate();

  // console.log(`${url}/products/${scanned}`);
  // console.log(`${url}/racks/${scannedRack}/${product[0]?.item_name}`);
  // console.log(
  //   `${url}/racks/${scannedRack}/${product[0]?.ttba_itemid?.replace(
  //     /\s/g,
  //     "_"
  //   )}/${product[0]?.No_analisa?.replace(/\//g, "-")}`
  // );

  async function fetchProduct() {
    setLoading(true);
    const loadingToastId = toast.info("Fetching product data...", {
      autoClose: false,
    });
    try {
      const { data } = await axios.get(`${url}/products/${scanned}`);
      console.log(data, "ini data fetchProduct");
      if (data.length === 0) {
        toast.error("Product Not Found");
      } else {
        setProduct(data);
        toast.success("Product data fetched successfully");
      }
      // console.log(product);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Product tidak ditemukan");
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
    const itemId = product[0]?.ttba_itemid?.replace(/\s/g, "_");
    const noAnalisa = product[0]?.No_analisa?.replace(/\//g, "-");
    try {
      const { data } = await axios.get(
        `${url}/racks/${scannedRack}/${itemId}/${noAnalisa}`
      );
      if (data.length === 0) {
        toast.error("Rack Not Found");
      } else {

        setRack(data);
        toast.success("Rack data fetched successfully");
      }
      // console.log(rack);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || "Rak Kosong");
      // setScannedRack(undefined);
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    if (rack.length === 0) {
      if (newQty <= maxQty) {
        setMaxQty(maxQty - newQty);
        handleCreate(e);
        setScannedRack(undefined)
        setOpenQrRack(true)
      } else {
        alert("New quantity cannot exceed maximum quantity.");
      }
      
    } else {
      if (newQty <= maxQty) {
        setMaxQty(maxQty - newQty);
        handleUpdate(e);
      } else {
        alert("New quantity cannot exceed maximum quantity.");
      }
    }
  };

  const handleUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (rack.length > 0) {
        if (newQty <= 0 || newQty === undefined) {
          throw new Error("Quantity must be greater than 0.");
        }
        const response = await axios.patch(
          `${url}/racks/${scannedRack}/${product[0]?.ttba_itemid?.replace(
            /\s/g,
            "_"
          )}/${product[0]?.No_analisa?.replace(/\//g, "-")}`,
          { newQty }
        );

        if (maxQty - newQty === 0) {
          navigate("/");
          Swal.fire({
            title: `Success Updated ${newQty} Product to ${scannedRack}`,
            icon: "success",
          });
        } else {
          navigate("/scanner");
          Swal.fire({
            title: `Success Updated ${newQty} Product to ${scannedRack}`,
            icon: "success",
          });
        }
      }
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response) {
        toast.error(
          "An error occurred while updating product. Please try again later."
        );
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (newQty <= 0) {
        throw new Error("Quantity must be greater than 0.");
      }
      const body = {
        newQty,
        Process_Date: product[0]?.ttba_date,
        Item_Name: (product[0]?.item_name).replace(/_/g, " "),
      };

      const response = await axios.post(
        `${url}/racks/${scannedRack}/${product[0]?.ttba_itemid?.replace(
          /\s/g,
          "_"
        )}/${product[0]?.No_analisa?.replace(/\//g, "-")}`,
        body
      );

      Swal.fire({
        title: "Success Added Product to Rack",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });

      if (maxQty - newQty === 0) {
        navigate("/");
        Swal.fire({
          title: `Success Updated ${newQty} Product to ${scannedRack}`,
          icon: "success",
        });
      } else {
        navigate("/scanner");
        Swal.fire({
          title: `Success Updated ${newQty} Product to ${scannedRack}`,
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error adding product to rack:", error);
      if (error.response) {
        toast.error(
          "An error occurred while adding product to rack. Please try again later."
        );
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
      // setScannedRack(undefined)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // async function fetch(){
    //   await fetchProduct();
    //   // setProductName(product[0]?.item_name);
    //   setOpenQr(false);
    //   // setNewQty(product[0]?.ttba_qty);
    // }
    console.log(scanned, "ini scanned");
    if (scanned !== undefined) {
      fetchProduct();
      // setProductName(product[0]?.item_name);
      setOpenQr(false);
      // console.log(product, '1234'); kalo ini undefined, harus buat useEffect lagi yang ngewatch product
      // setNewQty(product[0]?.ttba_qty);
      // fetch();jksbdabjbwajsajnkjdnsndnjknda
    }
  }, [scanned]);

  useEffect(() => {
    setNewQty(product[0]?.ttba_qty);
    setMaxQty(product[0]?.ttba_qty);
    // console.log(product, '1234');
  }, [product]);

  useEffect(() => {
    if (scannedRack !== undefined) {
      fetchRack();
      setOpenQrRack(false);
    }
  }, [scannedRack]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (maxQty > 0) {
        event.preventDefault();
        event.returnValue = ''; // This will display a default browser prompt
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [maxQty]);

  // console.log(product, 'ini product');
  console.log(newQty, "ini newQty");
  console.log(maxQty, "ini maxQty");
  // console.log(productName);
  // console.log(product[0]?.item_name);
  // console.log(rack);

  // useEffect(() => {
  //   if (scanned !== undefined) {
  //     fetchProduct();
  //     setOpenQr(false);
  //   }
  //   if (scannedRack !== undefined) {
  //     fetchRack();
  //     setOpenQrRack(false);
  //   }
  //   if (product.length > 0) {
  //     setNewQty(product[0]?.ttba_qty);
  //     setMaxQty(product[0]?.ttba_qty);
  //   }
  // }, [scanned, scannedRack, product.length, fetchProduct, fetchRack]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 backdrop-blur-lg">
          <div className="bg-white p-5 rounded-lg shadow-lg">Loading...</div>
        </div>
      )}
      <div className="mt-8 h-screen ">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-800">Product Scanner</p>
            <button
              className="btn btn-sm btn-success"
              onClick={() => setOpenQr(!openQr)}
            >
              {openQr ? "Close" : "Open"} Scan QR
            </button>
          </div>
          <ToastContainer position="bottom-right" draggable />
          {openQr && <QrScanner setScanned={setScanned} />}
        </div>
        <div>
          {product.length > 0 ? (
            <table className="table">
              <tbody>
                <tr>
                  <th>TTBA</th>
                  <td>{scanned}</td>
                </tr>
                {product?.map((item) => (
                  <>
                    <tr key={item?.TTBA_SeqID}>
                      <th>Nama Produk</th>
                      <td>{item?.item_name}</td>
                    </tr>
                    <tr>
                      <th>Group</th>
                      <td>{item?.group_name}</td>
                    </tr>
                    <tr>
                      <th>No. PO</th>
                      <td>{item?.TTBA_SourceDocNo}</td>
                    </tr>
                    <tr>
                      <th>No. Batch/Lot</th>
                      <td>{item?.ttba_batchno}</td>
                    </tr>
                    <tr>
                      <th>No. Analisa</th>
                      <td>{item?.No_analisa}</td>
                    </tr>
                    <tr>
                      <th>Pabrik</th>
                      <td>{item?.prc_name}</td>
                    </tr>
                    <tr>
                      <th>Pemsok</th>
                      <td>{item?.po_suppname}</td>
                    </tr>
                    <tr>
                      <th>Tgl. Terima</th>
                      <td>
                        {(item?.ttba_date).replace("T", " ").replace("Z", "")}
                      </td>
                    </tr>
                    <tr>
                      <th>tgl. Daluarsa</th>
                      <td>{item?.Tgl_daluarsa}</td>
                    </tr>
                    <tr>
                      <th>Qty</th>
                      <td>{item?.ttba_qty}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <div
                class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 m-5"
                role="alert"
              >
                <p class="font-bold">Product</p>
                <p>Silahkan Scan QR Produk</p>
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

        {scannedRack && rack.length !== 0 && (
          <>
            <div>
              <table className="table">
                <tbody>
                  <tr>
                    <th>Lokasi</th>
                    <td>{rack[0]?.Lokasi}</td>
                  </tr>
                  <tr>
                    <th>Rak</th>
                    <td>{rack[0]?.Rak}</td>
                  </tr>
                  <tr>
                    <th>Baris</th>
                    <td>{rack[0]?.Baris}</td>
                  </tr>
                  <tr>
                    <th>Kolom</th>
                    <td>{rack[0]?.Kolom}</td>
                  </tr>
                  <tr>
                    <th>Nama Barang</th>
                    <td>{rack[0]?.Item_Name}</td>
                  </tr>
                  <tr>
                    <th>Qty</th>
                    <td>{rack[0]?.Qty}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="m-4">
              <form
                action=""
                // onSubmit={(e) => handleUpdate(e, newQty)}
              >
                {/* awalnya */}
                {/* <form
                action=""
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission behavior
                  if (parseInt(newQty) <= parseInt(maxQty)) {
                    setMaxQty(parseInt(maxQty) - parseInt(newQty)); // Update maxQty
                    handleUpdate(e, newQty); // Call handleUpdate
                  } else {
                    alert("New quantity cannot exceed maximum quantity!");
                  }
                }}
              > */}
                <label className=" flex justify-center block text-gray-700 text-sm font-bold mb-2">
                  Update Jumlah
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-4"
                  id="newQty"
                  name="newQty"
                  type="number"
                  max={+maxQty}
                  defaultValue={0}
                  onChange={(e) => setNewQty(e.target.value)}
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
        )}
        {scannedRack && rack.length === 0 && (
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
                    <p className="font-bold">Informasi Rak</p>
                    <p className="text-sm">Tidak ada Product dalam Rack ini</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-5">
              <form
                action=""
                // onSubmit={(e) => handleUpdate(e, newQty)}
              >
                <label className="block text-gray-700 text-sm font-bold mb-2 ">
                  Tambahkan Product
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="newQty"
                  name="newQty"
                  type="number"
                  max={+maxQty}
                  defaultValue={0}
                  // value={product[0]?.ttba_qty}
                  // value={newQty || ""}
                  onChange={(e) => setNewQty(e.target.value)}
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
        )}
      </div>
    </>
  );
}
