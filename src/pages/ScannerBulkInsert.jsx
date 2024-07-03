import QrScanner from "../components/QrScanner";
import QrScannerRack from "../components/QrScannerRack";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";

//handleupdate udah bener, tinggal create
//insert bulk item (transaction ok), qty_lessnya blm ok
export default function ScannerBulkInsert() {
  const {setLoading} = useContext(UserContext);
  const [openQr, setOpenQr] = useState(true);
  const [openQrRack, setOpenQrRack] = useState(false);
  const [scanned, setScanned] = useState(undefined);
  const [scannedRack, setScannedRack] = useState(undefined);
  const [product, setProduct] = useState([]);
  const [rack, setRack] = useState([]);
  const [cekRack, setCekRack] = useState([]);
  const [startVatNo, setStartVatNo] = useState(0); // State for start vat number
  const [endVatNo, setEndVatNo] = useState(0);

  // const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  const url = "http://localhost:3000";

  const navigate = useNavigate();

  const arrScanned = scanned?.split("#");
  const ttba = arrScanned?.[0]?.replace(/\//g, "-");
  const seqId = arrScanned?.[1];
  const vat = arrScanned?.[2];

  async function fetchProduct() {
    setLoading(true);
    const loadingToastId = toast.info("Fetching product data...", {
      autoClose: false,
    });
    try {
      const { data } = await axios.get(
        `${url}/productsPerTtba/${ttba}/${seqId}/${vat}`, { headers: { authentication: sessionStorage.getItem("access_token") } }
      );
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

  const result = product.map(
    (item) => `${item.TTBA_No}#${item.TTBA_SeqID}#${item.ttba_vatno}`
  );

  console.log(result, "ini result");

  async function fetchRack() {
    setLoading(true);
    const loadingToastId = toast.info("Fetching product data...", {
      autoClose: false,
    });
    try {
      const { data } = await axios.post(
        `${url}/racksByArrTtba/${scannedRack}`,
        { ttbaScanned: result }
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
      setRack([]);
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  }

  async function fetchCekRack() {
    setLoading(true);
    // const loadingToastId = toast.info("Fetching product data...", {
    //   autoClose: false,
    // });
    try {
      const formatDncNo = (product[0]?.No_analisa).replace(/\//g, "-");
      const { data } = await axios.get(
        `${url}/racksByProductDncNo/${formatDncNo}`
      );
      setCekRack(data);

      console.log(data, "ini data fetchCekRack");
    } catch (error) {
      console.log(error);
      // toast.error(error?.response?.data?.error || "Rak Kosong"); 
      // setScannedRack(undefined); 
      setRack([]);
    } finally {
      // toast.dismiss(loadingToastId); 
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    // const product2 = [
    //   {
    //     TTBA_No: "00073/I/24/PC/TTBA/BB/PP",
    //     TTBA_SeqID: 1,
    //     ttba_itemid: "AC 206",
    //     group_name: "",
    //     item_name: "Pantoprazole Sodium Sterile (Lyophilized)",
    //     ttba_batchno: "APSS23010",
    //     prc_name: "RAJASTHAN ANTIBIOTICS LTD.,",
    //     po_suppname: "TITIAN ABADI LESTARI",
    //     ttba_date: "2024-01-09T16:49:13.570Z",
    //     ttba_qty: 4000,
    //     ttba_itemUnit: "g",
    //     ttba_prcid: "00491",
    //     ttba_suppid: "000036",
    //     ttba_itemrevision: "",
    //     TTBA_SourceDocNo: "00030/XII/23/PG/PO/BB/LAPI",
    //     No_analisa: "0097/24/AC206/02",
    //     best_before: "01 Jan 1900",
    //     Tgl_daluarsa: "01 Jul 2026",
    //     TTBA_VATQTY: 4,
    //     Item_Type: "BB",
    //     ttba_vatno: 1,
    //     TTBA_qty_per_Vat: 1000,
    //   },
    //   {
    //     TTBA_No: "00073/I/24/PC/TTBA/BB/PP",
    //     TTBA_SeqID: 1,
    //     ttba_itemid: "AC 206",
    //     group_name: "",
    //     item_name: "Pantoprazole Sodium Sterile (Lyophilized)",
    //     ttba_batchno: "APSS23010",
    //     prc_name: "RAJASTHAN ANTIBIOTICS LTD.,",
    //     po_suppname: "TITIAN ABADI LESTARI",
    //     ttba_date: "2024-01-09T16:49:13.570Z",
    //     ttba_qty: 4000,
    //     ttba_itemUnit: "g",
    //     ttba_prcid: "00491",
    //     ttba_suppid: "000036",
    //     ttba_itemrevision: "",
    //     TTBA_SourceDocNo: "00030/XII/23/PG/PO/BB/LAPI",
    //     No_analisa: "0097/24/AC206/02",
    //     best_before: "01 Jan 1900",
    //     Tgl_daluarsa: "01 Jul 2026",
    //     TTBA_VATQTY: 4,
    //     Item_Type: "BB",
    //     ttba_vatno: 2,
    //     TTBA_qty_per_Vat: 1000,
    //   },
    //   {
    //     TTBA_No: "00073/I/24/PC/TTBA/BB/PP",
    //     TTBA_SeqID: 1,
    //     ttba_itemid: "AC 206",
    //     group_name: "",
    //     item_name: "Pantoprazole Sodium Sterile (Lyophilized)",
    //     ttba_batchno: "APSS23010",
    //     prc_name: "RAJASTHAN ANTIBIOTICS LTD.,",
    //     po_suppname: "TITIAN ABADI LESTARI",
    //     ttba_date: "2024-01-09T16:49:13.570Z",
    //     ttba_qty: 4000,
    //     ttba_itemUnit: "g",
    //     ttba_prcid: "00491",
    //     ttba_suppid: "000036",
    //     ttba_itemrevision: "",
    //     TTBA_SourceDocNo: "00030/XII/23/PG/PO/BB/LAPI",
    //     No_analisa: "0097/24/AC206/02",
    //     best_before: "01 Jan 1900",
    //     Tgl_daluarsa: "01 Jul 2026",
    //     TTBA_VATQTY: 4,
    //     Item_Type: "BB",
    //     ttba_vatno: 3,
    //     TTBA_qty_per_Vat: 1000,
    //   },
    //   {
    //     TTBA_No: "00073/I/24/PC/TTBA/BB/PP",
    //     TTBA_SeqID: 1,
    //     ttba_itemid: "AC 206",
    //     group_name: "",
    //     item_name: "Pantoprazole Sodium Sterile (Lyophilized)",
    //     ttba_batchno: "APSS23010",
    //     prc_name: "RAJASTHAN ANTIBIOTICS LTD.,",
    //     po_suppname: "TITIAN ABADI LESTARI",
    //     ttba_date: "2024-01-09T16:49:13.570Z",
    //     ttba_qty: 4000,
    //     ttba_itemUnit: "g",
    //     ttba_prcid: "00491",
    //     ttba_suppid: "000036",
    //     ttba_itemrevision: "",
    //     TTBA_SourceDocNo: "00030/XII/23/PG/PO/BB/LAPI",
    //     No_analisa: "0097/24/AC206/02",
    //     best_before: "01 Jan 1900",
    //     Tgl_daluarsa: "01 Jul 2026",
    //     TTBA_VATQTY: 4,
    //     Item_Type: "BB",
    //     ttba_vatno: 4,
    //     TTBA_qty_per_Vat: 1000,
    //   },
    // ];
    setLoading(true);
    e.preventDefault();
    try {
      if (startVatNo > endVatNo) {
        throw new Error("Start Vat Number must be smaller than End Vat Number");
      }
      if (startVatNo === 0 || endVatNo === 0) {
        throw new Error("Start Vat Number and End Vat Number must be filled");
      }
      // if (startVatNo === endVatNo) {
      //   throw new Error("Start Vat Number and End Vat Number must be different");
      // }
      if (startVatNo < 0 || endVatNo < 0) {
        throw new Error("Start Vat Number and End Vat Number must be positive");
      }
      if (startVatNo > product[0]?.TTBA_VATQTY) {
        throw new Error("Start Vat Number must be smaller than Total Vat Quantity");
      }
      if (endVatNo > product[0]?.TTBA_VATQTY) {
        throw new Error("End Vat Number must be smaller than Total Vat Quantity");
      }
      // if (endVatNo - startVatNo > 100) {
      //   throw new Error("Vat Number range must be less than or equal to 100");
      // }
      if (endVatNo - startVatNo < 0) {
        throw new Error("End Vat Number must be greater than Start Vat Number");
      }

      const productToInsert = product.filter(
        (p) => p.ttba_vatno >= startVatNo && p.ttba_vatno <= endVatNo
      ); // Filter the product array based on the specified range
      await axios.post(`${url}/racks/${scannedRack}`, productToInsert, { headers: { authentication: sessionStorage.getItem("access_token") } });

      Swal.fire({
        title: `Success Added`,
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding product to rack:", error);
      if (error.message === "Start Vat Number must be smaller than End Vat Number" 
      || error.message === "Start Vat Number and End Vat Number must be filled" 
      || error.message === "Start Vat Number and End Vat Number must be positive" 
      || error.message === "Start Vat Number must be smaller than Total Vat Quantity" 
      || error.message === "End Vat Number must be smaller than Total Vat Quantity" 
      || error.message === "End Vat Number must be greater than Start Vat Number") {
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
      fetchCekRack();
      fetchProduct();
      setOpenQr(false);
    }
  }, [scanned]);

  useEffect(() => {
    // console.log(scanned, "ini scanned");
      fetchCekRack();
  }, [product]);

  useEffect(() => {
    if (scannedRack !== undefined) {
      fetchRack();
      setOpenQrRack(false);
    }
  }, [scannedRack]);

  // console.log(product, "ini product");
  // console.log(cekRack, "ini cekRack");

  // console.log(rack, "ini rack");

  return (
    <>
      <div className="mt-8 ">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-800">
              Input Produk Massal
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
          {product.length > 0 ? (
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
                      {product[0]?.item_name} {product[0]?.ttba_itemid}
                    </td>
                  </tr>
                  <tr>
                    <th>Group</th>
                    <td>{product[0]?.group_name}</td>
                  </tr>
                  <tr>
                    <th>No. PO</th>
                    <td>{product[0]?.TTBA_SourceDocNo}</td>
                  </tr>
                  <tr>
                    <th>No. Batch/Lot</th>
                    <td>{product[0]?.ttba_batchno}</td>
                  </tr>
                  <tr>
                    <th>No. Analisa</th>
                    <td>{product[0]?.No_analisa}</td>
                  </tr>
                  <tr>
                    <th>Pabrik</th>
                    <td>{product[0]?.prc_name}</td>
                  </tr>
                  <tr>
                    <th>Pemsok</th>
                    <td>{product[0]?.po_suppname}</td>
                  </tr>
                  <tr>
                    <th>Tgl. Terima</th>
                    <td>
                      {(product[0]?.ttba_date)
                        .replace("T", " ")
                        .replace("Z", "")}
                    </td>
                  </tr>
                  <tr>
                    <th>tgl. Daluarsa</th>
                    <td>{product[0]?.Tgl_daluarsa}</td>
                  </tr>
                  <tr>
                    <th>Qty TTBA</th>
                    <td>
                      {product[0]?.ttba_qty} {product[0]?.ttba_itemUnit}
                    </td>
                  </tr>
                  <tr>
                    <th>Jumlah Vat</th>
                    <td>
                      {product[0]?.TTBA_VATQTY}
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <table className="table table-zebra table-sm">
                <tbody>

                <tr>
                  <th>TTBA</th>
                  <th>Nama Item</th>
                  <th>Quantity</th>
                  <th>Lokasi</th>
                </tr>
                {cekRack?.map((item) => (
                  <>
                    <tr key={item?.DNc_TTBANo}>
                      <td>
                        {item?.DNc_TTBANo || '-'}
                      </td>
                      <td>
                        {item?.Item_Name}
                      </td>
                      <td>{item?.Qty}</td>
                      <td>{item?.Lokasi}/{item?.Rak}/{item?.Baris}/{item?.Kolom}</td>

                    </tr>
                    
                  </>
                ))}
                </tbody>

              </table>
            </>
          ) : (
            <>
              <div
                className="fixed bottom-0 w-full bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 m-5"
                role="alert"
              >
                <p className="font-bold">Product</p>
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
                      Silahkan Input Product dengan no. ttba : {ttba} dan no. analisa : {product[0]?.No_analisa}
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
                  Isi nomor Vat yang akan diinput
                </label>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Start Vat Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="startVatNo"
                  name="startVatNo"
                  type="number"
                  // value={startVatNo} // Bind the input value to the startVatNo state
                  onChange={(e) => setStartVatNo(Number(e.target.value))} // Update the startVatNo state on input change
                />
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  End Vat Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="endVatNo"
                  name="endVatNo"
                  type="number"
                  // value={endVatNo} // Bind the input value to the endVatNo state
                  onChange={(e) => setEndVatNo(Number(e.target.value))} // Update the endVatNo state on input change
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
