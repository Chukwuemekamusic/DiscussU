import { useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router";
import { getHeaders } from "../../api/getHeaders";

const useHandleLogout = () => {
  const { logout, auth } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    logoutapi()
    navigate('/login')
  }

const logoutapi = async () => {
  try {
    await axios.post(
      `http://localhost:8000/api/users/logout/`,null,
      getHeaders(auth.token)
    )

  } catch (error) {
    console.error(error);
  }
}

return handleLogout
};
export default useHandleLogout