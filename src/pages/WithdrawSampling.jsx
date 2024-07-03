import QrScanner from "../components/QrScanner";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";

//handleupdate udah bener, tinggal create
//kurangin stok gudang utama diambil untuk sampling (transaction ok)
export default function WithdrawSampling() {
  const { setLoading } = useContext(UserContext);

  const [openQr, setOpenQr] = useState(true);

  const [scanned, setScanned] = useState(undefined);

  const [product, setProduct] = useState([]);
  const [newQty, setNewQty] = useState(0);
  // const [rack, setRack] = useState([]);

  // const url = "https://npqfnjnh-3000.asse.devtunnels.ms";
  const url = "http://localhost:3000";

  const navigate = useNavigate();

  const arrScanned = scanned?.split("#");
  const ttba = arrScanned?.[0]?.replace(/\//g, "-");
  const seqId = arrScanned?.[1];
  const vat = arrScanned?.[2];

  const formatScanned = scanned?.replace(/#/g, "$").replace(/\//g, "-");
  const loc = product[0]?.Lokasi;
  const rak = product[0]?.Rak;
  const row = product[0]?.Baris;
  const col = product[0]?.Kolom;

  async function fetchProductInRack() {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${url}/rackProdByTtba/${formatScanned}`, {headers: {authentication: sessionStorage.getItem("access_token")}}
      );
      if (data.length === 0) {
        toast.error("Rack Not Found");
      } else {
        setProduct(data);
        // toast.success("Product data fetched successfully");
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
      // setRack([]);
      setProduct([]);
      setScanned(undefined);
    } finally {
      setLoading(false);
    }
  }

  const handleButtonClick = async (e) => {
    e.preventDefault();
    const availableQty = product[0]?.Qty;
    const { value: qty } = await Swal.fire({
      title: "Input Quantity Produk yang Akan di Ambil untuk Sampling",
      input: "number",
      inputAttributes: {
        min: 1,
        step: 1,
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return "You need to enter a valid quantity!";
        }
        if (value > availableQty) {
          return `Quantity cannot be greater than ${availableQty}`;
        }
      },
    });

    if (qty) {
      setNewQty(qty);

      setLoading(true);
      try {
        const body = {
          product: product[0],
          newQty: qty,
        };

        await axios.patch(
          `${url}/decRackQty/${loc}/${rak}/${row}/${col}/${formatScanned}`,
          body, {headers: {authentication: sessionStorage.getItem("access_token")}}
        );

        Swal.fire({
          title: `Success`,
          text: `Quantity Produk Berkurang: ${qty}`,
          icon: "success",
        });
        fetchProductInRack();
      } catch (error) {
        console.error("Error updating product quantity:", error);

        Swal.fire({
          title: error?.response?.data?.message,
          icon: "error",
        });
        setProduct([]);
        setScanned(undefined);
      } finally {
        setLoading(false);
      }
    }
  };

  // const handlePatchQtyGudang = async (e) => {
  //   // const formatNoAnalisa = product[0]?.No_analisa.replace(/\//g, "%2F");
  //   setLoading(true);
  //   e.preventDefault();
  //   try {
  //     const body = {
  //       product: product[0],
  //       newQty,
  //     };

  //     await axios.patch(
  //       `${url}/decRackQty/${loc}/${rak}/${row}/${col}/${formatScanned}`,
  //       body
  //     );

  //     //   Swal.fire({
  //     //     title: `Success Added`,
  //     //     icon: "success",
  //     //   });
  //   } catch (error) {
  //     console.error("Error adding product to rack:", error);

  //     Swal.fire({
  //       title: error?.response?.data?.message,
  //       icon: "error",
  //     });
  //     // setRack([]);
  //     setProduct([]);
  //     setScanned(undefined);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // console.log(scanned, "ini scanned");
    if (scanned !== undefined) {
      fetchProductInRack();
      // fetchRack();
      setOpenQr(false);
    }
  }, [scanned]);

  console.log(product, "ini product");
  // console.log(rack, "ini rack");

  return (
    <>
      <div className="mt-8">
        <div className="px-5 py-3">
          <div className="flex justify-between mt-2 mb-4">
            <p className="text-2xl font-bold text-gray-800">
              Tarik Produk (Sampling)
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
                      {product[0]?.Item_Name} {product[0]?.Item_ID}
                    </td>
                  </tr>
                  <tr>
                    <th>Lokasi</th>
                    <td>{`${product[0]?.Lokasi}/${product[0]?.Rak}/${product[0]?.Baris}/${product[0]?.Kolom}`}</td>
                  </tr>
                  <tr>
                    <th>No. Analisa</th>
                    <td>{product[0]?.DNc_No}</td>
                  </tr>
                  <tr>
                    <th>Tgl. Penyimpanan</th>
                    <td>
                      {(product[0]?.Process_Date).replace("T", " ").replace(
                        "Z",
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Quantity Vat</th>
                    <td>{product[0]?.Qty}</td>
                  </tr>
                  <tr>
                    <th>No. Wadah</th>
                    <td>{vat}</td>
                  </tr>
                </tbody>
              </table>
              <br />
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
                  Proses Sampling
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
