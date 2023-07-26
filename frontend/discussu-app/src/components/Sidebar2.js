import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Col, Row, Nav, Image } from "react-bootstrap";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"; // settings
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone"; // logout
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone"; // message
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // edit
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined"; // my profile
import NoteAddIcon from "@mui/icons-material/NoteAdd"; // CREATE ROOM
import HomeIcon from "@mui/icons-material/Home";
import LogoutButton from "./LogoutButton";

const Sidebar2 = ({ setSearchQuery }) => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  // const userJSON = localStorage.getItem("user");
  // const user = userJSON ? JSON.parse(userJSON) : null;

  const location = useLocation();

  return (
    <div className="flex-column bg-light sidebar" variant="pills">
      <Container>
        <Row>
          <Col>
            {user ? (
              <div>
                <div className="text-center mt-2 sidebar_header">
                  <Image
                    src={user.profile_pic}
                    roundedCircle
                    className="profile-pic mr-3"
                  />
                  <h4>{user.full_name}</h4>

                  <small>@{user.username}</small>
                </div>
                <h6 className="text-center">{user.school_name}</h6>

                <Nav defaultActiveKey="/" className="flex-column mt-4">
                  {/* HOME */}
                  <Nav.Item className="sidebar-item">
                    <Nav.Link
                      as={Link}
                      to="/"
                      onClick={() => setSearchQuery("")}
                    >
                      <HomeIcon className="sidebar-img" /> Home
                    </Nav.Link>
                  </Nav.Item>

                  {/* CREATE ROOM */}
                  <Nav.Item className="sidebar-item">
                    <Nav.Link
                      className="ml-auto"
                      as={Link}
                      to="/room/create"
                      onClick={() => setSearchQuery("")}
                    >
                      <NoteAddIcon className="sidebar-img" /> Create Room
                    </Nav.Link>
                  </Nav.Item>

                  {/* PROFILE */}
                  <Nav.Item className="sidebar-item">
                    <Nav.Link as={Link} to="/user/profile">
                      <Person2OutlinedIcon className="sidebar-img" /> My Profile
                    </Nav.Link>
                  </Nav.Item>

                  {/* EDIT PROFILE */}
                  <Nav.Item className="sidebar-item">
                    <Nav.Link as={Link} to="/edit-profile">
                      <EditOutlinedIcon className="sidebar-img" /> Edit Profile
                    </Nav.Link>
                  </Nav.Item>

                  {/* INBOX */}
                  <Nav.Item className="sidebar-item">
                    <Nav.Link as={Link} to="./">
                      <EmailTwoToneIcon className="sidebar-img" /> Inbox
                    </Nav.Link>
                  </Nav.Item>

                  {/* SETTINGS */}
                  <Nav.Item className="sidebar-item">
                    <Nav.Link as={Link} to="./">
                      <SettingsOutlinedIcon className="sidebar-img" /> Settings
                    </Nav.Link>
                  </Nav.Item>

                  {/* LOGOUT */}
                  <Nav.Item className="sidebar-item">
                    <Nav.Link>
                      <LogoutTwoToneIcon className="sidebar-img" />
                      <LogoutButton />
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            ) : (
              <div className="text-center mt-4">
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={location.pathname === "/login" ? "/register" : "/login"}
                  >
                    <h4>
                      {location.pathname === "/login" ? "Register" : "Log in"}
                    </h4>
                  </Nav.Link>
                </Nav.Item>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sidebar2;

// const useStyles = makeStyles((theme) => ({
//   sidebar: {
//     backgroundColor: "#f9f9f9",
//     height: "100vh",
//     paddingTop: "1rem",
//     borderRight: "1px solid #ccc",
//   },
//   sidebarHeader: {
//     textAlign: "center",
//     marginBottom: "1rem",
//   },
//   sidebarItem: {
//     display: "flex",
//     alignItems: "center",
//     padding: "0.5rem 1rem",
//     "&:hover": {
//       backgroundColor: "#f1f1f1",
//       textDecoration: "none",
//     },
//   },
//   sidebarImg: {
//     marginRight: "0.5rem",
//   },
// }));

// const Sidebar2 = ({ setSearchQuery }) => {
//   const classes = useStyles();
//   const user = JSON.parse(localStorage.getItem("user"));
//   const location = useLocation();

//   return (
//     <div className={classes.sidebar}>
//       <Container>
//         <Row className={classes.sidebarHeader}>
//           <Col>
//             <h3>{user.full_name}</h3>
//             <small>@{user.username}</small>{" "}
//           </Col>
//         </Row>
//         <div className={classes.sidebarItem}>
//           <Link to="/" onClick={() => setSearchQuery("")}>
//             <HomeIcon className={classes.sidebarImg} /> Home
//           </Link>
//         </div>
//         <div className={classes.sidebarItem}>
//           <Link to={"/user/profile"}>
//             <Person2OutlinedIcon className={classes.sidebarImg} /> My Profile
//           </Link>
//         </div>
//         <div className={classes.sidebarItem}>
//           <Link to={"./"}>
//             <EditOutlinedIcon className={classes.sidebarImg} /> Edit Profile
//           </Link>
//         </div>
//         <div className={classes.sidebarItem}>
//           <Link to={"./"}>
//             <EmailTwoToneIcon className={classes.sidebarImg} /> Inbox
//           </Link>
//         </div>
//         <div className={classes.sidebarItem}>
//           <Link to={"./"}>
//             <SettingsOutlinedIcon className={classes.sidebarImg} /> Settings
//           </Link>
//         </div>
//         <div className={classes.sidebarItem}>
//           <LogoutTwoToneIcon className={classes.sidebarImg} />
//           <LogoutButton />
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default Sidebar2;
