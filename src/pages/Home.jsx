import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Home() {
  return (
    <div className="mt-8 h-screen ">
      <div className="px-5 py-3">
        <div className="flex flex-col items-center justify-center p-4">
          <header className="bg-gray-100 shadow-md rounded-lg p-6 w-full max-w-lg text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Aplikasi Pemetaan Gudang
            </h1>
          </header>
          <main className="bg-gray-100 shadow-md rounded-lg p-6 w-full max-w-lg">
            <p className="text-gray-700 mb-4">
              Silahkan klik tombol 
              <span className="inline-flex items-center mx-2">
              <svg
              className="w-6 h-6 border border-gray-800 rounded p-1"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              />
            </svg>
              </span>
              di pojok kiri atas untuk mengakses menu
            </p>
            <div className="flex flex-col space-y-4">
              <Link to={"/scanner"}>
                <button className="btn btn-neutral w-full">
                  <svg
                    className="w-6 h-6 text-white dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  QR Product
                </button>
              </Link>

              <p className="text-gray-700">
                Gunakan menu Scan Product untuk scan QR pada product dan
                menambahkannya ke Rak
              </p>
              <Link to={"/scannerRack"}>
                <button className="btn btn-accent w-full">
                  <svg
                    className="w-6 h-6 text-white dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  QR Rack
                </button>
              </Link>

              <p className="text-gray-700">
                Gunakan menu Scan Rack untuk scan QR pada rak dan memindahkan
                produk ke rak lainnya
              </p>
            </div>
          </main>
        </div>
       
      </div>
    </div>
  );
}
