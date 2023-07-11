import { useState } from "react";
import axios from "axios";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router";

const Login_auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useSignIn();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((email === "") | (password === "")) {
      alert("both fields must be filled!");
      // return
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/login/`,
        { email: email, password: password }
      );
      console.log('token:', response.data.token);
      console.log('expires:', response.data.expiry);
      console.log('userstate:', response.data.user.email);
    //   const expiresIn = expiresInMinutes(response.data.expiry);
     
      // save token
      if (
        signIn({
          token: response.data.token,
          expiresIn: 2880, // expiresIn
          tokenType: "Bearer",
          authState: response.data.user.email,
        //   refreshToken: response.data.refreshToken, // Only if you are using refreshToken feature
        //   refreshTokenExpireIn: response.data.refreshTokenExpireIn, // Only if you are using refreshToken feature
        })
      ) {
        navigate("/");
      } else {
        console.log("not signed in");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const expiresInMinutes = (expiry) => {
    const expiryDate = new Date(expiry);
    const currentTime = new Date();
    const timeDiff = expiryDate.getTime() - currentTime.getTime();
    const minutes = Math.floor(timeDiff / 60000); // Divide by 60000 to convert milliseconds to minutes
    return minutes;
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

export default Login_auth;
