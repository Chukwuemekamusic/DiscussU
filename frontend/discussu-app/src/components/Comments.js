import DeleteComment from "./DeleteComment";
import ReplyComment from "./ReplyComment";
import AuthContext from "../context/AuthProvider";
import { useContext, useRef } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import moment from "moment";
import { Link } from "react-scroll";
import { useState, useEffect } from "react";

const Comments = ({
  room_id,
  roomComment,
  handleCommentUpdated,
  handleReply,
  addCommentRef,
  replyParentComment,
}) => {

  const { user } = useContext(AuthContext);
  const [highlightedComment, setHighlightedComment] = useState(null);

  useEffect(() => {
    if (highlightedComment) {
      setTimeout(() => {
        setHighlightedComment(null)
      }, 7000);
    }
  }, [highlightedComment])

  return (
    <div>
      {roomComment.map((comment, index) => {
        const timeSince = moment(comment.created).fromNow();
        const parentComment = comment.parent_comment
          ? comment.parent_comment_details
          : null;

        // console.log('this is parent comment', parentComment);
        return (
          <div
            id={`comment-${comment.id}`}
            key={comment.id}
            className={`card mb-3 ${
              highlightedComment === comment.id ? "highlighted-comment" : ""
            }`}
          >
            {parentComment && (
              <Link
                to={`comment-${parentComment.id}`}
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
                onClick={() => setHighlightedComment(parentComment.id)}
              >
                <div className="thumbnail mt-2 reply-thumbnail">
                  <span className="reply-icon">
                    <ReplyIcon />
                  </span>
                  <span className="mb-0">
                    {" "}
                    replying @{parentComment.user} {parentComment.content}
                  </span>
                </div>
              </Link>
            )}
            <div className="card-header" id="commentUserHeader">
              <span>
                <b>{comment.user_full_name}</b>{" "}
                <small>
                  @{comment.user} <i>{timeSince}</i>
                </small>
              </span>
            </div>

            <div className="card-body" id="commentBody">
              <p>{comment.content}</p>
              <ReplyComment
                room_id={room_id}
                comment={comment}
                handleReply={handleReply}
                addCommentRef={addCommentRef}
                replyParentComment={replyParentComment}
              />
              {user.username === comment.user && (
                <DeleteComment
                  room_id={room_id}
                  comment={comment}
                  handleCommentUpdated={handleCommentUpdated}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
