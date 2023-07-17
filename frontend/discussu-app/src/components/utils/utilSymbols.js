import QuickreplyTwoToneIcon from "@mui/icons-material/QuickreplyTwoTone";

export const MyReply = (handleReply, fontSize, color) => {
  return (
    <>
      <QuickreplyTwoToneIcon
        onClick={() => handleReply}
        style={{ fontSize: fontSize, color: color }}
      />
    </>
  );
};
