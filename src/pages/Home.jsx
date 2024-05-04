import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Home() {
  return (
    <div className="mt-8 h-screen ">
      <div className="px-5 py-3">
        <div className="flex justify-between mt-2">
          <Link to={"/scanner"}>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Open Scanner</span>
          </button>
          </Link>

        </div>
      </div>
    </div>
  );
}
