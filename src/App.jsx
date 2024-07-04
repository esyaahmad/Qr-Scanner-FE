
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AUTH_URL,  } from "./config/config";
import { UserContext } from "./context/UserContext";
import router from "./routers/index";
import PreLoader from "./components/Widgets/PreLoader";

export default function App() {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});
  const [accessRight, setAcessRight] = useState({});
  const [modules, setModules] = useState([]);
  const [authorizedModules, setAuthorizedModules] = useState([]);

  useEffect(() => {
    const getAndSetUser = async (access_token) => {
      const response = await fetch(`${AUTH_URL}/decode`, {
        method: "GET",
        headers: {
          access_token: access_token,
        },
      });

      if (!response.ok) {
        throw new Error("Respon jaringan tidak berhasil");
      }

      const data = await response.json();

      if (data?.user?.log_NIK) {
        setUser(data);
      }
    };

    // TO DO: ganti MBR jadi dinamis
    const getAndSetAccessRight = async (access_token) => {
      const response = await fetch(
        `${AUTH_URL}/access-right/Master-Batch-Record`,
        {
          method: "GET",
          headers: {
            access_token: access_token,
          },
        }
      );

      if (!response.ok) {
        console.log("Error decoding token");
      }

      const data = await response.json();

      if (data) {
        setAcessRight(data);
      }
    };

    const getAllModules = async (access_token, _programName) => {
      const response = await fetch(`${AUTH_URL}/modules/${_programName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: access_token || "",
        },
      });

      if (!response.ok) {
        throw new Error("Respon jaringan tidak berhasil");
      }

      const data = await response.json();

      if (data) {
        setModules(data);
      }
    };

    const getAllAuthorizedModules = async (access_token, _programName) => {
      const response = await fetch(
        `${AUTH_URL}/authorized-modules/${_programName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            access_token: access_token || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Respon jaringan tidak berhasil");
      }

      const data = await response.json();

      if (data) {
        setAuthorizedModules(data);
      }
    };

    const getAndSetUAR = async (access_token) => {
      try {
        setLoading(true);
        await getAndSetUser(access_token);
        await getAndSetAccessRight(access_token);
        await getAllModules(access_token, NAMA_PROGRAM);
        await getAllAuthorizedModules(access_token, NAMA_PROGRAM);
      } catch (error) {
        console.log(error?.message);
      } finally {
        setLoading(false);
      }
    };

    const access_token = sessionStorage.access_token;

    if (access_token) {
      getAndSetUAR(access_token);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        accessRight,
        modules,
        authorizedModules,
        loading,
        setLoading,
      }}
    >
      {loading && <PreLoader />}
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer position="bottom-right" draggable />
    </UserContext.Provider>
  );
}
