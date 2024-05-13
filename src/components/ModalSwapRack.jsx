import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QrScannerRackInto from "../components/QrScannerRackInto";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ModalSwapRack({
  handleCloseModal,
  ttba,
  itemId,
  qty,
  processDate,
  itemName,
  scannedRackFirst,
  setForceUpdate,
}) {
  const [scannedRackInto, setScannedRackInto] = useState(undefined);
  const [openQrRack, setOpenQrRack] = useState(true);
  const [rackInto, setRackInto] = useState([]);
  const [newQty, setNewQty] = useState(0);
  const [loading, setLoading] = useState(false);
  //   console.log(scannedRackInto, "ini scannedRackInto");
  //   console.log(ttba);
  //   console.log(itemId);
  //   console.log(scannedRackFirst);
  const ttbaRev = ttba.replace(/\//g, "-");
  const itemIdRev = itemId.replace(/\s/g, "_");

  const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  //   console.log(`${url}/racks/${scannedRackInto}/${ttbaRev}/${itemIdRev}`);

  async function fetchRackInto() {
    setLoading(true);
    const loadingToastId = toast.info("Fetching product data...", {
      autoClose: false,
    });
    try {
        // const cekRack = await axios.get(`${url}/racks/${scannedRackInto}/${itemIdRev}/${ttbaRev}`);
        // if (cekRack.data.length === 0) {
        //   throw new Error("No data found for the scanned rack.");
        // }
    
      const { data } = await axios.get(
        `${url}/racks/${scannedRackInto}/${itemIdRev}/${ttbaRev}`
      );

      if (data.length === 0) {
        throw new Error("No data found in the rack.");
      }
      setRackInto(data);
      toast.success("Rack data fetched successfully");
    } catch (error) {
      console.log(error);
      toast.error('Rack tidak ditemukan');
      setScannedRackInto(undefined);
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
      if (newQty <= 0) {
        throw new Error("Quantity must be greater than 0.");
      }
      const body = {
        newQty,
        Process_Date: processDate,
        Item_Name: itemName,
      };

      await axios.post(
        `${url}/racks/${scannedRackInto}/${itemIdRev}/${ttbaRev}`,
        body
      );

      await axios.patch(
        `${url}/racks/${scannedRackFirst}/${itemIdRev}/${ttbaRev}/dec`,
        { newQty }
      );

      Swal.fire({
        title: "Success Added Product to Rack",
        icon: "success",
      });
      setForceUpdate((prev) => !prev);

      handleCloseModal();
    } catch (error) {
      console.error("Error adding product to rack:", error);
      if (error.response) {
        toast.error(
          "An error occurred while adding product to rack. Please try again later."
        );
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (rackInto.length > 0) {
        if (newQty <= 0) {
          throw new Error("Quantity must be greater than 0.");
        }
        await axios.patch(
          `${url}/racks/${scannedRackInto}/${itemIdRev}/${ttbaRev}`,
          { newQty }
        );

        await axios.patch(
          `${url}/racks/${scannedRackFirst}/${itemIdRev}/${ttbaRev}/dec`,
          { newQty }
        );

        Swal.fire({
          title: "Success Updated Product",
          icon: "success",
        });
        setForceUpdate((prev) => !prev);
        handleCloseModal();
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

  const handleSubmit = (e) => {
    if (!scannedRackInto || !itemIdRev || !ttbaRev) {
      throw new Error("Invalid data for product operation.");
    }
    // if (rackInto.length === 0 && (newQty <= 0 || !Number.isInteger(newQty))) {
    //   throw new Error("Quantity must be a positive integer.");
    // }
    if (rackInto.length === 0) {
      handleCreate(e);
    } else {
      handleUpdate(e);
    }
  };

  useEffect(() => {
    // console.log(scanned, "ini scanned");
    if (scannedRackInto !== undefined) {
      fetchRackInto();
      setOpenQrRack(false);
    }
  }, [scannedRackInto]);
  //   console.log(rackInto);

  return (
    <>
       
      <div className="fixed top-0 left-0 z-[100] h-full w-full bg-gray-600 bg-opacity-40 flex items-center justify-center">
        <div className="w-[80%] md:w-1/2 lg:w-1/3 mb-20 p-6 pb-8 bg-white rounded">
          <div className="flex justify-between items-center">
            <label className="font-medium text-normal text-gray-900">
              Silahkan Scan Rak Tujuan
            </label>
            {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 backdrop-blur-lg">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            Loading...
          </div>
        </div>
      )}

            <div className="mb-2 flex justify-end items-center">
              <button
                type="button"
                className="font-bold hover:opacity-50 transition-all duration-75"
                onClick={handleCloseModal}
              >
                X
              </button>
            </div>
          </div>

          {/* <hr className="mt-2" /> */}
          <div className="flex justify-center">
            {openQrRack && (
              <QrScannerRackInto setScannedRackInto={setScannedRackInto} />
            )}
          </div>

          <div className="flex justify-center m-4 ">
            <button
              className="btn btn-sm btn-success"
              onClick={() => setOpenQrRack(!openQrRack)}
            >
              {openQrRack ? "Close" : "Open"} Scan QR
            </button>
          </div>

          {scannedRackInto && rackInto.length !== 0 && (
            <>
              <div>
                <div
                  className="bg-orange-100 border-t-4 border-orange-500 rounded-b text-teal-900 px-4 py-3 shadow-md m-5"
                  role="alert"
                >
                  <div className="flex">
                    <div className="py-1">
                      <svg
                        className="fill-current h-6 w-6 text-orange-500 mr-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold">Terdapat produk pada rak ini,</p>
                      <p>Item Id: {itemId}</p>
                      <p>Name: {itemName} </p>
                      <p>Quantity: {rackInto[0]?.Qty}</p>
                      <p>DNc Number: {ttba}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-5">
                <form>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ">
                    Pindahkan Product
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newQty"
                    name="newQty"
                    type="number"
                    max={qty}
                    onChange={(e) => setNewQty(e.target.value)}
                  />
                  {!loading && (
                    <button
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
                      type="submit"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Submit
                    </button>
                  )}
                </form>
              </div>
            </>
          )}

          {scannedRackInto && rackInto.length === 0 && (
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
                      <p className="text-sm font-bold">
                        Tidak ada Product dalam Rack ini
                      </p>
                      <p>Product yang ingin dipindahkan,</p>
                      <p>Item Id: {itemId}</p>
                      <p>Name: {itemName} </p>
                      <p>Quantity: {qty}</p>
                      <p>DNc Number: {ttba}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-5">
                <form>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ">
                    Pindahkan Product
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newQty"
                    name="newQty"
                    type="number"
                    max={qty}
                    onChange={(e) => setNewQty(e.target.value)}
                  />
                  {!loading && (
                    <button
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
                      type="submit"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Submit
                    </button>
                  )}
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// CreateNewFormModal.propTypes = {
//   jenisForm: PropTypes.string,
//   generateForm: PropTypes.func,
//   handleCloseModal: PropTypes.func,
//   handleChangeJenisForm: PropTypes.func,
// };
