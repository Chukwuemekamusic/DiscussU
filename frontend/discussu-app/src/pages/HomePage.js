import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import Cookies from "js-cookie";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    getRoomsData();
    // console.log(authHeader())
    console.log(JSON.stringify("this is the auth", auth));
  }, [auth]);

  const getRoomsData = async (q = "") => {
    const token = await Cookies.get("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/?q=${q}`,
        
      );
      const data = await response.data;
      setRooms(data);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

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
