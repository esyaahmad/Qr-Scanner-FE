import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QrScannerRack from "../components/QrScannerRack";
import axios from "axios";
import ModalSwapRack from "../components/ModalSwapRack";
import { UserContext } from "../context/UserContext";
export default function ScannerRack() {
  const {setLoading} = useContext(UserContext);

  const [openQrRack, setOpenQrRack] = useState(true);
  const [scannedRack, setScannedRack] = useState(undefined);
  const [rack, setRack] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ttba, setTtba] = useState(undefined);
  const [itemId, setItemId] = useState(undefined);
  const [qty, setQty] = useState(0);
  const [processDate, setProcessDate] = useState(undefined);
  const [itemName, setItemName] = useState(undefined);
  const [scannedRackFirst, setScannedRackFirst] = useState(undefined);
  const [ttbaNo, setTtbaNo] = useState(undefined);
  const [statusTtba, setStatusTtba] = useState(undefined);

  const [forceUpdate, setForceUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  // const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  const url = "http://localhost:3000";

  console.log(`${url}/racks/${scannedRack}`);

  async function fetchRack() {
    setLoading(true);
    const loadingToastId = toast.info("Fetching product data...", {
      autoClose: false,
    });
    try {
      const { data } = await axios.get(`${url}/racks/${scannedRack}`, {headers: {authentication: sessionStorage.getItem("access_token")}});
      // if (data.length === 0) {
      //   throw new Error("Rack ini kosong");
      // }
      setRack(data);
      toast.success("Rack data fetched successfully");
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 404) {
        toast.error(error?.response?.data?.message);
        setScannedRack(undefined);
        setRack([]);
      } else {
      toast.error(error?.response?.data?.message);
      setScannedRack(undefined);
      setRack([]);
      }
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  }

  function splitByHashTtba(inputString) {
    // Split the input string using '#' as the delimiter and return the first part
    return String(inputString).split("#")[0];
  }

  function splitByHashSeqId(inputString) {
    // Split the input string using '#' as the delimiter and return the first part
    return String(inputString).split("#")[1];
  }

  function splitByHashVatQty(inputString) {
    // Split the input string using '#' as the delimiter and return the first part
    return String(inputString).split("#")[2];
  }

  useEffect(() => {
    if (scannedRack !== undefined) {
      fetchRack();
      setScannedRackFirst(scannedRack);
      setOpenQrRack(false);
    }
  }, [scannedRack, forceUpdate]);
  console.log(rack);

  const filteredRack = rack.filter(item =>
    splitByHashTtba(item?.DNc_TTBANo).toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredRack, "<<< FILTERED RACK");
  return (
    <>
      {isModalOpen && (
        <ModalSwapRack
          handleCloseModal={() => setIsModalOpen(false)}
          DNcNo={ttba}
          itemId={itemId}
          qty={qty}
          itemName={itemName}
          processDate={processDate}
          scannedRackFirst={scannedRackFirst}
          setForceUpdate={setForceUpdate}
          ttbaScanned={ttbaNo}
          status_ttba={statusTtba}
          // vatNo={vatNo}
          // vatQty={vatQty}
        />
      )}
      <div className="mt-8 h-screen ">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-800">Move Product</p>
            <button
              className="btn btn-sm btn-success"
              onClick={() => setOpenQrRack(!openQrRack)}
            >
              {openQrRack ? "Close" : "Open"} Scan QR
            </button>
          </div>
          {/* {openQr && <QrScanner setScanned={setScanned} />} */}
          {openQrRack && <QrScannerRack setScannedRack={setScannedRack} />}
        </div>

        <div>
          {rack.length > 0 ? (
            <>
            <div className="flex justify-between mt-2 mb-4">
              <p className=" ml-4 text-2xl font-bold text-gray-800">
                {scannedRack}{" "}
                <p className="text-xs text-gray-800">
                  (Lokasi/Rak/Baris/Kolom)
                </p>
              </p>
            
                <input
                  type="text"
                  placeholder="Search by TTBA No"
                  className="input input-bordered mx-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
             
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>DNc_No</th>
                    <th>ttba_no</th>
                    <th>Item_ID</th>
                    <th>Item_Name</th>
                    <th>Qty</th>
                    {/* <th>vat_qty</th> */}
                    <th>vat_No</th>
                    <th>Process_Date</th>
                    <th>Action</th>

                    {/* <th>User_ID</th>
          <th>Delegated_To</th>
          <th>flag_update</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredRack?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.DNc_No}</td>
                      <td>{splitByHashTtba(item?.DNc_TTBANo)}</td>
                      <td>{item.Item_ID}</td>
                      <td>{item.Item_Name}</td>
                      <td>{item.Qty}</td>
                      {/* <td>{splitByHashVatNo(item?.DNc_TTBANo)}</td> */}
                      <td>{splitByHashVatQty(item?.DNc_TTBANo)}</td>
                      <td>
                        {item.Process_Date.replace("T", " ").replace("Z", "")}
                      </td>
                      <td>
                        <button
                          className="btn btn-accent"
                          onClick={() => {
                            if (item.Qty === 0) {
                              return toast.error(
                                "Product is empty, cannot be moved!"
                              );
                            }
                            setIsModalOpen(true);
                            setTtba(item.DNc_No);
                            setItemId(item.Item_ID);
                            setQty(item.Qty);
                            setProcessDate(item.Process_Date);
                            setItemName(item.Item_Name);
                            setTtbaNo(item?.DNc_TTBANo);
                            setStatusTtba(item?.Status);
                            // setVatNo(splitByHashVatNo(item?.DNc_TTBANo))
                            // setVatQty(splitByHashVatQty(item?.DNc_TTBANo))
                          }}
                        >
                          Move
                        </button>
                      </td>

                      {/* <td>{item.User_ID}</td>
            <td>{item.Delegated_To}</td>
            <td>{item.flag_update}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div
              className=" fixed bottom-0 w-full bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 m-5"
              role="alert"
            >
              <p className="font-bold">Rack</p>
              <p>Silahkan Scan QR Rack</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
