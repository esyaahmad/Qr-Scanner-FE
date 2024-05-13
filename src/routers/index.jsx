import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "../pages/Login";
import Parent from "../layout/Parent";
import Home from "../pages/Home";
import Scanner from "../pages/Scanner";
import ScannerRack from "../pages/ScannerRack";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <Parent />,
    // loader: () => {
    //   if (!localStorage.access_token) {
    //     Swal.fire({
    //       icon: "error",
    //       title: `Login First`,
    //     });
    //     return redirect("/login");
    //   }
    //   return null;
    // },
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "scanner",
        element: <Scanner />,
      },
      {
        path: "scannerRack",
        element: <ScannerRack />,
      },
    ],
  },
]);
export default router;
