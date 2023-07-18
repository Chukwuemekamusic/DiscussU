import { Link } from "react-router-dom";
// import LogoutButton from "../LogoutButton";
import DropdownItem from "./DropdownItem";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import useHandleLogout from "../utils/useHandleLogout";

// images
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"; // settings
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone"; // logout
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone"; // message

import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // edit
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined"; // my profile
import { Nav } from "react-bootstrap";

const UserNav = ({ isopen, setIsOpen }) => {
  const handleLogout = useHandleLogout();
  const {getStoredUser} = useContext(AuthContext);
  const user = getStoredUser();
  // const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Nav.Link className="menu-container ">
      <div className="menu-trigger">
        <Link onClick={() => setIsOpen(!isopen)}>Hello {user.username}</Link>
      </div>

      <div className={`dropdown-menu ${isopen ? "active" : "inactive"}`}>
        <h3>{user.full_name}</h3>
        <h5 className="text-center">{user.school_name}</h5>
        <ul>
          <DropdownItem
            icon={<Person2OutlinedIcon classname={"dropdownItem-img"} />}
            text={"My Profile"}
            route={"./"}
          />
          <DropdownItem
            icon={<EditOutlinedIcon />}
            text={"Edit Profile"}
            route={"./"}
          />
          <DropdownItem icon={<EmailTwoToneIcon />} text={"Inbox"} />
          <DropdownItem
            icon={<SettingsOutlinedIcon />}
            text={"Settings"}
            route={"./"}
          />
          <DropdownItem
            icon={<LogoutTwoToneIcon />}
            text={"Logout"}
            handle={handleLogout}
          />
        </ul>
      </div>
    </Nav.Link>
  );
};

export default UserNav;

// {
/* <li class="nav-item dropdown">
      {user ? (
        <>
          <Link
            classname="nav-link dropdown-toggle"
            
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <LogoutButton />
          </Link>
        </>
      ) : (
        <>
          <Link
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Login/Sign-up
          </Link>
        </>
      )}
    </li> */
// }
