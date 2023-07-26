import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

import Comments from "../components/Comments";
import AddComments from "../components/AddComments";
import { getHeaders } from "../api/getHeaders";
// import { FaTimes } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";

import { useHomeStore } from "../store";
import DeleteRoom from "../components/DeleteRoom";
import Cookies from "js-cookie";
import useErrorCheck from "../components/utils/useErrorCheck";
import { Card, Container} from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RoomHeader from "../components/RoomHeader";
import '../css/RoomHeader.css'

const RoomPage = () => {
  const params = useParams();
  const room_id = params.id;
  const searchQuery = useHomeStore((state) => state.searchQuery);
  const setSearchQuery = useHomeStore((state) => state.setSearchQuery);
  const students = useHomeStore((state) => state.students);
  console.log("students", students);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const errorCheck = useErrorCheck();

  const addCommentRef = useRef(null);
  

  const [room, setRoom] = useState({});
  const [roomComment, setRoomComment] = useState([]);
  const [replyParentComment, setReplyParentComment] = useState({});
  const commentLastRef = useRef(null);

  useEffect(() => {
    getRoomData();
    getRoomCommentData();
    addCommentRef.current.focus();
  }, []); // TODO fix dependency

  useEffect(() => {
    commentLastRef.current?.scrollIntoView();
  }, [roomComment]); // TODO fix dependency

  const handleGoBack = () => {
    navigate(-1);
  };

  const getRoomData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/${room_id}`,
        getHeaders(token)
      );
      const data = response.data;
      setRoom(data);
      // console.log('host', data)
    } catch (error) {
      errorCheck(error);
    }
  };

  const getRoomCommentData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/rooms/${room_id}/comments`,
        getHeaders(token)
      );
      const data = response.data;
      setRoomComment(data);
    } catch (error) {
      errorCheck(error);
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
      commentLastRef.current?.scrollIntoView();
    }
  };

  const handleCancelReply = () => {
    setReplyParentComment({});
  };

  const handleUpdateRoom = () => {
    navigate(`/room/${room_id}/update`, { state: { room } });
  };

  return (
    <Container className="container-lg">
      <ArrowBackIcon
        onClick={handleGoBack}
        style={{ cursor: "pointer" }}
        className="float-left"
      />
      {/* <div className="room-header">
        <h2>{room.name}</h2>
        <p>
          <i>{room.description}</i>
        </p>
      </div> */}
      <RoomHeader room={room} />

      {user.id === room.host && ( // TODO note the host is returned as a string
        // allows only room host to delete room
        <div className="d-flex align-items-center mb-2">
          <button
            onClick={handleUpdateRoom}
            className="btn btn-primary btn-sm m-2"
          >
            Update Room
          </button>
          <DeleteRoom roomId={room.id} />
        </div>
      )}
      <Container className="container-sm">
        <Card className="card mt-4">
          <Card.Body className="overflow-auto comment-section mb-3">
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
            <div ref={commentLastRef}></div>
          </Card.Body>
          <Card.Footer>
            <AddComments
              room_id={room_id}
              handleCommentUpdated={handleCommentUpdated}
              addCommentRef={addCommentRef}
              replyParentComment={replyParentComment}
              setReplyParentComment={setReplyParentComment}
              // scrollToAddComment={scrollToAddComment}
            />
          </Card.Footer>
        </Card>
      </Container>
      {searchQuery ? (
        <Link to={"/"}>
          <div className="btn btn-primary">Back to Searched results</div>
        </Link>
      ) : (
        <Link to={"/"} onClick={() => setSearchQuery("")}>
          <div className="btn btn-primary">Back to Home Page</div>
        </Link>
      )}
      {/* TODO <Link to={"/"}>
        <div className="btn btn-primary">Back to Home Page</div>
      </Link> */}
      {/* <a href="{% url 'edit-room' room.id %}" class="btn">Edit Room</a> <br>
    <a href="{% url 'delete-room' room.id %}" class="btn btn-danger">Delete Room</a> <br> */}
    </Container>
  );
};

export default RoomPage;
