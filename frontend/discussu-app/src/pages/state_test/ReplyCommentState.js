// import { FaReply } from "react-icons/fa";
import QuickreplyTwoToneIcon from "@mui/icons-material/QuickreplyTwoTone";

const ReplyCommentState = ({ comment, handleReply }) => {
  return (
    <>
      <QuickreplyTwoToneIcon
        onClick={() => handleReply(comment)}
        style={{ fontSize: "20px", color: "lightblue" }}
      />
    </>
  );
};

export default ReplyCommentState;
