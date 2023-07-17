import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import Cookies from "js-cookie";


import { useNavigate } from "react-router-dom";


const Login = () => {
  const { setAuth, setUser } = useContext(AuthContext);
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
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      console.log(JSON.stringify(response?.data));
      const token = response.data.token
      console.log(token)
      // const expiry = response.data.expiry
      const user = response.data.user


      Cookies.set('token', token)
      localStorage.setItem("user", JSON.stringify(user));
      setAuth({ token })
      setUser(user)
      // setUser(user)
      setEmail('');
      setPassword('')
      navigate("/")
    } catch (error) {
      if (!error?.response) {
        setErrMsg('No Service Response')
        console.error(error);
      } else {
        setErrMsg('Failed!')
      }
      errRef.current.focus()
    }

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

// const expiresIn = expiresInMinutes(expiry)
  // const expiresInMinutes = (expiry) => {
  //   const expiryDate = new Date(expiry);
  //   const currentTime = new Date();
  //   const timeDiff = expiryDate.getTime() - currentTime.getTime();
  //   const minutes = Math.floor(timeDiff / 60000); // Divide by 60000 to convert milliseconds to minutes
  //   return minutes;
  // };