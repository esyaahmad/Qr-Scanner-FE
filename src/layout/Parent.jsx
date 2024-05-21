import { Outlet } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";

export default function Parent() {
  return (
    <>
    <div className="flex ">
    <div>

      {/* <Sidenav/> */}
      <Navbar/>
    </div>
    <div className=" w-full mt-10">

      <Outlet />
    </div>
    </div>
    </>
  );
}
