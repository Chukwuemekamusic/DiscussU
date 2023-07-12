import useHandleLogout from "./useHandleLogout";

const useHandleAxiosError = () => {
  const handleLogout = useHandleLogout()

  const handleAxiosError = (error) => {

    if (error.response && error.response.status === 401) {// TODO LOG ERR.RES
      console.error(error)
      handleLogout()
    }
    console.error(error)

  }
  return handleAxiosError
}

export default useHandleAxiosError
