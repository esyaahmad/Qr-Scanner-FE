import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { MdLayers } from "react-icons/md";
// import { UserContext } from "../context/UserContext";
import LiveDateTime from "./Widgets/LiveDateTime";

export default function Navbar() {
  // prod
//   const { user, modules, authorizedModules } = useContext(UserContext);

  // TO BE DELETED: dev
  const user = {
    user: {
      log_NIK: "JOE",
      log_UserName: "John Doe",
      Nama: "John Doe",
      Jabatan: "Formulation Development Existing Product Administrator DPI/PPI",
      Inisial_Name: "JOE",
      emp_DeptID: "RD2",
      emp_JobLevelID: "STF",
      Delegated_As: "JAE",
    },
    delegatedAs: {
      log_NIK: "JAE",
      log_UserName: "Jane Doe",
      Nama: "Jane Doe",
      Jabatan: "Formulation Development Existing Product Officer",
      Inisial_Name: "JAE",
      emp_DeptID: "RD2",
      emp_JobLevelID: "OFC",
    },
  };

  const modules = [
    { submenu_description: "homepage", submenu_type: "Master" },
    { submenu_description: "Scan Product", submenu_type: "Transaction" },
    { submenu_description: "Scan Rack", submenu_type: "Transaction" },

  ];

  const authorizedModules = [
    {
      isReadOnly: false,
      submenu_description: "homepage",
      submenu_type: "Master",
      submenu_page: "homepage",
    },
    {
        isReadOnly: false,
        submenu_description: "Scan Product",
        submenu_type: "Transaction",
        submenu_page: "scanner",
      },
      {
        isReadOnly: false,
        submenu_description: "Scan Rack",
        submenu_type: "Transaction",
        submenu_page: "scannerRack",
      },
  ];

  const navigate = useNavigate();

  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openSubMenuProfile, setOpenSubMenuProfile] = useState(null);

  const subMenuRef = useRef(null);
  const subMenuProfileRef = useRef(null);

  useEffect(() => {
    if (openSubMenu) {
      setOpenSubMenuProfile(false);
    }
  }, [openSubMenu]);

  useEffect(() => {
    if (openSubMenuProfile) {
      setOpenSubMenu(null);
    }
  }, [openSubMenuProfile]);

  const handleClickOutside = (event) => {
    if (subMenuRef.current && !subMenuRef.current.contains(event.target)) {
      setOpenSubMenu(null);
    }
    if (
      subMenuProfileRef.current &&
      !subMenuProfileRef.current.contains(event.target)
    ) {
      setOpenSubMenuProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSubMenu = (menuId) => {
    setOpenSubMenu(openSubMenu === menuId ? null : menuId);
  };

  // if user authorized, add link and isReadOnly status to module
  const getModulesFile = (_modules, _menuType) => {
    return _modules
      ?.filter((item) => item?.submenu_type === _menuType)
      ?.map((item) => {
        const found = authorizedModules?.find(
          (am) =>
            am?.submenu_type === item?.submenu_type &&
            am?.submenu_description === item?.submenu_description
        );

        if (found) {
          const modifiedItem = {
            ...item,
            isReadOnly: found?.isReadOnly,
            submenu_page: found?.submenu_page,
          };

          return modifiedItem;
        } else {
          return item;
        }
      });
  };

  const handleNavigate = (_route) => {
    setOpenSubMenu(null);
    setOpenSubMenuProfile(false);
    navigate(_route);
  };

  return (
    <nav className="z-[99] fixed w-full h-16 border-b border-primary bg-[#1A4D2E] text-white flex items-center">
      <div className="mx-4 md:mx-8 w-full flex justify-between items-center">
        {/* logo + nav */}
        <div className="flex items-center gap-4">
          {/* app logo / brand */}
          <Link to="/" className="flex items-center gap-2">
            <MdLayers size={28} className="text-yellow-400" />
            <div className="text-xl font-bold">E-Pemetaan Gudang</div>
          </Link>

          {/* menu */}
          <div className="p-2">
            <ul className="flex flex-col md:flex-row gap-2">
              {["Master", "Transaction", "Report", "Helper"]?.map(
                (menu, menuIndex) => (
                  <li key={menuIndex} className="relative">
                    <button
                      onClick={() => toggleSubMenu(menu)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded transition duration-300 hover:bg-forest-green-100 hover:text-tertiary ${
                        openSubMenu === menu
                          ? "bg-forest-green-100 text-tertiary opacity-70"
                          : "bg-transparent text-white"
                      }`}
                    >
                      <span>{menu}</span>
                    </button>

                    {/* sub-menu */}
                    {openSubMenu === menu && (
                      <div
                        className={`absolute z-[99] w-full md:w-fit min-w-[250px] top-full left-0 mt-6 bg-white rounded ${
                          getModulesFile(modules, menu)?.length > 0
                            ? "border shadow py-2"
                            : ""
                        }`}
                      >
                        <ul ref={subMenuRef}>
                          {getModulesFile(modules, menu)?.map(
                            (subMenu, subMenuIndex) => (
                              <li key={subMenuIndex}>
                                {subMenu?.submenu_page ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleNavigate(
                                        `/${subMenu?.submenu_page || "#"}`
                                      )
                                    }
                                    className="w-full text-left block py-2 pl-4 pr-6 whitespace-nowrap text-gray-900 rounded transition duration-200 hover:bg-gray-100 hover:text-primary"
                                  >
                                    {subMenu?.submenu_description || ""}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled
                                    className="block py-2 pl-4 pr-6 whitespace-nowrap text-gray-300 rounded"
                                  >
                                    {subMenu?.submenu_description || ""}
                                  </button>
                                )}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* profile */}
        <div className="h-16 flex items-center" ref={subMenuProfileRef}>
          {/* profile button */}
          <button
            type="button"
            className="flex items-center gap-1.5 transition duration-300 hover:opacity-70"
            onClick={() => setOpenSubMenuProfile(!openSubMenuProfile)}
          >
            <div
              className={`flex items-center ${
                user?.delegatedAs?.Nama ? "gap-[14px]" : "gap-[10px]"
              }`}
            >
              <div className="rounded-full p-1 bg-white">
                <LuUser
                  className={`text-secondary ${
                    user?.delegatedAs?.Nama ? "text-xl" : ""
                  }`}
                />
              </div>

              <div
                className={`flex flex-col text-left ${
                  user?.delegatedAs?.Nama ? "text-sm" : ""
                }`}
              >
                <span
                  className={`${user?.delegatedAs?.Nama ? "font-bold" : ""}`}
                >
                  {user?.user?.Nama || "-"}
                </span>
                {user?.delegatedAs?.Nama && (
                  <span>(Delegated As: {user?.delegatedAs?.Nama})</span>
                )}
              </div>
            </div>
          </button>

          {/* sub-menu profile */}
          <div
            className={`transition-all duration-700 absolute z-[99] w-[340px] right-0 top-full border border-gray-300 bg-white text-gray-800 rounded shadow-2xl 
            ${
              openSubMenuProfile
                ? " transform translate-x-0"
                : " transform translate-x-full"
            } `}
            style={{ height: "calc(100vh - 4rem" }}
          >
            {/* close button */}
            <div
              className="cursor-pointer absolute z-[100] left-2.5 top-2.5 transition duration-300 hover:opacity-70"
              onClick={() => setOpenSubMenuProfile(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l8 8m0-8l-8 8" />
              </svg>
            </div>

            <div className="h-full overflow-y-auto">
              {/* user info */}
              <div className="mt-12 pb-14 px-5">
                {/* avatar */}
                <div className="w-fit mx-auto rounded-full p-1 bg-white border">
                  <LuUser className="text-secondary text-[50px]" />
                </div>

                {/* profile name */}
                <div className="text-center mt-4">
                  <p className="font-semibold">
                    {user?.user?.log_UserName || "-"}
                  </p>
                  <p className="text-gray-600">{user?.user?.log_NIK || "-"}</p>
                </div>

                {/* identity */}
                <div className="mt-4 text-sm">
                  {/* user identity */}
                  <div className="border-t border-gray-300 pt-4">
                    <div className="py-2 space-y-2">
                      {/* jabatan */}
                      <div className="flex gap-1">
                        <span className="font-semibold">Jabatan:</span>
                        <span>{user?.user?.Jabatan || "-"}</span>
                      </div>

                      {/* departemen */}
                      <div className="flex gap-1">
                        <span className="font-semibold">Departemen:</span>
                        <span>{user?.user?.emp_DeptID || "-"}</span>
                      </div>

                      {/* job level */}
                      <div className="flex gap-1">
                        <span className="font-semibold">Job Level:</span>
                        <span>{user?.user?.emp_JobLevelID || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* delegated as identity */}
                  {user?.delegatedAs && (
                    <div className="pt-4 mt-2">
                      <div className=" mb-2 flex gap-4 items-center">
                        <div className="w-full">
                          <hr />
                        </div>

                        <div>
                          <h2 className="text-[16px] whitespace-nowrap font-bold text-primary">
                            Delegated As
                          </h2>
                        </div>

                        <div className="w-full">
                          <hr />
                        </div>
                      </div>

                      <div className="py-2 space-y-2">
                        {/* nama */}
                        <div className="flex gap-1">
                          <span className="font-semibold">Nama:</span>
                          <span>{user?.delegatedAs?.log_UserName || "-"}</span>
                        </div>

                        {/* username */}
                        <div className="flex gap-1">
                          <span className="font-semibold">Username:</span>
                          <span>{user?.delegatedAs?.log_NIK || "-"}</span>
                        </div>

                        {/* jabatan */}
                        <div className="flex gap-1">
                          <span className="font-semibold">Jabatan:</span>
                          <span>{user?.delegatedAs?.Jabatan || "-"}</span>
                        </div>

                        {/* departemen */}
                        <div className="flex gap-1">
                          <span className="font-semibold">Departemen:</span>
                          <span>{user?.delegatedAs?.emp_DeptID || "-"}</span>
                        </div>

                        {/* job level */}
                        <div className="flex gap-1">
                          <span className="font-semibold">Job Level:</span>
                          <span>
                            {user?.delegatedAs?.emp_JobLevelID || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* time */}
              <div className="absolute bottom-0 py-2 w-full text-xs text-center text-white font-bold bg-secondary">
                <LiveDateTime />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}