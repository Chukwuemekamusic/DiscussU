import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

// pages
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import Login from "./pages/Login";
import {RequireAuth} from "react-auth-kit";

function App_auth() {
  return (
  //   <AuthProvider authType = {'cookie'}
  //   authName={'_auth'}
  //   cookieDomain={window.location.hostname}
  //   cookieSecure={false}>
  //  <div className="App">
  //     <Router>
  //       <Routes>
  //         <Route element={<RequireAuth loginPath="/login"><HomePage /></RequireAuth>} path="/" />
  //         <Route element={<RoomPage />} path="/room/:id"/>
  //         <Route element={<Login />} path="/login"/>
  //       </Routes>
  //     </Router>
  //   </div>
  // </AuthProvider>
  <></>
   
  );
}

export default App_auth;
