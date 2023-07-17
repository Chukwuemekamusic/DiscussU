import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import CommentsState from "./CommentsState";
import AddCommentsState from "./AddCommentsStates";
import AuthContext from "../../context/AuthProvider";
import { getHeaders } from "../../api/getHeaders";
import useHandleAxiosError from "../../components/utils/useHandleAxiosError";
import { FaTimes } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";

import {useRoomStore} from './store'


const RoomState = () => {
  const roomStore = useRoomStore();
  const { room, roomComment, replyParentComment } = roomStore;

  const params = useParams();
  const room_id = params.id;
  // const handleAxiosError = useHandleAxiosError();
  // const addCommentRef = useRef(null);

  // const [room, setRoom] = useState([]);
  // const [roomComment, setRoomComment] = useState([]);
  // const [replyParentComment, setReplyParentComment] = useState({});

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    getRoomData();
    getRoomCommentData();
    // addCommentRef.current.focus();
  }, [auth]);

  const getRoomData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/${room_id}`,
        getHeaders(auth.token)
      );
      const data = response.data;
      // setRoom(data);
      roomStore.setRoom(data);
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
      // setRoomComment(data);
      roomStore.setRoomComment(data)
      console.log('data', data );
    } catch (error) {
      // handleAxiosError(error)
    }
  };

  const handleCommentUpdated = () => {
    getRoomCommentData();
  };

  const handleReply = (parentComment) => {
    if (parentComment) {
      roomStore.setReplyParentComment(parentComment);
      // addCommentRef.current.focus();
      console.log(replyParentComment.user);
    }
  };

  const handleCancelReply = () => {
    roomStore.setReplyParentComment({});
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
            <CommentsState
              room_id={room_id}
              // roomComment={roomComment}
              // setRoomComment={setRoomComment}
              handleCommentUpdated={handleCommentUpdated}
              handleReply={handleReply}
              // addCommentRef={addCommentRef}
              // replyParentComment={replyParentComment}
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
            {/* <AddCommentsState
              room_id={room_id}
              handleCommentUpdated={handleCommentUpdated}
              addCommentRef={addCommentRef}
              replyParentComment={replyParentComment}
              setReplyParentComment={setReplyParentComment}
              // scrollToAddComment={scrollToAddComment}
            /> */}
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

export default RoomState;
