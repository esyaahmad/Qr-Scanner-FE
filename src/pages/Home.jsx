import axios from "axios";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const { user } = useContext(UserContext);

  const buttonData = [
    {
      to: "/insert-product",
      bgColor: "bg-[#1A4D2E]",
      text: "Insert Product",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
          <g data-name="35-Arrow Down">
            <path
              fill="currentColor"
              d="M25 14h-5v2h5a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-4a5 5 0 0 1 5-5h5v-2H7a7 7 0 0 0-7 7v4a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7v-4a7 7 0 0 0-7-7z"
            />
            <path
              fill="currentColor"
              d="m8.29 18.71 7 7a1 1 0 0 0 1.41 0l7-7-1.41-1.41L17 22.59V1h-2v21.59l-5.29-5.3z"
            />
          </g>
        </svg>
      ),
      description: "Gunakan menu Insert Product untuk scan QR pada product dan menambahkannya ke Rak (satu per satu)"
    },
    {
      to: "/insert-timbang",
      bgColor: "bg-[#1A4D2E]",
      text: "Insert Timbang",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
          <g data-name="35-Arrow Down">
            <path
              fill="currentColor"
              d="M25 14h-5v2h5a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-4a5 5 0 0 1 5-5h5v-2H7a7 7 0 0 0-7 7v4a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7v-4a7 7 0 0 0-7-7z"
            />
            <path
              fill="currentColor"
              d="m8.29 18.71 7 7a1 1 0 0 0 1.41 0l7-7-1.41-1.41L17 22.59V1h-2v21.59l-5.29-5.3z"
            />
          </g>
        </svg>
      ),
      description: "Gunakan menu Insert Timbang untuk scan QR pada product dari hasil timbang dan menambahkannya ke Rak (satu per satu)"
    },
    {
      to: "/insert-bulk-product",
      bgColor: "bg-[#006769]",
      text: "Insert Bulk Products",
      icon: (
        <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"
          />
          <path
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"
          />
        </svg>
      ),
      description: "Gunakan menu Insert Bulk Products untuk scan QR pada product dan menambahkannya (dalam jumlah banyak sekaligus) ke Rak satu rak tertentu"
    },
    {
      to: "/move-product",
      bgColor: "bg-[#1A4D2E]",
      text: "Move Product",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
          <g data-name="96-Arrow Exchange">
            <path
              fill="currentColor"
              d="M10 28V3.41l5.29 5.29 1.41-1.41-7-7a1 1 0 0 0-1.41 0l-7 7 1.42 1.42L8 3.41V28c0 1.38 1 4 5 4h3v-2h-3c-2.8 0-3-1.68-3-2z"
            />
            <path
              fill="currentColor"
              d="M29.29 23.29 24 28.59V4c0-1.38-1-4-5-4h-3v2h3c2.8 0 3 1.68 3 2v24.59l-5.29-5.29-1.41 1.41 7 7a1 1 0 0 0 1.41 0l7-7z"
            />
          </g>
        </svg>
      ),
      description: "Gunakan menu Move Product untuk scan QR rak dan memindahkan produk ke rak lainnya"
    },
    {
      to: "/withdraw-product",
      bgColor: "bg-[#1A4D2E]",
      text: "Withdraw Timbang",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={24} height={24}>
          <g data-name="36-Arrow Up">
            <path
              fill="currentColor"
              d="M25 14h-5v2h5a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-4a5 5 0 0 1 5-5h5v-2H7a7 7 0 0 0-7 7v4a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7v-4a7 7 0 0 0-7-7z"
            />
            <path
              fill="currentColor"
              d="M15 4.41V26h2V4.41l5.29 5.29 1.41-1.41-7-7a1 1 0 0 0-1.41 0l-7 7 1.42 1.42z"
            />
          </g>
        </svg>
      ),
      description: "Gunakan untuk tarik produk ke proses penimbangan"
    },
    {
      to: "/withdraw-sampling",
      bgColor: "bg-[#1A4D2E]",
      text: "Withdraw Sampling",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={20} height={20}>
          <g data-name="36-Arrow Up">
            <path
              fill="currentColor"
              d="M25 14h-5v2h5a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-4a5 5 0 0 1 5-5h5v-2H7a7 7 0 0 0-7 7v4a7 7 0 0 0 7 7h18a7 7 0 0 0 7-7v-4a7 7 0 0 0-7-7z"
            />
            <path
              fill="currentColor"
              d="M15 4.41V26h2V4.41l5.29 5.29 1.41-1.41-7-7a1 1 0 0 0-1.41 0l-7 7 1.42 1.42z"
            />
          </g>
        </svg>
      ),
      description: "Gunakan untuk tarik produk menuju proses sampling"
    },
    {
      to: "/stock-gudang",
      bgColor: "bg-[#1A4D2E]",
      text: "Stock Opname",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={30} height={30}>
          <g data-name="box 2">
            <path
              fill="currentColor"
              d="M28.48 18H18V5h1v4.47A1.54 1.54 0 0 0 20.53 11h2.94A1.54 1.54 0 0 0 25 9.47V5h1v10a1 1 0 0 0 2 0V4.52A1.52 1.52 0 0 0 26.48 3h-9A1.52 1.52 0 0 0 16 4.52V13H3.52A1.52 1.52 0 0 0 2 14.52V28a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1v-8.48A1.52 1.52 0 0 0 28.48 18zM23 5v4h-2V5zm1 15v2h-2v-2zm-13-5v3H9v-3zm17 12H4V15h3v3.47A1.54 1.54 0 0 0 8.53 20h2.94A1.54 1.54 0 0 0 13 18.47V15h3v10a1 1 0 0 0 2 0v-5h2v2.47A1.54 1.54 0 0 0 21.53 24h2.94A1.54 1.54 0 0 0 26 22.47V20h2z"
            />
            <path fill="currentColor" d="M23 15a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zM7 24H6a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2z" />
          </g>
        </svg>
      ),
      description: "Gunakan Stock Opname"
    }
  ];

  return (
    <div className="mt-8 h-screen">
      <div className="px-5 py-3">
        <div className="flex flex-col items-center justify-center p-4">
          <header className="bg-[#E8DFCA] shadow-md rounded-lg p-6 w-full max-w-3xl text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Aplikasi Pemetaan Gudang</h1>
          </header>

          <main className="bg-[#E8DFCA] shadow-md rounded-lg p-6 w-full max-w-3xl">
            <p className="text-gray-700 mb-4">
              Silahkan klik Transaction pada Navbar untuk mengakses menu
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buttonData.map((button, index) => (
                <div key={index} className="container p-4 border-2 rounded-xl border-[#1A4D2E]">
                  <Link to={button.to}>
                    <button className={`btn btn-neutral ${button.bgColor} w-full flex items-center justify-center space-x-2`}>
                      {button.icon}
                      <span>{button.text}</span>
                    </button>
                  </Link>
                  <p className="text-gray-700 mt-2">{button.description}</p>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
