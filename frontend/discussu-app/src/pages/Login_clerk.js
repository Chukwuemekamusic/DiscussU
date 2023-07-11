import { useState, useRef, useEffect } from "react";
// import axios from "axios";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";


const Login_clerk = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useClerk()
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((email === "") | (password === "")) {
      alert("both fields must be filled!");
      // return
    }

    try {
        await signIn(email, password, {
          baseUrl: "http://localhost:8000", // Replace with your API URL
          path: "/api/users/login/",
        });
      navigate("/");    
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="container-lg p-3">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
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

export default Login_clerk;
