import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = ({searchQuery, setSearchQuery}) => {
  const { user } = useContext(AuthContext);
  // const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  // const storedUser = localStorage.getItem('user')
  // const user = storedUser ? JSON.parse(storedUser) : null;

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/?q=${searchQuery}`);
  };
  return (
    <>
      <nav>
        <div>
          <Link to="/">
            <h1>LOGO</h1>
          </Link>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="q"
              placeholder="Search Room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {user ? (
            <>
              <p>Hello {user.username}</p>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link to="/login">LOG IN</Link>
              <br />
              <Link></Link>
            </>
          )}
          <Link></Link>
        </div>
        <hr />
      </nav>
    </>
  );
};

export default Navbar;
