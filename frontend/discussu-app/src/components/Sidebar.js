import React from "react";
import { Link, useLocation } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"; // settings
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone"; // logout
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone"; // message
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // edit
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined"; // my profile
import HomeIcon from "@mui/icons-material/Home";
import LogoutButton from "./LogoutButton";


const Sidebar = ({ setSearchQuery }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  return (
    // sidebarItem
    <div className="flex-column bg-light sidebar" variant="pills">
      
      <div className="sidebar-sticky"></div>

      {user ? (
        <div className="">
          <div className="sidebar_header">
            <h3>{user.full_name}</h3>
            <small className="text-center">@{user.username}</small>{" "}
          </div>
          <h5 className="text-center">{user.school_name}</h5>

          {/* sidebar Items */}

          <div className="sidebar-item">
            <Link to="/" onClick={() => setSearchQuery("")}>
              <HomeIcon className={"sidebar-img"} /> Home
            </Link>
          </div>
          <div className="sidebar-item">
            <Link to={"/user/profile"}>
              <Person2OutlinedIcon className={"sidebar-img"} /> My Profile
            </Link>
          </div>

          <div className="sidebar-item">
            <Link to={"./"}>
              <EditOutlinedIcon className={"sidebar-img"} /> Edit Profile
            </Link>
          </div>

          <div className="sidebar-item">
            <Link to={"./"}>
              <EmailTwoToneIcon className={"sidebar-img"} /> Inbox{" "}
            </Link>
          </div>

          <div className="sidebar-item">
            <Link to={"./"}>
              <SettingsOutlinedIcon className={"sidebar-img"} /> Settings{" "}
            </Link>
          </div>

          <div className="sidebar-item">
            <LogoutTwoToneIcon className={"sidebar-img"} />
            <LogoutButton />
          </div>
        </div>
      ) : (
        <div className="sidebar-item">
          <Link to={location.pathname === "/login" ? "/register" : "/login"}>
            <h3>{location.pathname === "/login" ? "Register" : "Log in"}</h3>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
