import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QrScannerRackInto from "../components/QrScannerRackInto";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

export default function ModalValidateTimbang({
  handleCloseModal,
  DNcTimbang,
  itemId,
  noVatTimbang,
  setForceUpdate,
}) {
  const { loading, setLoading } = useContext(UserContext);

  const [scannedRackInto, setScannedRackInto] = useState(undefined); //harusnya namanya label ttba
  const [openQrRack, setOpenQrRack] = useState(true);
  const [product, setProduct] = useState([]);

  // const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  const url = "http://localhost:3000";

  const arrScanned = scannedRackInto?.split("#");
  const ttba = arrScanned?.[0]?.replace(/\//g, "-");
  const seqId = arrScanned?.[1];
  const vat = arrScanned?.[2];

  async function fetchProduct() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${url}/productsPerVat/${ttba}/${seqId}/${vat}`,
        { headers: { authentication: sessionStorage.getItem("access_token") } }
      );
      // console.log(data, "ini data fetchProduct");
      if (data.length === 0) {
        toast.error("Product Not Found");
      } else {
        setProduct(data);
      }
      // console.log(product);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
      });
      setScannedRackInto(undefined);
      setProduct([]);
    } finally {
      setLoading(false);
    }
  }

  console.log(DNcTimbang, itemId, "ini DNcTimbang dan itemId");
  console.log(product[0]?.No_analisa, product[0]?.ttba_itemid, "ini product");

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    const formatDNcTimbang = DNcTimbang.replace(/\//g, "-");
    const formatItemId = itemId.replace(/ /g, " ");
    try {
      if (product[0]?.No_analisa !== DNcTimbang) {
        throw new Error("DNc Timbang tidak sesuai");
      }
      if (product[0]?.ttba_itemid !== itemId) {
        throw new Error("Item ID tidak sesuai");
      }
      if (product[0]?.ttba_vatno !== noVatTimbang) {
        throw new Error("No Vat tidak sesuai");
      }
      const body = {
        DNcLabel: product[0]?.No_analisa,
        ItemIdLabel: product[0]?.ttba_itemid,
        no_vat: product[0]?.ttba_vatno,
      };
      const { data } = await axios.patch(
        `${url}/validateTimbang/${formatDNcTimbang}/${formatItemId}`,
        body,
        { headers: { authentication: sessionStorage.getItem("access_token") } }
      );
      console.log(data);
      Swal.fire({
        title: "Success",
        text: "Data berhasil diupdate",
        icon: "success",
      });
      setForceUpdate((prev) => !prev);
      handleCloseModal();
    } catch (error) {
      console.log(error);
      if (error?.response) {
        Swal.fire({
          title: error?.response?.data?.message,
          icon: "error",
        });
      } else {
      Swal.fire({
        title: error?.message,
        icon: "error",
      });
    }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // console.log(scanned, "ini scanned"); 
    if (scannedRackInto !== undefined) {
      fetchProduct();
      setOpenQrRack(false);
    }
  }, [scannedRackInto]);

  console.log(product, "ini product");

  return (
    <>
      <div className="fixed top-0 left-0 z-[100] h-full w-full bg-gray-600 bg-opacity-40 flex items-center justify-center">
        <div className="w-[80%] md:w-1/2 mb-20 p-6 pb-8 bg-white rounded">
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

          {scannedRackInto && product.length !== 0 && (
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
                    <div className="w-full">
                      {/* <p className="font-bold">Informasi Rak</p>
                      <p className="text-sm font-bold">
                        Tidak ada Product dalam Rack ini
                      </p>
                      <p>Product yang ingin dipindahkan,</p>
                      <p>Item Id: </p>
                      <p>ttba No: </p>
                      <p>Quantity: </p>
                      <p>No Vat: </p>
                      <p>DNc Number: </p> */}
                      <table className="table-auto mt-4 w-full">
                        <tbody>
                          <tr>
                            <td className="px-4 py-2">No. Analisa label</td>
                            <td className="px-4 py-2 flex items-center">
                              {product[0]?.No_analisa !== DNcTimbang ? (
                                <p className="text-red-600 px-2">
                                  : {product[0]?.No_analisa}{" "}
                                </p>
                              ) : (
                                <p>: {product[0]?.No_analisa} </p>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className=" px-4 py-2">Item ID label</td>
                            <td className=" px-4 py-2 flex items-center">
                              {product[0]?.ttba_itemid !== itemId ? (
                                <p className="text-red-600 px-2">
                                  : {product[0]?.ttba_itemid}{" "}
                                </p>
                              ) : (
                                <p>: {product[0]?.ttba_itemid} </p>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className=" px-4 py-2">No. Vat label</td>
                            <td className=" px-4 py-2 flex items-center">
                              {product[0]?.ttba_vatno !== noVatTimbang ? (
                                <p className="text-red-600 px-2">
                                  : {product[0]?.ttba_vatno}{" "}
                                </p>
                              ) : (
                                <p>: {product[0]?.ttba_vatno} </p>
                              )}
                            </td>
                          </tr>
                          <br />
                          <tr>
                            <td className=" px-4 py-2">No. Analisa Timbang</td>
                            <td className=" px-4 py-2 flex items-center">
                              {product[0]?.No_analisa !== DNcTimbang ? (
                                <p className="text-red-600 px-2">
                                  : {DNcTimbang}{" "}
                                </p>
                              ) : (
                                <p>: {DNcTimbang} </p>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className=" px-4 py-2">Item ID Timbang</td>
                            <td className=" px-4 py-2 flex items-center">
                              {product[0]?.ttba_itemid !== itemId ? (
                                <p className="text-red-600 px-2">
                                  : {itemId}{" "}
                                </p>
                              ) : (
                                <p>: {itemId} </p>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className=" px-4 py-2">No. Vat Timbang</td>
                            <td className=" px-4 py-2 flex items-center">
                              {product[0]?.ttba_vatno !== noVatTimbang ? (
                                <p className="text-red-600 px-2">
                                  : {noVatTimbang}{" "}
                                </p>
                              ) : (
                                <p>: {noVatTimbang} </p>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-5">
                {!loading && (
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
                    type="submit"
                    onClick={(e) => handleUpdate(e)}
                  >
                    Validate
                  </button>
                )}
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
