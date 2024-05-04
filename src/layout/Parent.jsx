import { Outlet } from "react-router-dom";
import Sidenav from "../components/Sidenav";

export default function Parent() {
  return (
    <>
    <div className="flex flex-row">
    <div>

      <Sidenav/>
    </div>
    <div className=" w-full">

      <Outlet />
    </div>
    </div>
    </>
  );
}
