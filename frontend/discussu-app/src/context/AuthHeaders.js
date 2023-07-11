import axios from "axios";
import { useContext } from "react";
import AuthContext from "./AuthProvider";

const AuthHeaders = () => {
  const { auth } = useContext(AuthContext);
  

  axios.defaults.headers.common["Authorization"] = `Token ${auth.token}`;

  return null;
};

export default AuthHeaders;
