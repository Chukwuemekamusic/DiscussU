import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Comments from "../components/Comments";
import AddComments from "../components/AddComments";
import AuthContext from "../context/AuthProvider";
import { getHeaders } from "../api/getHeaders";
import useHandleAxiosError from "../components/utils/useHandleAxiosError";
import { FaTimes } from "react-icons/fa";

const RoomPage = () => {
  const params = useParams();
  const room_id = params.id;
  // const handleAxiosError = useHandleAxiosError();
  const addCommentRef = useRef(null);

  const [room, setRoom] = useState([]);
  const [roomComment, setRoomComment] = useState([]);
  const [replyParentComment, setReplyParentComment] = useState(null);

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    getRoomData();
    getRoomCommentData();
  }, [auth]);

  const getRoomData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/${room_id}`,
        getHeaders(auth.token)
      );
      const data = response.data;
      setRoom(data);
    } catch (error) {
      // handleAxiosError(error)
    }
  };

  const getRoomCommentData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/${room_id}/comments`,
        getHeaders(auth.token)
      );
      const data = response.data;
      setRoomComment(data);
    } catch (error) {
      // handleAxiosError(error)
    }
  };

  const handleCommentUpdated = () => {
    getRoomCommentData();
  };

  const handleReply = (parentComment) => {
    setReplyParentComment(parentComment);
    addCommentRef.current.focus();
  };

  const handleCancelReply = () => {
    setReplyParentComment(null);
  };

  return (
    <div className="container-lg">
      <h2>{room.name}</h2>
      <p>
        <i>{room.description}</i>
      </p>
      <div className="container-sm">
        <div className="card mt-4">
          <div className="card-body">
            <Comments
              room_id={room_id}
              roomComment={roomComment}
              setRoomComment={setRoomComment}
              handleCommentUpdated={handleCommentUpdated}
              handleReply={handleReply}
              addCommentRef={addCommentRef}
            />
            {replyParentComment && (
              <div className="thumbnail mt-2 reply-thumbnail">
                <span><small>@{replyParentComment.user}</small></span>
                <p className="mb-0">{replyParentComment.content}</p>
                <div className="text-end">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={handleCancelReply}
                  >
                    Cancel
                    {/* <FaTimes/> */}
                  </button>
                  {/* Handle the logic for adding the reply */}
                  {/* You can include an AddReply component or perform the necessary API calls here */}
                  <button className="btn btn-sm btn-primary">Add Reply</button>
                </div>
              </div>
            )}
            <AddComments
              room_id={room_id}
              handleCommentUpdated={handleCommentUpdated}
              addCommentRef={addCommentRef}
            />
          </div>
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
