import { Link } from "react-router-dom";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";
// import LogoutButton from "./LogoutButton";
import { Navbar, Nav, FormControl } from "react-bootstrap";

// import UserNav from "./dropdown/UserNav";

const NavbarMain = ({ setSearchQuery, searchQuery }) => {
  // const user = localStorage.getItem ? JSON.parse(localStorage.getItem("user")) : null
  const [search, setSearch] = useState("");
  // const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchQuery(search);

    // setSearch("");
    navigate(`/?q=${searchQuery}`);
  };
  return (
    <Navbar className="navbar bg-light navbar-light navbar-expand-lg mb-4">
      <Navbar.Brand className="container logo">
        <Link to="/">
          <h1>DiscussU</h1>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">     
        <form style={{ display: "inline" }} className="ml-auto" onSubmit={handleSubmit}>  {/* form-inline my-2 my-lg-0 */}
          <FormControl
            className="form-control mr-sm-2"
            type="text"
            name="q"
            placeholder="Search Room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <Nav className="d-flex align-items-center">
          <Nav.Link as={Link} to="/" onClick={() => setSearchQuery("")}>
            Home
          </Nav.Link>

          {/* {user ? (
            <UserNav className="ml-auto" isopen={isopen} setIsOpen={setIsOpen} />
          ) : (
            <Nav.Link as={Link} to={location.pathname === "/login" ? "/register" : "/login"}>
              {location.pathname === "/login" ? "Register" : "Log in"}
            </Nav.Link>
          )} */}
        </Nav>
      </Navbar.Collapse>
      <hr />
    </Navbar>
  );
};

export default NavbarMain;

