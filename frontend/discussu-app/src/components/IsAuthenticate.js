import { useContext } from "react";
import AuthContext from "./AuthProvider";



const IsAuthenticate = () => {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = true ? (auth.token !== '') : (auth.token === '')
  return isAuthenticated
}

export default IsAuthenticate