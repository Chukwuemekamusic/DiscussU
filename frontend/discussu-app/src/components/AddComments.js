import { useState, useContext } from "react";
import axios from "axios";
import { getHeaders } from "../api/getHeaders";
import AuthContext from "../context/AuthProvider";

const AddComments = ({
  room_id,
  handleCommentUpdated,
  addCommentRef,
  replyParentComment,
  setReplyParentComment,
}) => {
  const parentComment = replyParentComment ? replyParentComment : null;
  const parentTag = parentComment ? parentComment.user : null;

  const [newComment, setNewComment] = useState("");
  const { auth } = useContext(AuthContext);

  const handleCommentSubmit = async (e) => {
    // console.log(newComment);
    // console.log(parentComment.id);
    e.preventDefault();
    const id = parentComment ? parentComment.id : null

    try {
      const response = await axios.post(
        `http://localhost:8000/api/rooms/${room_id}/comments/`,
        { content: newComment, parent_comment: parentComment.id},
        getHeaders(auth.token)
      );

      // Reset input field
      setNewComment("");
      setReplyParentComment({});

      // console.log(response.data);
      // console.log(room_id);
      handleCommentUpdated();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className=" p-2">
      <form onSubmit={handleCommentSubmit}>
        <label htmlFor="content" className="form-label">Add a comment</label>
        <input
          type="text"
          name="content"
          placeholder="Add a comment..."
          // value={parentTag && `@${parentTag} ` + newComment}
          value={`${parentTag ? `@${parentTag} ` : ""}${newComment}`}
          onChange={(e) =>
            setNewComment(
              e.target.value.substring(parentTag ? `@${parentTag} `.length : 0)
            )
          }
          ref={addCommentRef}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default AddComments;
