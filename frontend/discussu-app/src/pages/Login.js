import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import LoginTwoToneIcon from "@mui/icons-material/LoginTwoTone"; // login
import { useHomeStore } from "../store";

const Login = () => {
  const { setAuth} = useContext(AuthContext);
  const returnUserData = useHomeStore((state) => state.returnUserData)
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((email === "") | (password === "")) {
      alert("both fields must be filled!");
      // return
    }
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/login/`,
        { email: email, password: password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(JSON.stringify(response?.data));
      const token = response.data.token;
      const expiry = response.data.expiry
      console.log(token);
      // const expiry = response.data.expiry
      // const user = response.data.user;

      Cookies.set("token", token);
      Cookies.set("expiry", expiry)
      
      setAuth({ token });
      
      // reset input
      setEmail("");
      setPassword("");
      const user = await returnUserData(token) // retrieves the user detail and save to local storage
      localStorage.setItem("user", JSON.stringify(user))
      navigate("/");
    } catch (error) {
      if (!error?.response) {
        setErrMsg("No Service Response");
        console.error(error);
      } else {
        setErrMsg("Failed!");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="container-md p-3">
      <h3 style={{color: 'skyblue'}}>Log in Your Details</h3>
      <p
        ref={errRef}
        // className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
        className="text-danger"
      >
        {errMsg}
      </p>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          className="form-control"
          type="text"
          id="email"
          ref={userRef}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>

        <div className="mb-3">
        <label htmlFor="password" className="form-label"> Password</label>
        <input
        className="form-control"
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit" className="btn btn-primary">
          {" "}
          <LoginTwoToneIcon /> Login
        </button>
      </form>
      <p>If you don't have an account, click below</p>
      <Link to={"/register"}>register here</Link>
    </div>
  );
};

export default Login;