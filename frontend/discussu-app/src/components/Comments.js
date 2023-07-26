import DeleteComment from "./DeleteComment";
import ReplyComment from "./ReplyComment";
import AuthContext from "../context/AuthProvider";
import { useContext, useRef } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import moment from "moment";
import { Link } from "react-scroll";
import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Badge, Image } from "react-bootstrap";

const Comments = ({
  room_id,
  roomComment,
  handleCommentUpdated,
  handleReply,
  addCommentRef,
  replyParentComment,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [highlightedComment, setHighlightedComment] = useState(null);

  useEffect(() => {
    if (highlightedComment) {
      setTimeout(() => {
        setHighlightedComment(null);
      }, 7000);
    }
  }, [highlightedComment]);

  return (
    <>
      {roomComment.map((comment) => {
        const timeSince = moment(comment.created).fromNow();
        const parentComment = comment.parent_comment
          ? comment.parent_comment_details
          : null;
          console.log("comment", comment);
          // const isUserComment = user && user.id === comment.user

        return (
          <Card
            id={`comment-${comment.id}`}
            key={comment.id}
            className={`mb-4 ${
              highlightedComment === comment.id ? "highlighted-comment" : ""
            }`}
            style={{ width: "500px" }}
          >
            <Card.Body>
              {/* className="card-header" id="commentUserHeader" */}
              <div className="d-flex align-items-center ">
                <Image
                  src={comment.user_profile_pic}
                  roundedCircle
                  className="profile-pic mr-3"
                />
                <div>
                  <h6 className="mb-0">{comment.user_full_name}</h6>
                  {console.log(comment.user)}
                  <small className="text-muted">@{comment.user}</small>
                </div>
              </div>
              <small className="text-muted mt-2">{timeSince}</small>
              <hr />
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
                    <span className="mb-0">
                      <i>replying</i> @{parentComment.user}{" "}
                      {parentComment.content}
                    </span>
                    <span className="reply-icon">
                      <ReplyIcon />
                    </span>
                  </div>
                </Link>
              )}
              <p>{comment.content}</p>

              <div className="d-flex justify-content-between mt-3">
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
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default Comments;

// return (
//   <div>
//     {roomComment.map((comment, index) => {
//       const timeSince = moment(comment.created).fromNow();
//       const parentComment = comment.parent_comment
//         ? comment.parent_comment_details
//         : null;

//       // console.log('this is parent comment', parentComment);
//       return (
//         <div
//           id={`comment-${comment.id}`}
//           key={comment.id}
//           className={`card mb-3 ${
//             highlightedComment === comment.id ? "highlighted-comment" : ""
//           }`}
//         >

//           <div className="card-header" id="commentUserHeader">
//             <span>
//               <b>{comment.user_full_name}</b>{" "}
//               <small>
//                 @{comment.user} <i>{timeSince}</i>
//               </small>
//             </span>
//           </div>
//           {parentComment && (
//             <Link
//               to={`comment-${parentComment.id}`}
//               spy={true}
//               smooth={true}
//               offset={0}
//               duration={500}
//               onClick={() => setHighlightedComment(parentComment.id)}
//             >
//               <div className="thumbnail mt-2 reply-thumbnail">
//                 <span className="reply-icon">
//                   <ReplyIcon />
//                 </span>
//                 <span className="mb-0">
//                   {" "}
//                   replying @{parentComment.user} {parentComment.content}
//                 </span>
//               </div>
//             </Link>
//           )}

//           <div className="card-body" id="commentBody">
//             <p>{comment.content}</p>
//             <ReplyComment
//               room_id={room_id}
//               comment={comment}
//               handleReply={handleReply}
//               addCommentRef={addCommentRef}
//               replyParentComment={replyParentComment}
//             />
//             {/* TODO fix to user.id */}
//             {user.username === comment.user && (
//               <DeleteComment
//                 room_id={room_id}
//                 comment={comment}
//                 handleCommentUpdated={handleCommentUpdated}
//               />
//             )}
//           </div>
//         </div>
//       );
//     })}
//   </div>
// );
