import "./App.css";
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  // useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import Login from "./pages/Login";
import NavbarMain from "./components/NavbarMain";
import RoomState from "./pages/state_test/RoomState";

import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import AuthContext from "./context/AuthProvider";
import axios from "axios";
import { getHeaders } from "./api/getHeaders";
import Cookies from "js-cookie";
import { useHomeStore } from "./store";
import Form from "./components/Form";
import RoomForm from "./components/RoomForm";

// import useHandleAxiosError from "./components/utils/useHandleAxiosError";

// import AuthHeaders from "./context/AuthHeaders";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [rooms, setRooms] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [rooms, setRooms, setCategories, isopen, setIsOpen, setSchools, schools] =
    useHomeStore((state) => [
      state.rooms,
      state.setRooms,
      state.setCategories,
      state.isopen,
      state.setIsopen,
      state.setSchools,
      state.schools
    ]);
  const token = Cookies.get("token");
  // const handleAxiosError = useHandleAxiosError();

  useEffect(() => {
    getRoomsData(searchQuery);
    getCategoriesData();
    getSchoolsData();
    // console.log(authHeader())
    console.log(JSON.stringify("this is the auth"));
    // setSearchQuery('')
  }, [token, searchQuery]);

  const { auth } = useContext(AuthContext);
  console.log(auth.token);

  const getRoomsData = async (q) => {
    // const token = Cookies.get("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/?q=${q}`,
        getHeaders(token)
      );
      const data = await response.data;
      setRooms(data);
      // console.log(data);
    } catch (error) {
      // console.error("Error res status: ", error.response.status);
      // console.error("Error res: ", error.response.status);
      // handleAxiosError(error) // this logs out a user when it fails
    }
  };

  const getCategoriesData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/categories/`,
        getHeaders(token)
      );
      const data = await response.data;
      setCategories(data);
    } catch (error) {
      // console.error("Category Error res status: ", error.response.status);
      // console.error("Category Error res: ", error.response.status);
      // handleAxiosError(error)
    }
  };

  const sortRoomsByCategory = (q) => {
    getRoomsData(q);
  };

  // get List of schools
  const getSchoolsData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/schools/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const data = await response.data;
      setSchools(data);
      console.log("schools", schools);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" ">
      {/* <AuthHeaders /> */}
      {/* <Router> */}
      <NavbarMain
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isopen={isopen}
        setIsOpen={setIsOpen}
      />
      {/* <UserNav isopen={isopen} setIsOpen={setIsOpen} /> */}
      <div className="body">
        <Routes>
          <Route
            element={
              <HomePage
                searchQuery={searchQuery}
                sortRoomsByCategory={sortRoomsByCategory}
                token={token}
              />
            }
            path="/"
          />
          <Route element={<RoomPage rooms={rooms} />} path="/room/:id" />
          <Route element={<Login />} path="/login" />
          <Route element={<RoomState />} path="/room-state/:id" />
          <Route element={<Form />} path="/register" />
          <Route element={<RoomForm getRoomsData={getRoomsData}/>} path="/room/create" />
        </Routes>
      </div>
      {/* </Router> */}
    </div>
  );
}

export default App;
