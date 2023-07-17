import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
// import { useNavigate } from "react-router"

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [user, setUser] = useState({});
  const isAuthenticated = auth.token !== "";

  const handleSetUser = (userData) => {
    setUser(userData);
  };

  const handleSetAuth = (userData) => {
    setAuth(userData);
  };

  const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  };
  

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = getStoredUser()
    
    if (storedToken) {
      setAuth({ token: storedToken });
    }
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setAuth({});
    handleSetUser(null)
  };

  const getHeaders = (q) => {
    return {
      headers: {
        Authorization: `Token ${q}`,
      },
    };
  };

  // useEffect(() => {
  //   if (auth.token) {
  //     Cookies.set("token", auth.token); // Set expiration if needed
  //   } else {
  //     Cookies.remove("token");
  //   }
  // }, [auth.token]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth: handleSetAuth,
        isAuthenticated,
        getHeaders,
        logout,
        setUser: handleSetUser,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
