import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};
export default Navbar;
