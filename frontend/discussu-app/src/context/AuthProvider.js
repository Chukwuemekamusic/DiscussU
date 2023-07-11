import { createContext, useState, useEffect } from "react"
import Cookies from "js-cookie"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const isAuthenticated = auth.token !== "";

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setAuth({ token: storedToken });
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      Cookies.set("token", auth.token); }// Set expiration if needed
    // } else {
    //   Cookies.remove("token");
    // }
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;