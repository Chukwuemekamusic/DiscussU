import { createContext, useState} from "react";
import Cookies from "js-cookie";
// import { useNavigate } from "react-router"

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  // const [user, setUser] = useState({});
  const isAuthenticated = auth.token !== "";

  // const handleSetUser = (userData) => {
  //   setUser(userData);
  // };

  const handleSetAuth = (userData) => {
    setAuth(userData);
  };
  

  // useEffect(() => {
  //   const storedToken = Cookies.get("token");
    
  //   if (storedToken) {
  //     setAuth({ token: storedToken });
  //   }
  //   if (storedUser) {
  //     setUser(storedUser);
  //   }
  // }, []);

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setAuth({});
    // handleSetUser(null)
  };

  // const getHeaders = (q) => {
  //   return {
  //     headers: {
  //       Authorization: `Token ${q}`,
  //     },
  //   };
  // };



  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth: handleSetAuth,
        isAuthenticated,
        logout,
        // setUser: handleSetUser,
        // user,
        // getStoredUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
