import { useState, useEffect } from "react";
import axios from "axios";

const AddComments = ({room_id}) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/api/rooms/${room_id}/comments`,
        { content: newComment }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    // Reset input field
    setNewComment("");
  };
  return (
    <div>
      <form onSubmit={handleCommentSubmit}>
        <label htmlFor="content">Add a comment</label>
        <input
          type="text"
          name="content"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AddComments;
