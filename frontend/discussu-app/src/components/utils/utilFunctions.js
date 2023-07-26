import moment from "moment";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const title = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const handleDateAndTime = (date) =>
  moment(date).format("MMMM DD, YYYY [at] HH:mm:ss");

const handleDate = (date) => moment(date).format("MMMM DD, YYYY");

const ErrorCheck = (error) => {
  if (error.response) {
    // Handle API error (status code 4xx or 5xx)
    console.error(error.response.data);
    if (error.response.data.detail == "Invalid token") {
    }
  } else if (error.request) {
    // Handle request error (no response received)
    console.error("No response from server.");
  } else {
    // Handle other errors
    console.error("An error occurred:", error.message);
  }
};

const useGoBack = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const GoBackButton = () => (
    <ArrowBackIcon
      onClick={handleGoBack}
      style={{ cursor: "pointer" }}
      className="float-left"
    />
  );

  return GoBackButton;
};

export { title, ErrorCheck, handleDateAndTime, handleDate, useGoBack };
