import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "../pages/Login";
import Parent from "../layout/Parent";
import Home from "../pages/Home";
import Scanner from "../pages/Scanner";
import ScannerRack from "../pages/ScannerRack";
import ScannerBulkInsert from "../pages/ScannerBulkInsert";

import NotFoundPage from "../pages/NotFoundPage";
import NotAuthorizedPage from "../pages/NotAuthorizedPage";
import { AUTH_URL, NAMA_PROGRAM } from "../config/config";
import ScannerWithdraw from "../pages/WithdrawProduct";
import InsertTimbang from "../pages/InsertTimbang";
import WithdrawSampling from "../pages/WithdrawSampling";
import StockGudang from "../pages/StockGudang";
import StockGudang2 from "../pages/StockGudang2";

const validateUser = async (access_token) => {
  try {
    const response = await fetch(`${AUTH_URL}/decode`, {
      method: "GET",
      headers: {
        access_token: access_token,
      },
    });

    if (!response.ok) {
      console.log("Error decoding token");
      return false;
    }

    const data = await response.json();

    if (data?.user?.log_NIK) {
      sessionStorage.setItem("access_token", access_token);
      const url = window.location.href?.split("?");

      if (url?.length > 1) {
        window.location.href = url[0];
      }

      return data;
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const validateAuthModules = async (access_token, modulesName) => {
  if (!modulesName || !access_token) return false;

  try {
    const response = await fetch(
      `${AUTH_URL}/module-authorization/${modulesName}`,
      {
        method: "GET",
        headers: {
          access_token: access_token,
        },
      }
    );

    if (!response.ok) {
      console.log("Error decoding token");
      return false;
    }

    const data = await response.json();

    return !!data?.auth;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const router = createBrowserRouter(
  [
    {
      element: <Parent />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          children: [
            {
              path: "/insert-product",
              element: <Scanner />,
            },
            {
              path: "/move-product",
              element: <ScannerRack />,
            },
            {
              path: "/insert-bulk-product",
              element: <ScannerBulkInsert />,
            },
            {
              path: "/withdraw-product",
              element: <ScannerWithdraw />,
            },
            {
              path: "/insert-timbang",
              element: <InsertTimbang />,
            },
            {
              path: "/withdraw-sampling",
              element: <WithdrawSampling />,
            },
            {
              path: "/stock-gudang",
              element: <StockGudang />,
            },
            {
              path: "/stock-gudang2",
              element: <StockGudang2 />,
            },
          ],
          loader: async () => {
            const access_token = sessionStorage?.access_token;

            const valid_access_token = await validateAuthModules(
              access_token,
              "Product Brief"
            );

            if (!valid_access_token) return redirect("/notAuthorized");
            return null;
          },
        },
      ],
      loader: async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const auth = queryParams.get("auth");
        const access_token = sessionStorage?.access_token;
        const param = auth ? auth : access_token;
        const user = await validateUser(param);
        console.log(user, "<<< USER");
        if (!user) return redirect("/notAuthorized");
        return null;
      },
    },
    {
      path: "/notAuthorized",
      element: <NotAuthorizedPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ],
  { basename: `/${NAMA_PROGRAM}` }
);

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     element: <Parent />,
//     // loader: () => {
//     //   if (!localStorage.access_token) {
//     //     Swal.fire({
//     //       icon: "error",
//     //       title: `Login First`,
//     //     });
//     //     return redirect("/login");
//     //   }
//     //   return null;
//     // },
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "scanner",
//         element: <Scanner />,
//       },
//       {
//         path: "scannerRack",
//         element: <ScannerRack />,
//       },
//       {
//         path: "ScannerBulkInsert",
//         element: <ScannerBulkInsert />,
//       },
//     ],
//   },
// ]);

export default router;
