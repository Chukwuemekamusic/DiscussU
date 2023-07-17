import DeleteComment from "../DeleteComment";
import ReplyComment from "../ReplyComment";
import AuthContext from "../../context/AuthProvider";
import { useContext } from "react";
import ReplyIcon from '@mui/icons-material/Reply';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/system';

const CommentContainer = styled('div')({
  marginBottom: '1.5rem',
});

const CommentText = styled('p')({
  marginBottom: '0.5rem',
});

const Username = styled('span')({
  fontWeight: 'bold',
  marginRight: '0.5rem',
});

const ReplyThumbnail = styled('div')({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f1f1f1',
  padding: '0.5rem',
  borderRadius: '4px',
  opacity: '0.7',
  marginBottom: '0.5rem',
});

const ReplyIconWrapper = styled('span')({
  marginRight: '0.5rem',
});

const Comments2 = ({
  room_id,
  roomComment,
  handleCommentUpdated,
  handleReply,
  addCommentRef,
  replyParentComment,
}) => {
  const { user } = useContext(AuthContext);
  console.log(user.id);

  return (
    <div>
      {roomComment.map((comment) => {
        const parentComment = comment.parent_comment ? comment.parent_comment_details : null;
        // console.log('this is parent comment', parentComment);
        return (
          <CommentContainer key={comment.id}>
            {parentComment && (
              <ReplyThumbnail>
                <ReplyIconWrapper>
                  <ReplyIcon />
                </ReplyIconWrapper>
                <span>Replying to @{parentComment.user}</span>
                <CommentText>{parentComment.content}</CommentText>
              </ReplyThumbnail>
            )}
            <Username>
              <Avatar>{comment.user[0]}</Avatar>
              {comment.user_full_name}
            </Username>
            <CommentText>
              {comment.content}{' '}
              {user.username === comment.user && (
                <DeleteComment
                  room_id={room_id}
                  comment={comment}
                  handleCommentUpdated={handleCommentUpdated}
                />
              )}
              <ReplyComment
                room_id={room_id}
                comment={comment}
                handleReply={handleReply}
                addCommentRef={addCommentRef}
                replyParentComment={replyParentComment}
              />
            </CommentText>
          </CommentContainer>
        );
      })}
    </div>
  );
};

export default Comments2;
