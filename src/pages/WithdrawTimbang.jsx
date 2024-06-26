import QrScanner from "../components/QrScanner";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";

//handleupdate udah bener, tinggal create
export default function ScannerWithdraw() {
  const { setLoading } = useContext(UserContext);

  const [openQr, setOpenQr] = useState(true);
  const [openQrRack, setOpenQrRack] = useState(false);
  // const [loading, setLoading] = useState(false); 

  const [scanned, setScanned] = useState(undefined);

  const [product, setProduct] = useState([]);
  const [rack, setRack] = useState([]);

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
        `${url}/productsPerVat/${ttba}/${seqId}/${vat}`, {headers: {authentication: sessionStorage.getItem("access_token")}}
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
      //   Swal.fire({
      //     title: error?.response?.data?.message,
      //     icon: "error",
      //   });
      toast.error(error?.response.data.message);
      setScanned(undefined);
      setProduct([]);
      setRack([]);
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  }

  async function fetchRack() {
    const formatScanned = scanned?.replace(/#/g, "%23").replace(/\//g, "%2F");
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${url}/rackProdByTtba/${formatScanned}`
      );
      if (data.length === 0) {
        toast.error("Rack Not Found");
      } else {
        setRack(data);
      }
      // console.log(rack);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
      });
      //   toast.error(error?.response?.data?.error || "Rak Kosong");
      // setScannedRack(undefined);
      setRack([]);
      setProduct([]);
      setScanned(undefined);
    } finally {
      setLoading(false);
    }
  }

  const handleButtonClick = (e) => {
    try {
      if (rack[0]?.Status === "Karantina") {
        throw new Error("Produk Status Karantina");
      }
    Swal.fire({
      title: "Tarik Produk?",
      html: `
          <div style="font-size: 1.1em; margin-top: 10px;">
            <strong>TTBA:</strong> ${scanned}<br>
            <strong>Quantity:</strong> ${product[0]?.TTBA_qty_per_Vat}<br>
            <strong>Rack:</strong> ${rack[0]?.Lokasi}/${rack[0]?.Rak}/${rack[0]?.Baris}/${rack[0]?.Kolom}<br>
          </div>
        `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Your code to execute when the user confirms
        handleCreateStockPosition(e);
        handleDeleteProduct(e);
        navigate("/");

        Swal.fire("Success!", "Product has been withdrawn.", "success");
      }
    });
       
  } catch (error) {
    console.log(error);
    Swal.fire({
      title: error.message,
      icon: "error",
    });

  }
  };

  const handleCreateStockPosition = async (e) => {
    const formatNoAnalisa = product[0]?.No_analisa.replace(/\//g, "%2F");
    setLoading(true);
    e.preventDefault();
    try {
      const body = {
        product: product[0],
        rack: rack[0],
        scanned,
      };

      await axios.post(
        `${url}/stockPosition/${formatNoAnalisa}/${product[0]?.ttba_vatno}`,
        body, {headers: {authentication: sessionStorage.getItem("access_token")}}
      );

      //   Swal.fire({
      //     title: `Success Added`,
      //     icon: "success",
      //   });
    } catch (error) {
      console.error("Error adding product to rack:", error);

      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
      });
      setRack([]);
      setProduct([]);
      setScanned(undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (e) => {
    const formatScanned = scanned?.replace(/#/g, "%23").replace(/\//g, "%2F");

    setLoading(true);
    e.preventDefault();
    try {
      const body = {
        product: product[0],
        rack: rack[0],
        scanned,
      };

      await axios.post(`${url}/rakDelByTtba/${formatScanned}`, body, {headers: {authentication: sessionStorage.getItem("access_token")}});

      //   Swal.fire({
      //     title: `Success Added`,
      //     icon: "success",
      //   });
      //   navigate("/");
    } catch (error) {
      console.error("Error adding product to rack:", error);

      Swal.fire({
        title: error?.response?.data?.message,
        icon: "error",
      });
      setRack([]);
      setProduct([]);
      setScanned(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log(scanned, "ini scanned");
    if (scanned !== undefined) {
      fetchProduct();
      fetchRack();
      setOpenQr(false);
    }
  }, [scanned]);

  console.log(product, "ini product");
  console.log(rack, "ini rack");

  return (
    <>
      <div className="mt-8 h-screen ">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-800">
              Tarik Produk (Penimbangan)
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
                    <td>{product[0]?.group_name || "-"}</td>
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
                    <th>Tgl. Daluarsa</th>
                    <td>{product[0]?.Tgl_daluarsa}</td>
                  </tr>
                  <tr>
                    <th>Quantity Vat</th>
                    <td>
                      {product[0]?.TTBA_qty_per_Vat} {product[0]?.ttba_itemUnit}
                    </td>
                  </tr>
                  <tr>
                    <th>Quantity TTBA</th>
                    <td>
                      {product[0]?.ttba_qty} {product[0]?.ttba_itemUnit}
                    </td>
                  </tr>
                  <tr>
                    <th>No. Wadah</th>
                    <td>
                      {product[0]?.ttba_vatno} dari {product[0]?.TTBA_VATQTY}
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    {rack[0]?.Status === "Karantina" ? (
                      <td className="font-bold text-red-500">
                        {rack[0]?.Status}
                      </td>
                    ) : (
                      <td className="font-bold">{rack[0]?.Status}</td>
                    )}
                  </tr>
                </tbody>
              </table>
              <br />
              {/* <table className="table table-zebra table-sm">
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

              </table> */}
            </>
          ) : (
            <>
              <div
                className="fixed bottom-0 w-full bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 m-5"
                role="alert"
              >
                <p className="font-bold"> Scan Produk</p>
                <p>
                  Silahkan Scan QR Produk untuk Tarik Produk dari Rak Menuju
                  Proses Timbang
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-center m-5">
          {scanned && (
            <button
              className="btn btn-sm btn-warning "
              onClick={(e) => handleButtonClick(e)}
            >
              Tarik Produk
            </button>
          )}
        </div>
      </div>
    </>
  );
}
