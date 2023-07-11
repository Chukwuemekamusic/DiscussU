import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";


const Navbar = () => {
  const {isAuthenticated} = useContext(AuthContext)
  
  const handleSubmit = (e) => {};
  return (
    <>
      <nav>
        <div>
          <Link to="/">
            <h1>LOGO</h1>
          </Link>

          <form action="">
            <input type="text" name="q" placeholder="Search Room..." />
          </form>
          {isAuthenticated ? (
            <>
              <p>Hello User</p>
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
      </nav>
    </>
  );
};

export default Navbar;
