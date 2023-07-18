import { useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router";
import { getHeaders } from "../../api/getHeaders";
import { useHomeStore } from "../../store";
import Cookies from "js-cookie";

const useHandleLogout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const setClose = useHomeStore((state) => state.setClose);
  const token = Cookies.get('token')

  const handleLogout = () => {
    logout();
    logoutapi();
    navigate("/login");
    setClose();
  };


  const logoutapi = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/users/logout/`,
        null,
        getHeaders(token)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return handleLogout;
};

export default useHandleLogout;

