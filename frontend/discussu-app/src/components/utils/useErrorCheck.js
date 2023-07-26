import useHandleLogout from "./useHandleLogout";

const useErrorCheck = () => {
  const handleLogout = useHandleLogout();

  const errorCheck = (error) => {
    if (error.response) {
      // Handle API error (status code 4xx or 5xx)
      console.error(error.response.data);
      if (error.response.data.detail === "Invalid token.") {
        handleLogout();
      }
    } else if (error.request) {
      // Handle request error (no response received)
      console.error("No response from server.");
    } else {
      // Handle other errors
      console.error("An error occurred:", error.message);
    }
  };
  return errorCheck
};

export default useErrorCheck;
