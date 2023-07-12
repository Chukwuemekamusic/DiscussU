import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import Cookies from "js-cookie";
import { getHeaders } from "../api/getHeaders";
import useHandleAxiosError from "../components/utils/useHandleAxiosError";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") || "";

  const handleAxiosError = useHandleAxiosError()

  useEffect(() => {
    getRoomsData(searchQuery);
    // console.log(authHeader())
    console.log(JSON.stringify("this is the auth", auth));
  }, [auth]);

  const getRoomsData = async (q) => {
    const token = await Cookies.get("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/?q=${q}`,
        getHeaders(auth.token)
      );
      const data = await response.data;
      setRooms(data);

      console.log(data);
    } catch (error) {
      // handleAxiosError(error) // this logs out a user when it fails
    }
  };

  // const getHeaders = (q) => {
  //   return {
  //     headers: {
  //       "Authorization": `Token ${q}`
  //     }
  //   }
  // }

  return (
    <div className="container-lg">
      <h1>List of Rooms</h1>
      <div>
        {rooms.map((room, index) => {
          return (
            <h3 key={index}>
              <Link to={`/room/${room.id}`}>{room.name}</Link>
            </h3>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
