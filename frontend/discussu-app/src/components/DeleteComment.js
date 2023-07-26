// import { FaTimes } from "react-icons/fa";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from "axios";
import { getHeaders } from "../api/getHeaders";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";
import useErrorCheck from './utils/useErrorCheck';
import { Button } from 'react-bootstrap';

const DeleteComment = ({ comment, handleCommentUpdated }) => {
  const { auth } = useContext(AuthContext);
  const errorCheck = useErrorCheck();
  const handleDeleteComment = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/comments/${comment.id}/delete/`,
        getHeaders(auth.token)
      );
      handleCommentUpdated();
    } catch (error) {
      errorCheck(error)
      console.log(comment.id);
    }
  };

  return (
    <>
      {/* <DeleteForeverIcon onClick={handleDeleteComment} style={{ color: "red" }} /> */}
      <Button
        variant="danger"
        size="sm"
        onClick={handleDeleteComment}
      >
        Delete
      </Button>
    </>
  );
};

export default DeleteComment;
