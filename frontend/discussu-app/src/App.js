import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// pages
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<HomePage />} path="" />
          <Route element={<RoomPage />} path="/room/:id"/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
