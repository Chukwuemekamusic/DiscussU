import DeleteComment from "./DeleteComment";
import ReplyComment from "./ReplyComment";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";

const Comments = ({
  room_id,
  roomComment,
  handleCommentUpdated,
  handleReply,
  addCommentRef
}) => {
  const { user } = useContext(AuthContext);
  console.log(user.id);

  return (
    <div>
      {roomComment.map((comment) => {
        return (
          <div key={comment.id}>
            <span>@{comment.user}</span>
            <p>
              {comment.content}{" "}
              {user.username === comment.user && (
                <>
                  <DeleteComment
                    room_id={room_id}
                    comment={comment}
                    handleCommentUpdated={handleCommentUpdated}
                  />
                </>
              )}
              <ReplyComment
                room_id={room_id}
                comment={comment}
                handleReply={handleReply}
                addCommentRef={addCommentRef}
              />
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
