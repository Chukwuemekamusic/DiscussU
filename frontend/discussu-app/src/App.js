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
import RoomState from "./pages/state_test/RoomState";

import { useState } from "react";

// import AuthHeaders from "./context/AuthHeaders";


function App() {
  const [searchQuery, setSearchQuery] = useState('')
  // const [searchResults, setSearchResults] = useState([])

  return (
    <div className=" ">
      
      {/* <AuthHeaders /> */}
      <Router>
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <div className="body">
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<RoomPage />} path="/room/:id" />
          <Route element={<Login />} path="/login" />
          <Route element={<RoomState />} path="/room-state/:id" />
          {/* <Route element={<SearchResults/>} path="/search"/> */}
        </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
