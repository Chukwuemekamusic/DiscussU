// import { useState } from "react";
import { FaReply } from "react-icons/fa";
// import AddComments from "./AddComments";

const ReplyComment = ({ room_id, comment, handleReply}) => {
//   const [showReply, setShowReply] = useState(false);
//   const [replyContent, setReplyContent] = useState("");

//   const handleReply = () => {
//     setShowReply(true);
//   };

//   const handleCancelReply = () => {
//     setShowReply(false);
//     setReplyContent("");
//   };

//   const handleAddReply = (e) => {
//     e.preventDefault();
//     // Pass the replyContent to AddComment component as parent_comment
//     // Perform necessary logic here, such as API calls, etc.
//     console.log("Reply Content:", replyContent);
//     setShowReply(false);
//     setReplyContent("");
//   };
    // addCommentRef.current.focus();
  return (
    <>
      <FaReply onClick={()=>handleReply(comment)} />

      {/* {showReply && (
        <div className="thumbnail mt-2">
          <p className="mb-0">{comment.content}</p>
          <div className="text-end">
            <button className="btn btn-sm btn-danger" onClick={handleCancelReply}>
              Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleAddReply}>
              Add Reply
            </button>
          </div>
        </div>
      )}

      {showReply && (
        <AddComments
          room_id={room_id}
          parent_comment={comment}
          content={replyContent}
          setContent={setReplyContent}
          autoFocus={true}
        />
      )} */}
    </>
  );
};

export default ReplyComment;
