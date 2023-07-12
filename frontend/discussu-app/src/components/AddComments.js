import { useState, useContext } from "react";
import axios from "axios";
import { getHeaders } from "../api/getHeaders";
import AuthContext from "../context/AuthProvider";

const AddComments = ({ room_id, handleCommentUpdated, addCommentRef }) => {
  const [newComment, setNewComment] = useState("");
  const { auth } = useContext(AuthContext);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/api/rooms/${room_id}/comments/`,
        { content: newComment },
        getHeaders(auth.token)
      );
      // Reset input field
      setNewComment("");
      console.log(response.data);
      console.log(room_id);
      handleCommentUpdated();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleCommentSubmit}>
        <label htmlFor="content">Add a comment</label>
        <input
          type="text"
          name="content"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          ref={addCommentRef}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AddComments;
