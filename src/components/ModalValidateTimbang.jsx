import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QrScannerRackInto from "../components/QrScannerRackInto";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

export default function ModalValidateTimbang({
  handleCloseModal,
  // ttba,
  DNcNo,
  itemId,
  qty,
  processDate,
  itemName,
  scannedRackFirst,
  setForceUpdate,
  // ttbaNo,
  ttbaScanned,
  status_ttba,
}) {
  const { loading, setLoading } = useContext(UserContext);

  const [scannedRackInto, setScannedRackInto] = useState(undefined);
  const [openQrRack, setOpenQrRack] = useState(true);
  const [rackInto, setRackInto] = useState([]);
  const [newQty, setNewQty] = useState(0);
  const [product, setProduct] = useState([]);

  // const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  const url = "http://localhost:3000";


  return (
    <>
      <div className="fixed top-0 left-0 z-[100] h-full w-full bg-gray-600 bg-opacity-40 flex items-center justify-center">
        <div
          className="w-[80%] md:w-1/2 mb-20 p-6 pb-8 bg-white rounded"
        >
          <div className="flex justify-between items-center">
            <label className="font-medium text-normal text-gray-900">
              Silahkan Scan Label TTBA
            </label>

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

          {/* {scannedRackInto && rackInto.length !== 0 && (
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
                      <p>Item Id: </p>
                      <p>Name:  </p>
                      <p>Quantity: </p>
                      <p>DNc Number:</p>
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
                    // max={qty}
                    value={qty}
                    readOnly
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
          )} */}

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
                      <p>Item Id: </p>
                      <p>ttba No: </p>
                      <p>Quantity: </p>
                      <p>No Vat: </p>
                      <p>DNc Number: </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-5">
                <form>
                  <label className="block text-gray-700 text-sm font-bold mb-2 ">
                    Quantity Product
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newQty"
                    name="newQty"
                    type="number"
                    // max={qty}
                    // defaultValue={qty}
                    // value={qty}
                    readOnly
                    // onChange={(e) => setNewQty(e.target.value)}
                  />
                  {/* <label className="block text-gray-700 text-sm font-bold mb-2 ">
                    Vat No
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="vatNo"
                    name="vatNo"
                    type="number"
                    // max={qty}
                    // value={qty}
                    onChange={(e) => setVatNo(e.target.value)}
                  /> */}
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
