import { FaTimes } from "react-icons/fa";
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
      <FaTimes onClick={handleDeleteComment} />
    </>
  );
};

export default DeleteComment;
