import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import UserNav from "./dropdown/UserNav";
import Dropdown from "react-bootstrap/Dropdown";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
// import UserNav from "./dropdown/UserNav";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  // const storedUser = localStorage.getItem('user')
  // const user = storedUser ? JSON.parse(storedUser) : null;

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchQuery(search);

    setSearch("");
    // navigate(`/?q=${searchQuery}`);
  };
  return (
    <nav className="navbar bg-light navbar-light navbar-expand-lg mb-4">
      <div className="container logo">
        <Link to="/">
          <h1>LOGO</h1>
        </Link>
      </div>

      {/* <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button> */}

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
          <input
            className="form-control mr-sm-2"
            type="text"
            name="q"
            placeholder="Search Room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link
              to="/"
              onClick={() => setSearchQuery("")}
              className="nav-link"
            >
              Home
            </Link>
          </li>
          {user ? (
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Hello {user.username}
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <Link className="dropdown-item" to="/">
                  Profile
                </Link>
                <Link className="dropdown-item" to="#">
                  Another action
                </Link>
                <Link className="dropdown-item" to="#">
                  Something else here
                </Link>
              </div>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Log in
              </Link>
            </li>
          )}
        </ul>
      </div>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <hr />
    </nav>
  );
};

export default Navbar;
