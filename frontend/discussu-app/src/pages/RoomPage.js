import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Comments from "../components/Comments";
import AddComments from "../components/AddComments";
import AuthContext from "../context/AuthProvider";
import { getHeaders } from "../api/getHeaders";
import useHandleAxiosError from "../components/utils/useHandleAxiosError";
import { FaTimes } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";

import { useHomeStore } from "../store";
import DeleteRoom from "../components/DeleteRoom";

const RoomPage = () => {
  const params = useParams();
  const room_id = params.id;
  const searchQuery = useHomeStore((state) => state.searchQuery)
  const setSearchQuery = useHomeStore((state) => state.setSearchQuery)
  // const [rooms] = useHomeStore((state) => [
  //   state.rooms
  // ]);
  // const room = rooms.find((room) => room.id == room_id);
  
  // const handleAxiosError = useHandleAxiosError();
  const addCommentRef = useRef(null);

  const [room, setRoom] = useState([]);
  const [roomComment, setRoomComment] = useState([]);
  const [replyParentComment, setReplyParentComment] = useState({});

  const { auth } = useContext(AuthContext);
  

  useEffect(() => {
    getRoomData();
    getRoomCommentData();
    addCommentRef.current.focus();
  }, [auth]);

  // const roomAndComment = async () => {
  //   await getRoomData();
  //   await getRoomCommentData();
  // };

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
    if (parentComment) {
      setReplyParentComment(parentComment);
      addCommentRef.current.focus();
      console.log(replyParentComment.user);
    }
  };

  const handleCancelReply = () => {
    setReplyParentComment({});
  };

  // const scrollToAddComment = () => {
  //   scroll.scrollTo("add-comment-input", {
  //     duration: 500,
  //     smooth: true,
  //     offset: -100, // Adjust the offset if needed
  //   });
  // };

  return (
    <div className="container-lg">
      <h2>{room.name}</h2>
      <p>
        <i>{room.description}</i>
      </p>
      <DeleteRoom roomId={room.id} />
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
              replyParentComment={replyParentComment}
            />
            {replyParentComment.user && (
              <div className="thumbnail mt-2 reply-thumbnail">
                <span>
                  <small>@{replyParentComment.user}</small>
                </span>
                <p className="mb-0">
                  {replyParentComment.content}{" "}
                  <small className="text-end">
                    <CancelIcon onClick={handleCancelReply} />
                  </small>
                </p>
              </div>
            )}
            <AddComments
              room_id={room_id}
              handleCommentUpdated={handleCommentUpdated}
              addCommentRef={addCommentRef}
              replyParentComment={replyParentComment}
              setReplyParentComment={setReplyParentComment}
              // scrollToAddComment={scrollToAddComment}
            />
          </div>
        </div>
      </div>
        {searchQuery ? (
          <Link to={"/"}>
          <div className="btn btn-primary">Back to Searched results</div>
        </Link>
        ): (
          <Link to={"/"} onClick={() => setSearchQuery("")}>
        <div className="btn btn-primary" >Back to Home Page</div>
      </Link>
        )}
      {/* <Link to={"/"}>
        <div className="btn btn-primary">Back to Home Page</div>
      </Link> */}
      {/* <a href="{% url 'edit-room' room.id %}" class="btn">Edit Room</a> <br>
    <a href="{% url 'delete-room' room.id %}" class="btn btn-danger">Delete Room</a> <br> */}
    </div>
  );
};

export default RoomPage;
