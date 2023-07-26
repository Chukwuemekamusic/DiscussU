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
import RoomCreateForm from "./components/RoomCreateForm";
// import { ErrorCheck } from "./components/utils/utilFunctions";
import useErrorCheck from "./components/utils/useErrorCheck";
import RoomUpdateForm from "./components/RoomUpdateForm";
import UserProfilePage from "./pages/UserProfile";

import { Container, Row, Col } from "react-bootstrap";
// import Sidebar from "./components/Sidebar";
import Sidebar2 from "./components/Sidebar2";
// import Sidebar3 from "./components/Sidebar3";
import FormEditProfile from "./components/FormEditProfile";
import StudentProfilePage from "./pages/StudentProfile";

// import useHandleAxiosError from "./components/utils/useHandleAxiosError";

// import AuthHeaders from "./context/AuthHeaders";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const errorCheck = useErrorCheck();
  // const [rooms, setRooms] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [
    rooms,
    setRooms,
    setCategories,
    isopen,
    setIsOpen,
    setSchools,
    // schools,
    updateUserData,
    getStudentsProfile,
  ] = useHomeStore((state) => [
    state.rooms,
    state.setRooms,
    state.setCategories,
    state.isopen,
    state.setIsopen,
    state.setSchools,
    // state.schools,
    state.updateUserData,
    state.getStudentsProfile
  ]);
  const token = Cookies.get("token");
  // const handleAxiosError = useHandleAxiosError();

  useEffect(() => {
    getRoomsData(searchQuery);
    getCategoriesData();
    getSchoolsData();
    updateUserData();
    getStudentsProfile();
    
    setSearchQuery("");
  }, [token]);

  useEffect(() => {
    getRoomsData(searchQuery);
    getCategoriesData();
  }, [searchQuery]);

  const { auth } = useContext(AuthContext);
  // console.log(auth.token);

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
      errorCheck(error);
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
      const response = await axios.get(`http://localhost:8000/api/schools/`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const data = await response.data;
      setSchools(data);
      // console.log("schools", schools);
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
      {/* className=" d-flex" */}
      <Container fluid className="body">
        <Row>
        <Col md={2} className="p-0 mt-2">
        {/* <Sidebar setSearchQuery={setSearchQuery}/> */}
        <Sidebar2 setSearchQuery={setSearchQuery}/>
        {/* <Sidebar3 setSearchQuery={setSearchQuery}/> */}
        </Col>

        <Col md={10} className="p-0">
          {/* <div className="body"> */}
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
              <Route element={<FormEditProfile />} path="/edit-profile" />
              <Route
                element={<RoomCreateForm getRoomsData={getRoomsData} />}
                path="/room/create"
              />
              <Route element={<RoomUpdateForm />} path="/room/:roomId/update" />
              <Route element={<UserProfilePage />} path="/user/profile" />
              <Route element={<StudentProfilePage />} path="/student/:id/profile" />
            </Routes>
          {/* </div> */}
        </Col>
        </Row>
      </Container>

      {/* </Router> */}
    </div>
  );
}

export default App;
