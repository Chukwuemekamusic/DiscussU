import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const LOGIN_URL = "/users/login/";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
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
        { email:email, password:password },
        {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        }
      );
      console.log(JSON.stringify(response?.data));
      const token = response.data.token
      
      setAuth({token})
      setEmail('');
      setPassword('')
    } catch (error) {
        if (!error?.response) {
            setErrMsg('No Service Response')
        } else {
            setErrMsg('Failed!')
        }
        errRef.current.focus()
    }
    navigate("/")
  };

  return (
    <div className="container-lg p-3">
      <p
        ref={errRef}
        // className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          ref={userRef}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
