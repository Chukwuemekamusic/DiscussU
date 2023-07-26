// import { FaReply } from "react-icons/fa";
import QuickreplyTwoToneIcon from "@mui/icons-material/QuickreplyTwoTone";
import { Button } from "react-bootstrap";

const ReplyComment = ({ comment, handleReply }) => {
  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleReply(comment)}
      >
        Reply
      </Button>
      {/* <QuickreplyTwoToneIcon
        onClick={() => handleReply(comment)}
        style={{ fontSize: "20px", color: "lightblue" }}
      /> */}
    </>
  );
};

export default ReplyComment;
