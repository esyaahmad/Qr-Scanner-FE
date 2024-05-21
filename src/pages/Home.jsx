import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Home() {
  return (
    <div className="mt-8 h-screen ">
      <div className="px-5 py-3">
        <div className="flex flex-col items-center justify-center p-4">
          <header className="bg-[#E8DFCA] shadow-md rounded-lg p-6 w-full max-w-lg text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Aplikasi Pemetaan Gudang
            </h1>
          </header>
          <main className="bg-[#E8DFCA] shadow-md rounded-lg p-6 w-full max-w-lg">
            <p className="text-gray-700 mb-4">
              Silahkan klik Transaction pada Navbar untuk mengakses menu
            </p>
            <div className="flex flex-col space-y-4">
              <Link to={"/scanner"}>
                <button className="btn btn-neutral bg-[#1A4D2E] w-full">
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
                <button className="btn btn-neutral bg-[#006769] w-full">
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
