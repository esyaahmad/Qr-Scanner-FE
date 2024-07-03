import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import ModalValidateTimbang from "../components/ModalValidateTimbang";
import Swal from "sweetalert2";

export default function TimbangPage() {
  const { setLoading } = useContext(UserContext);
  const [selectedScale, setSelectedScale] = useState(null);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  // const [isValidated, setIsValidated] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const [DNcTimbang, setDNcTimbang] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [noVatTimbang, setnoVatTimbang] = useState(null);

  4;

  const url = "http://localhost:3000";
  // const url = "http://192.168.1.24/api/ePemetaanGudang-dev";

  // const url = 'https://qc8tdx1x-5174.asse.devtunnels.ms/'

  const scales = [
    { id: 1, name: "Scale 1" },
    { id: 2, name: "Scale 2" },
    { id: 3, name: "Scale 3" },
    { id: 4, name: "Scale 4" },
    { id: 5, name: "Scale 5" },
    { id: 6, name: "Scale 6" },
    { id: 7, name: "Scale 7" },
    { id: 8, name: "Scale 8" },
  ];

  // adasd

  const fetchData = async (scaleId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}/timbangList/${scaleId}`);
      if (response.data.length === 0) {
        setError("No Item untuk ditimbang");
      }
      // console.log(response);
      setData(response.data);
    } catch (error) {
      console.log(error);
      // Swal.fire({
      //   title: error?.message,
      //   icon: "error",
      // });
      setData([]);
      // setError("Failed to fetch data."); 
    } finally {
      setLoading(false);
    }
  };

  const handleDoneTimbang = async (DNcTimbang, itemId, noVatTimbang, qty) => {
    setLoading(true);
    const formatDNcTimbang = DNcTimbang.replace(/\//g, "-");
    const formatItemId = itemId.replace(/ /g, "_");
    qty = 10
    try {
      // const response = await axios.patch(
      //   `${url}/doneTimbang/${formatDNcTimbang}/${formatItemId}/${noVatTimbang}`, {qty},
      //   { headers: { authentication: sessionStorage.getItem("access_token") } }
      // );

      // Swal.fire({
      //   title: "Success",
      //   text: "Data berhasil diupdate",
      //   icon: "success",
      // });

      setForceUpdate(!forceUpdate);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const smallestNoUrutTimbangItem = data.reduce((prev, current) => {
    return prev.No_Urut_Timbang < current.No_Urut_Timbang ? prev : current;
  }, data[0]);

  //sdfewsdfvwefdsfasdfffw

  const handleScaleClick = (scaleId) => {
    setSelectedScale(scaleId);
    fetchData(scaleId);
  };

  useEffect(() => {
    if (selectedScale) {
      fetchData(selectedScale);
    }
  }, [selectedScale, forceUpdate]);

  console.log(data);
  return (
    <>
      {isModalOpen && (
        <ModalValidateTimbang
          handleCloseModal={() => setIsModalOpen(false)}
          DNcTimbang={DNcTimbang}
          itemId={itemId}
          noVatTimbang={noVatTimbang}
          setForceUpdate={setForceUpdate}
        />
      )}

      <div className="flex justify-around">
        <div
          role="tablist"
          className="tabs tabs-lifted tabs-lg mt-10 w-full m-4 "
        >
          {!selectedScale && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl text-white bg-red-500 p-6 rounded shadow-lg">
                Please select a scale
              </div>
            </div>
          )}
          {scales.map((scale) => (
            <>
              <React.Fragment key={scale.id}>
                <input
                  type="radio"
                  name="my_tabs_2"
                  role="tab"
                  className="tab text-primary font-medium [--tab-border-color:black]"
                  aria-label={scale.name}
                  onClick={() => handleScaleClick(scale.id)}
                />
              </React.Fragment>

              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-black rounded-box"
              >
                <table className="table-auto table-xs w-full border-collapse border border-gray-200 mt-4">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        No.
                        <br />
                        Urut
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        MR No.
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        No. Analisa
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Nama Item
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Qty 
                        <br />
                        Timbang
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Item 
                        <br />
                        Unit
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        No. Vat
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data
                        .filter((item) => item.Nett_Qty === null) // Filter items with Nett_Qty as null
                        .map((item) => (
                          <tr key={item.id}>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.No_Urut_Timbang}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.MR_No}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.MR_DNcNo}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.Item_Name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.Qty_timbang}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.Item_Unit}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {item.No_VAT}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 flex justify-center items-center">
                              {item?.MR_DNcNo === item?.DNCno_Scan &&
                              item?.MR_ItemID === item?.ItemID_Scan ? (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => {
                                    // setDNcTimbang(item.MR_DNcNo)
                                    // setItemId(item.MR_ItemID)
                                    // setnoVatTimbang(item.No_VAT)
                                    handleDoneTimbang(
                                      item.MR_DNcNo,
                                      item.MR_ItemID,
                                      item.No_VAT,
                                      item.Qty_timbang
                                    );
                                  }}
                                >
                                  Done
                                </button>
                              ) : (
                                <button
                                  className="btn btn-warning btn-sm"
                                  disabled={
                                    item.No_Urut_Timbang !==
                                    smallestNoUrutTimbangItem.No_Urut_Timbang
                                  } // Disable if not the smallest
                                  onClick={() => {
                                    setIsModalOpen(true);
                                    setDNcTimbang(item.MR_DNcNo);
                                    setItemId(item.MR_ItemID);
                                    setnoVatTimbang(item.No_VAT);
                                  }}
                                >
                                  Scan
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="border border-gray-300 px-4 py-2 text-center text-xl"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
