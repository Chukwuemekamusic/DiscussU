// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import AuthContext from "../context/AuthProvider";
// import Cookies from "js-cookie";
// import { getHeaders } from "../api/getHeaders";
// import useHandleAxiosError from "../components/utils/useHandleAxiosError";
// import moment from "moment";
import RoomsFeed from "../components/RoomsFeed";
import CategoriesFeed from "../components/CategoriesFeed";
import { useHomeStore } from "../store";
// import { useNavigate } from "react-router";
import useHandleLogout from "../components/utils/useHandleLogout";


const HomePage = ({sortRoomsByCategory, token}) => {

  const [rooms, categories] = useHomeStore((state) => [
    state.rooms,
    state.categories
  ]);
  // const navigate = useNavigate();
  const handleLogout = useHandleLogout()
  const user = localStorage.getItem('user')

  if (!token ) { // && !user
    handleLogout()
    return null
  }

  // const [rooms, setRooms] = useState([]);
  // const [categories, setCategories] = useState([]);
  // const { auth } = useContext(AuthContext);
  // const location = useLocation();
  // const navigate = useNavigate();
  // const searchQuery = new URLSearchParams(location.search).get("q") || "";

  // const handleAxiosError = useHandleAxiosError();

  // useEffect(() => {
  //   getRoomsData(searchQuery);
  //   getCategoriesData();
  //   // console.log(authHeader())
  //   console.log(JSON.stringify("this is the auth", auth));
  // }, [auth]);

  // const getRoomsData = async (q) => {
  //   const token = Cookies.get("token");
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/api/rooms/?q=${q}`,
  //       getHeaders(token)
  //     );
  //     const data = await response.data;
  //     setRooms(data);

  //     console.log(data);
  //   } catch (error) {
  //     // handleAxiosError(error) // this logs out a user when it fails
  //   }
  // };

  // const getCategoriesData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/api/categories/`,
  //       getHeaders(auth.token)
  //     );
  //     const data = await response.data;
  //     setCategories(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const sortRoomsByCategory = (q) => {
  //   getRoomsData(q);
  // };

  return (
    
    <div className="container-lg">
      <div className="row">
        <div className="col-lg-4">
          {/* category list */}
          <h2>Category</h2>
          <hr />
          <CategoriesFeed
            sortRoomsByCategory={sortRoomsByCategory}
            categories={categories}
          />
        </div>
        <div className="col-lg-8">
          {/* Discussion Rooms */}
          <h1>List of Rooms</h1>
          {/* # TODO 
          {searchQuery && (<h4>available for "{searchQuery}" search...</h4>)} */} 
          {/* Room Feed */}
          <RoomsFeed rooms={rooms} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
