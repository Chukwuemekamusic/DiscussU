import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav, Row, Col, Container } from "react-bootstrap";
import { HiHome } from "react-icons/hi";
import { RiEdit2Line, RiMailLine, RiSettings2Line, RiLogoutBoxLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import LogoutButton from "./LogoutButton";

const Sidebar3 = ({ setSearchQuery }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  return (
    <div className="bg-light ">
      <Container>
        <Row>
          <Col className="sidebar-header">
            <h3>{user.full_name}</h3>
            <small className="text-center">@{user.username}</small>
          </Col>
        </Row>
      </Container>

      {user ? (
        <div className="sidebar-items">
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => setSearchQuery("")}>
                <HiHome className="sidebar-icon" /> Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/user/profile">
                <IoPersonOutline className="sidebar-icon" /> My Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="./">
                <RiEdit2Line className="sidebar-icon" /> Edit Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="./">
                <RiMailLine className="sidebar-icon" /> Inbox
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="./">
                <RiSettings2Line className="sidebar-icon" /> Settings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link>
                <RiLogoutBoxLine className="sidebar-icon" /> <LogoutButton />
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      ) : (
        <div className="sidebar-items">
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link as={Link} to={location.pathname === "/login" ? "/register" : "/login"}>
                <h3>{location.pathname === "/login" ? "Register" : "Log in"}</h3>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      )}
    </div>
  );
};

export default Sidebar3;
