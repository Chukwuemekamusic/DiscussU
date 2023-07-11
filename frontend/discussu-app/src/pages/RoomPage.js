import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Comments from "../components/Comments";
import AddComments from "../components/AddComments";
import AuthContext from "../context/AuthProvider";

const RoomPage = () => {
  const params = useParams();
  const room_id = params.id;

  const [room, setRoom] = useState([]);

  const [roomComment, setRoomComment] = useState([]);

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    getRoomData();
    getRoomCommentData();
  }, [auth]);

  const getRoomData = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/rooms/${room_id}`
    );
    const data = response.data;
    setRoom(data);
  };
  const getRoomCommentData = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/rooms/${room_id}/comments`
    );
    const data = response.data;
    setRoomComment(data);
  };

  return (
    <div className="container-lg">
      <h2>{room.name}</h2>
      <p>
        <i>{room.description}</i>
      </p>

      <div className="card mt-4">
        <div className="card-body">
          <Comments
            room_id={room_id}
            roomComment={roomComment}
            setRoomComment={setRoomComment}
          />
          <AddComments room_id={room_id} />
        </div>
      </div>
      <Link to={"/"}>
        <div className="btn btn-primary">Back to Home Page</div>
      </Link>
      {/* <a href="{% url 'edit-room' room.id %}" class="btn">Edit Room</a> <br>
    <a href="{% url 'delete-room' room.id %}" class="btn btn-danger">Delete Room</a> <br> */}
    </div>
  );
};

export default RoomPage;
