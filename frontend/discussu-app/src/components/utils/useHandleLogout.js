// import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { getHeaders } from "../../api/getHeaders";
import Cookies from "js-cookie";


const useHandleLogout = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const handleLogout = async () => {
    // logout();
    await logoutapi();
    navigate("/login");
  };

  const logoutapi = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/users/logout/`,
        null,
        getHeaders(token)
      );
    } catch (error) {
      console.error(error.response.data.detail);
    } finally {
      Cookies.remove("token");
      localStorage.removeItem("user");
    }
  };

  return handleLogout;
};

export default useHandleLogout;
