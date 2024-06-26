import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import ModalValidateTimbang from "../components/ModalValidateTimbang";

export default function TimbangPage() {
  const { setLoading } = useContext(UserContext);
  const [selectedScale, setSelectedScale] = useState(null);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  4;

  const url = "http://localhost:3000";

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
      setData([]);
      // setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleScaleClick = (scaleId) => {
    setSelectedScale(scaleId);
    fetchData(scaleId);
  };
  console.log(data);
  return (
    <>
      {isModalOpen && (
        <ModalValidateTimbang handleCloseModal={() => setIsModalOpen(false)} />
      )}

      <div className="flex justify-around">
        <div role="tablist" className="tabs tabs-lifted tabs-lg mt-10 w-full m-4 ">
          {scales.map((scale) => (
            <>
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab text-primary font-medium [--tab-border-color:black]"
                aria-label={scale.name}
                onClick={() => handleScaleClick(scale.id)}
              />

              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-black rounded-box"
              >
                <table className="table-auto table-xs w-full border-collapse border border-gray-200 mt-4">
                  <thead >
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">
                        No. Urut
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
                        Qty TImbang
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Item Unit
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
                      data.map((item) => (
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
                            {item.No_VAT === null ? (
                              <button
                                className="btn btn-warning"
                                onClick={() => setIsModalOpen(true)}
                              >
                                Validate
                              </button>
                            ) : (
                              <p className="text-green-600 font-bold">
                                Validated
                              </p>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="border border-gray-300 px-4 py-2 text-center"
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
