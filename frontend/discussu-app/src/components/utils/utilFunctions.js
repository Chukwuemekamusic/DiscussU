import { useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";
import { getHeaders } from "../../api/getHeaders";
import { useHomeStore } from "../../store";
import Cookies from "js-cookie";

const title = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};



const ErrorCheck = (error) => {
  if (error.response) {
    // Handle API error (status code 4xx or 5xx)
    console.error(error.response.data);
  } else if (error.request) {
    // Handle request error (no response received)
    console.error("No response from server.");
  } else {
    // Handle other errors
    console.error("An error occurred:", error.message);
  }
}


export const usePlainLogout = () => {
  const { logout } = useContext(AuthContext);
  const setClose = useHomeStore((state) => state.setClose);
  const token = Cookies.get('token')

  const plainLogout = () => {
    logout();
    logoutapi();
    setClose();
  }

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

  return plainLogout
}

export { title, ErrorCheck }
