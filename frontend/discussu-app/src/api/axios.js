import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "http://localhost:8000/api"
token = Cookies.get("token")

export default axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: token ? `Token ${token}` : null,
    'Content-Type' : 'application/json', 
    accept: 'application/json'
  }
});
