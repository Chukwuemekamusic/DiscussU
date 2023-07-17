// import { FaTimes } from "react-icons/fa";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from "axios";
import { getHeaders } from "../api/getHeaders";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const DeleteComment = ({ comment, handleCommentUpdated }) => {
  const { auth } = useContext(AuthContext);
  const handleDeleteComment = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/comments/${comment.id}/delete/`,
        getHeaders(auth.token)
      );
      handleCommentUpdated();
    } catch (error) {
      console.error(error);
      console.log(comment.id);
    }
  };

  return (
    <>
      <DeleteForeverIcon onClick={handleDeleteComment} style={{ fontSize: "15px", color: "red" }}/>
    </>
  );
};

export default DeleteComment;
