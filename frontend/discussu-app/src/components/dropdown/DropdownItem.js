import { Link } from "react-router-dom"
import LogoutButton from "../LogoutButton"
import { useHomeStore } from "../../store"

const DropdownItem = ({icon, text, route}) => {
  const setIsopen = useHomeStore((state) => state.setIsopen)
  return (
    <li className="dropdownItem">
        {text==="Logout" ? ( 
          <>
          {icon} 
         <LogoutButton />
         </>)
        : (
          <Link to={route} onClick={() => setIsopen()}>{icon } {text}</Link>
        )}
        
    </li>
  )
}

export default DropdownItem