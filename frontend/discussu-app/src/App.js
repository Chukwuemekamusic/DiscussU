import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";

import AuthHeaders from "./context/AuthHeaders";


function App() {

  return (
    <div className="App">
      
      <AuthHeaders />
      <Router>
        <Navbar/>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<RoomPage />} path="/room/:id" />
          <Route element={<Login />} path="/login" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;