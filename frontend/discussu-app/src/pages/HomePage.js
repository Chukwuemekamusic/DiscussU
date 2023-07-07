import { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        getData();
      }, []);
    
      const getData = async (q = '') => {
        const response = await axios.get(`http://localhost:8000/api/rooms/?q=${q}`);
        const data = await response.data;
        setRooms(data);
      };
    
  return (
    <div>
        <h1>List of Rooms</h1>
        <div>
            {rooms.map((room, index) => {
                return (
                    <h3 key={index}>
                        {room.name}
                    </h3>
                )
            })}
        </div>

    </div>
  )
}

export default HomePage