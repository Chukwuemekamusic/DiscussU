import DeleteCommentState from "./DeleteCommentState";
import ReplyCommentState from "./ReplyCommentState";
import AuthContext from "../../context/AuthProvider";
import { useContext, useRef } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import moment from "moment";
import { Link } from "react-scroll";
import { useState, useEffect } from "react";

import {useRoomStore }from './store'


const CommentsState = ({
  room_id,
  // roomComment,
  handleCommentUpdated,
  handleReply,
  // addCommentRef,
  // replyParentComment,
}) => {

  const roomStore = useRoomStore();
  const { room, replyParentComment } = roomStore;
  const roomComment = useRoomStore((state) => state.roomComment); 

  const { user } = useContext(AuthContext);
  console.log(user.id);

  return (
    <div>
      {roomComment.map((comment, index) => {
        console.log(comment.content);
        const timeSince = moment(comment.created).fromNow();
        const parentComment = comment.parent_comment
          ? comment.parent_comment_details
          : null;

        // console.log('this is parent comment', parentComment);
        return (
          <div
            id={`comment-${comment.id}`}
            key={comment.id}
            className="card mb-3"
          >
            {parentComment && (
              <Link
                to={`comment-${parentComment.id}`}
                spy={true}
                smooth={true}
                offset={50}
                duration={500}
              >
                <div className="thumbnail mt-2 reply-thumbnail">
                  <span className="reply-icon">
                    <ReplyIcon />
                  </span>
                  <span className="mb-0"> replying @{parentComment.user} {parentComment.content}</span>
                  
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
              {/* <ReplyCommentState
                room_id={room_id}
                comment={comment}
                handleReply={handleReply}
                addCommentRef={addCommentRef}
                replyParentComment={replyParentComment}
              />
              {user.username === comment.user && (
                <DeleteCommentState
                  room_id={room_id}
                  comment={comment}
                  handleCommentUpdated={handleCommentUpdated}
                />
              )} */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentsState;
