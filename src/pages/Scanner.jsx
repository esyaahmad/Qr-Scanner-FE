import QrScanner from "../components/QrScanner";
import QrScannerRack from "../components/QrScannerRack";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Scanner() {
  const [openQr, setOpenQr] = useState(true);
  const [openQrRack, setOpenQrRack] = useState(false);

  const [scanned, setScanned] = useState(undefined);
  const [scannedRack, setScannedRack] = useState(undefined);

  const [product, setProduct] = useState([]);
  // const [productName, setProductName] = useState(undefined);
  const [rack, setRack] = useState([]);

  const [newQty, setNewQty] = useState(0);
  // const [DNc_No, setDNc_No] = useState(0);

  const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  const navigate = useNavigate();

  console.log(`${url}/products/${scanned}`);
  console.log(`${url}/racks/${scannedRack}/${product[0]?.item_name}`);

  async function fetchProduct() {
    try {
      const { data } = await axios.get(`${url}/products/${scanned}`);
      console.log(data, "ini data fetchProduct");
      setProduct(data);
      // console.log(product);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: error?.response.data.error,
        icon: "error",
      });
    }
  }

  async function fetchRack() {
    try {
      const { data } = await axios.get(
        `${url}/racks/${scannedRack}/${product[0]?.item_name}`
      );

      setRack(data);
      // console.log(rack);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: error?.response,
        icon: "error",
      });
    }
  }

  const handleUpdate = async (e, newQty) => {
    e.preventDefault();
    console.log(rack, "ini rack");
    try {
      if (rack.length > 0) {
        const response = await axios.patch(
          `${url}/racks/${scannedRack}/${product[0]?.item_name}`,
          { newQty }
        );

        Swal.fire({
          title: "Success Updated Product",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/");
      } else if (rack.length === 0) {
        const body = {
          newQty,
          DNc_No: product[0]?.No_analisa,
          Item_ID: product[0]?.ttba_itemid,
          Process_Date: product[0]?.ttba_date,
        };

        const response = await axios.post(
          `${url}/racks/${scannedRack}/${product[0]?.item_name}`,
          body
        );

        Swal.fire({
          title: "Success Added Product to Rack",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Not Found',
        icon: "error",
      });
    }
  };

  // const handleUpdate = async (e, newQty) => {
  //   e.preventDefault();
  //   try {
  //     const body = {
  //       newQty,
  //       DNc_No: product[0]?.No_analisa,
  //       Item_ID: product[0]?.ttba_itemid,
  //       Process_Date: product[0]?.ttba_date,
  //     };

  //     const response = await axios.post(
  //       `${url}/racks/${scannedRack}/${product[0]?.item_name}`,
  //       body
  //     );

  //     Swal.fire({
  //       title: "Success added",
  //       icon: "success",
  //     });
  //     navigate("/");

  //   } catch (error) {
  //     console.log(error);
  //     Swal.fire({
  //       title: error.response,
  //       icon: "error",
  //     });
  //   }
  // };

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
      // fetch();
    }
  }, [scanned]);

  useEffect(() => {
    setNewQty(product[0]?.ttba_qty);
    // console.log(product, '1234');
  }, [product]);

  useEffect(() => {
    if (scannedRack !== undefined) {
      fetchRack();
      setOpenQrRack(false);
    }
  }, [scannedRack]);

  // console.log(product, 'ini product');
  // console.log(newQty, "ini newQty");
  // console.log(productName);
  // console.log(product[0]?.item_name);
  console.log(rack);

  return (
    <>
      <div className="mt-8 h-screen ">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2">
            <h3>Pemetaan Barang</h3>
            <button
              className="btn btn-sm btn-success"
              onClick={() => setOpenQr(!openQr)}
            >
              {openQr ? "Close" : "Open"} Scan QR
            </button>
          </div>
          {openQr && <QrScanner setScanned={setScanned} />}
          {openQrRack && <QrScannerRack setScannedRack={setScannedRack} />}
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
                      <td>{item?.ttba_date}</td>
                    </tr>
                    <tr>
                      <th>tgl. Daluarsa</th>
                      <td>{item?.Tgl_daluarsa}</td>
                    </tr>
                    <tr>
                      <th>Qty</th>
                      <td>{item?.ttba_qty}</td>
                    </tr>
                    {/* <tr>
                <th>No. Wadah</th>
                <td>-</td>
              </tr>
              <tr>
                <th>No. Analisa</th>
                <td>-</td>
              </tr>
              <tr>
                <th>Operator</th>
                <td>-</td>
              </tr> */}
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
        <div className="flex justify-end m-5">

        {scanned && (
            <button
              className="btn btn-sm btn-warning "
              onClick={() => setOpenQrRack(!openQrRack)}
            >
              {openQrRack ? "Close" : "Open"} Scan QR Rack
            </button>
          )}
        </div>

        {/* {rack.length > 0 ? ( */}
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
              <form action="" onSubmit={(e) => handleUpdate(e, newQty)}>
                <label className=" flex justify-center block text-gray-700 text-sm font-bold mb-2">
                  Update Jumlah
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-4"
                  id="newQty"
                  name="newQty"
                  type="number"
                  // value={product[0]?.ttba_qty}
                  value={newQty || ""}
                  onChange={(e) => setNewQty(e.target.value)}
                />
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
                  type="submit"
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
              <form action="" onSubmit={(e) => handleUpdate(e, newQty)}>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">
                  Tambahkan Product
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="newQty"
                  name="newQty"
                  type="number"
                  // value={product[0]?.ttba_qty}
                  value={newQty || ""}
                  onChange={(e) => setNewQty(e.target.value)}
                />
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </>
          
          )}

        {/* ) : (
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
            <div>
              <form action="" onSubmit={(e) => handleUpdate(e, newQty)}>
                <label className="block text-gray-700 text-sm font-bold mb-2 ">
                  Update Jumlah
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="newQty"
                  name="newQty"
                  type="number"
                  // value={product[0]?.ttba_qty}
                  value={newQty || ""}
                  onChange={(e) => setNewQty(e.target.value)}
                />
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </>
        )} */}
        
      </div>

      {/* <div>
        <button onClick={() => setOpenQr(!openQr)}>
          {openQr ? "Close" : "Open"} QR Scanner
        </button>
      </div> */}
    </>
    
  );
}
