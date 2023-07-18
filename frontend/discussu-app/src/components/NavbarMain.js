import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";
import { useLocation } from "react-router-dom";
// import LogoutButton from "./LogoutButton";
import UserNav from "./dropdown/UserNav";
import { Navbar, Nav } from "react-bootstrap";

// import UserNav from "./dropdown/UserNav";

const NavbarMain = ({ setSearchQuery, isopen, setIsOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [search, setSearch] = useState("");
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchQuery(search);

    // setSearch("");
    // navigate(`/?q=${searchQuery}`);
  };
  return (
    <Navbar className="navbar bg-light navbar-light navbar-expand-lg mb-4">
      <Navbar.Brand className="container logo">
        <Link to="/">
          <h1>LOGO</h1>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
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
        <Nav className=" mr-auto">
          <Nav.Link as={Link} to="/" onClick={() => setSearchQuery("")}>
            Home
          </Nav.Link>
        </Nav>

        <Nav className=" mr-auto">
          <Nav.Link as={Link} to="/room/create" onClick={() => setSearchQuery("")}>
            Create Room
          </Nav.Link>
        </Nav>

        <Nav className=" mr-auto">


          {user ? (
            <UserNav isopen={isopen} setIsOpen={setIsOpen} />
          ) : (
            <Nav.Link as={Link} to={location.pathname === "/login" ? "/register" : "/login"}>
              {location.pathname === "/login" ? "Register" : "Log in"}
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
      <hr />
    </Navbar>
  );
};

export default NavbarMain;

// import Dropdown from "react-bootstrap/Dropdown";
// <Dropdown>
            //   <Dropdown.Toggle
            //     variant="success"
            //     id="user-dropdown"
            //   >{`Hello ${user.username}`}</Dropdown.Toggle>

            //   <Dropdown.Menu>
            //     <Dropdown.Item as={Link} to="/" className="dropdown-item">
            //       Profile
            //     </Dropdown.Item>
            //     <Dropdown.Item>
            //       <LogoutButton/>
            //     </Dropdown.Item>
            //   </Dropdown.Menu>
            // </Dropdown>